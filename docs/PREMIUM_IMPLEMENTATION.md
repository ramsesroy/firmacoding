# Guía de Implementación: Sistema Premium de Pago

## 📋 Funciones y Componentes Necesarios

### 1. **Base de Datos - Tabla de Suscripciones**

```sql
-- Crear tabla de suscripciones
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'premium', 'team', 'agency')),
    status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
    stripe_subscription_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    trial_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_stripe_subscription_id_idx ON public.subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON public.subscriptions(status);

-- RLS Policies
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
    ON public.subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
    ON public.subscriptions
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Función para actualizar updated_at
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
```

### 2. **Tabla de Límites de Usuario (Para Free Users)**

```sql
CREATE TABLE IF NOT EXISTS public.user_limits (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    saved_signatures_count INTEGER DEFAULT 0,
    max_saved_signatures INTEGER DEFAULT 3, -- Free users limit
    last_reset_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- RLS
ALTER TABLE public.user_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own limits"
    ON public.user_limits
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own limits"
    ON public.user_limits
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
```

### 3. **Utilidades TypeScript - Verificación de Premium**

```typescript
// src/lib/subscriptionUtils.ts
export type PlanType = 'free' | 'premium' | 'team' | 'agency';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: PlanType;
  status: SubscriptionStatus;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  trial_end?: string;
  created_at: string;
  updated_at: string;
}

// Verificar si usuario tiene plan premium activo
export async function isPremiumUser(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('plan_type, status, current_period_end')
    .eq('user_id', userId)
    .single();

  if (error || !data) return false;

  // Verificar que el plan no sea free y esté activo
  const isActive = data.status === 'active' || data.status === 'trialing';
  const isPremium = data.plan_type !== 'free';
  const isNotExpired = new Date(data.current_period_end) > new Date();

  return isActive && isPremium && isNotExpired;
}

// Obtener información de suscripción del usuario
export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;
  return data;
}

// Verificar límite de firmas guardadas para usuarios free
export async function canSaveSignature(userId: string): Promise<{ canSave: boolean; remaining: number }> {
  const subscription = await getUserSubscription(userId);
  
  // Premium users tienen límite ilimitado
  if (subscription && subscription.plan_type !== 'free' && subscription.status === 'active') {
    return { canSave: true, remaining: -1 }; // -1 significa ilimitado
  }

  // Para usuarios free, verificar límite
  const { data: limits } = await supabase
    .from('user_limits')
    .select('saved_signatures_count, max_saved_signatures')
    .eq('user_id', userId)
    .single();

  if (!limits) {
    // Crear registro inicial
    await supabase.from('user_limits').insert({
      user_id: userId,
      saved_signatures_count: 0,
      max_saved_signatures: 3
    });
    return { canSave: true, remaining: 3 };
  }

  const remaining = limits.max_saved_signatures - limits.saved_signatures_count;
  return { canSave: remaining > 0, remaining: Math.max(0, remaining) };
}

// Incrementar contador de firmas guardadas
export async function incrementSavedSignatures(userId: string): Promise<void> {
  await supabase.rpc('increment_saved_signatures', { user_id: userId });
}

// Decrementar contador de firmas guardadas
export async function decrementSavedSignatures(userId: string): Promise<void> {
  await supabase.rpc('decrement_saved_signatures', { user_id: userId });
}
```

### 4. **Hook React para Verificar Premium**

```typescript
// src/hooks/useSubscription.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getUserSubscription, isPremiumUser, Subscription } from '@/lib/subscriptionUtils';

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setSubscription(null);
        setIsPremium(false);
        setLoading(false);
        return;
      }

      const sub = await getUserSubscription(session.user.id);
      const premium = await isPremiumUser(session.user.id);
      
      setSubscription(sub);
      setIsPremium(premium);
      setLoading(false);
    };

    checkSubscription();

    // Listen for auth changes
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(() => {
      checkSubscription();
    });

    return () => authSub.unsubscribe();
  }, []);

  return { subscription, isPremium, loading };
}
```

### 5. **Integración con Stripe**

```typescript
// src/lib/stripeUtils.ts
// Frontend: Crear checkout session
export async function createCheckoutSession(priceId: string, userId: string) {
  const response = await fetch('/api/stripe/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId, userId })
  });
  return response.json();
}

// Frontend: Crear portal de gestión
export async function createPortalSession(customerId: string) {
  const response = await fetch('/api/stripe/create-portal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerId })
  });
  return response.json();
}
```

### 6. **API Routes para Stripe**

```typescript
// src/app/api/stripe/create-checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: NextRequest) {
  const { priceId, userId } = await request.json();

  const session = await stripe.checkout.sessions.create({
    customer_email: userId, // O obtener email del usuario
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
    metadata: { userId },
  });

  return NextResponse.json({ sessionId: session.id });
}
```

### 7. **Webhook Handler para Stripe**

```typescript
// src/app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabaseClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;
  }

  return NextResponse.json({ received: true });
}
```

### 8. **Actualización del Dashboard para Verificar Premium**

```typescript
// En dashboard/page.tsx
import { useSubscription } from '@/hooks/useSubscription';
import { canSaveSignature } from '@/lib/subscriptionUtils';

// Dentro del componente:
const { isPremium, subscription, loading: subscriptionLoading } = useSubscription();

// Al guardar firma:
const handleSaveSignature = async () => {
  if (!isAuthenticated) {
    showToast("Please sign in to save signatures", "info");
    router.push("/login");
    return;
  }

  const { canSave, remaining } = await canSaveSignature(session.user.id);
  
  if (!canSave) {
    showToast(`Free plan limit reached! Upgrade to save more signatures.`, "info");
    router.push("/dashboard?upgrade=true");
    return;
  }

  // Proceder a guardar...
};
```

### 9. **Restricciones Premium vs Free**

**Free Users:**
- ✅ 6 templates básicos
- ✅ Crear firmas ilimitadas (sin guardar)
- ❌ Guardar máximo 3 firmas
- ❌ Templates premium
- ❌ Export PNG/PDF sin marca de agua
- ❌ Analytics de clicks
- ❌ QR dinámico

**Premium Users:**
- ✅ Todos los templates (20+)
- ✅ Guardar firmas ilimitadas
- ✅ Export PNG/PDF sin marca de agua
- ✅ Analytics de clicks
- ✅ QR dinámico
- ✅ Soporte prioritario

### 10. **Página de Gestión de Suscripción**

```typescript
// src/app/dashboard/subscription/page.tsx
- Mostrar plan actual
- Botón para upgrade/downgrade
- Botón para cancelar suscripción
- Historial de pagos
- Renovación automática info
```

## 🔧 Configuración Necesaria

### Variables de Entorno Adicionales

```env
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
```

### Funciones SQL Adicionales en Supabase

```sql
-- Función para incrementar contador
CREATE OR REPLACE FUNCTION increment_saved_signatures(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE user_limits
  SET saved_signatures_count = saved_signatures_count + 1,
      updated_at = TIMEZONE('utc', NOW())
  WHERE user_id = increment_saved_signatures.user_id;
  
  -- Si no existe, crear
  IF NOT FOUND THEN
    INSERT INTO user_limits (user_id, saved_signatures_count)
    VALUES (increment_saved_signatures.user_id, 1);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Función para decrementar contador
CREATE OR REPLACE FUNCTION decrement_saved_signatures(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE user_limits
  SET saved_signatures_count = GREATEST(0, saved_signatures_count - 1),
      updated_at = TIMEZONE('utc', NOW())
  WHERE user_id = decrement_saved_signatures.user_id;
END;
$$ LANGUAGE plpgsql;
```

## 📝 Checklist de Implementación

- [ ] Crear tablas en Supabase (subscriptions, user_limits)
- [ ] Instalar y configurar Stripe SDK
- [ ] Crear funciones de utilidad (subscriptionUtils.ts)
- [ ] Crear hook useSubscription
- [ ] Crear API routes para Stripe
- [ ] Configurar webhooks de Stripe
- [ ] Actualizar dashboard para verificar premium
- [ ] Implementar límite de 3 firmas para free users
- [ ] Crear página de gestión de suscripción
- [ ] Actualizar Pricing component con enlaces a checkout
- [ ] Agregar indicadores visuales de plan premium
- [ ] Implementar restricciones de export (marca de agua)
- [ ] Crear sistema de analytics (solo premium)
- [ ] Testing completo del flujo de pago

