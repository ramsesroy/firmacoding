-- Script SQL para crear las tablas de suscripciones y límites de usuario en Supabase
-- Ejecuta este script en el SQL Editor de tu proyecto Supabase

-- ============================================
-- FUNCIÓN BASE: handle_updated_at (si no existe)
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TABLA DE SUSCRIPCIONES
-- ============================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'premium', 'team', 'agency')),
    status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
    lemonsqueezy_subscription_id TEXT UNIQUE,
    lemonsqueezy_customer_id TEXT,
    lemonsqueezy_order_id TEXT,
    lemonsqueezy_variant_id TEXT,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    trial_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Índices para suscripciones
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_lemonsqueezy_subscription_id_idx ON public.subscriptions(lemonsqueezy_subscription_id);
CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS subscriptions_plan_type_idx ON public.subscriptions(plan_type);

-- Habilitar Row Level Security
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para suscripciones
CREATE POLICY "Users can view own subscription"
    ON public.subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription"
    ON public.subscriptions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
    ON public.subscriptions
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- TABLA DE LÍMITES DE USUARIO
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_limits (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    saved_signatures_count INTEGER DEFAULT 0,
    max_saved_signatures INTEGER DEFAULT 3,
    last_reset_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Índices para límites
CREATE INDEX IF NOT EXISTS user_limits_user_id_idx ON public.user_limits(user_id);

-- Habilitar Row Level Security
ALTER TABLE public.user_limits ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para límites
CREATE POLICY "Users can view own limits"
    ON public.user_limits
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own limits"
    ON public.user_limits
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own limits"
    ON public.user_limits
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_user_limits_updated_at
    BEFORE UPDATE ON public.user_limits
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- FUNCIONES SQL
-- ============================================

-- Función para incrementar contador de firmas guardadas
CREATE OR REPLACE FUNCTION increment_saved_signatures(p_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE user_limits
  SET saved_signatures_count = saved_signatures_count + 1,
      updated_at = TIMEZONE('utc', NOW())
  WHERE user_id = p_user_id;
  
  -- Si no existe, crear registro
  IF NOT FOUND THEN
    INSERT INTO user_limits (user_id, saved_signatures_count, max_saved_signatures, last_reset_date)
    VALUES (p_user_id, 1, 3, CURRENT_DATE)
    ON CONFLICT (user_id) DO UPDATE
    SET saved_signatures_count = user_limits.saved_signatures_count + 1,
        updated_at = TIMEZONE('utc', NOW());
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para decrementar contador de firmas guardadas
CREATE OR REPLACE FUNCTION decrement_saved_signatures(p_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE user_limits
  SET saved_signatures_count = GREATEST(0, saved_signatures_count - 1),
      updated_at = TIMEZONE('utc', NOW())
  WHERE user_id = p_user_id;
  
  -- Si no existe, crear registro con count = 0
  IF NOT FOUND THEN
    INSERT INTO user_limits (user_id, saved_signatures_count, max_saved_signatures, last_reset_date)
    VALUES (p_user_id, 0, 3, CURRENT_DATE)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para crear suscripción free por defecto cuando se crea un usuario
CREATE OR REPLACE FUNCTION create_default_subscription()
RETURNS TRIGGER AS $$
BEGIN
  -- Crear suscripción free por defecto
  INSERT INTO public.subscriptions (
    user_id,
    plan_type,
    status,
    current_period_start,
    current_period_end,
    cancel_at_period_end
  ) VALUES (
    NEW.id,
    'free',
    'active',
    TIMEZONE('utc', NOW()),
    TIMEZONE('utc', NOW() + INTERVAL '100 years'), -- Ilimitado para usuarios free
    false
  );
  
  -- Crear límites por defecto
  INSERT INTO public.user_limits (
    user_id,
    saved_signatures_count,
    max_saved_signatures,
    last_reset_date
  ) VALUES (
    NEW.id,
    0,
    3,
    CURRENT_DATE
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear suscripción y límites cuando se crea un usuario
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_subscription();

