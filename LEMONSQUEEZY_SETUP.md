# 🍋 Configuración de LemonSqueezy

Esta guía te ayudará a configurar LemonSqueezy para el sistema de suscripciones.

## Pasos de Configuración

### 1. Crear Cuenta y Configurar Tienda en LemonSqueezy

1. Crea una cuenta en [LemonSqueezy](https://www.lemonsqueezy.com/)
2. Crea una nueva tienda o usa una existente
3. Anota tu **Store ID** (lo encontrarás en la configuración de la tienda)

### 2. Crear Productos y Variantes

Necesitas crear productos para cada plan:

#### Plan Premium
- **Producto**: "Signature For Me Premium"
- **Variante**: Mensual ($5/mes) y Anual ($49/año)
- Anota el **Variant ID** de cada variante

#### Plan Team (Opcional)
- **Producto**: "Signature For Me Team"
- **Variante**: Mensual ($29/mes) y Anual ($279/año)

#### Plan Agency (Opcional)
- **Producto**: "Signature For Me Agency"
- **Variante**: Mensual ($99/mes) y Anual ($949/año)

### 3. Obtener Credenciales de API

1. Ve a **Settings** → **API** en LemonSqueezy
2. Genera una nueva **API Key**
3. Anota la clave (solo se mostrará una vez)

### 4. Configurar Webhook

1. Ve a **Settings** → **Webhooks** en LemonSqueezy
2. Crea un nuevo webhook con la URL:
   ```
   https://tu-dominio.com/api/lemonsqueezy/webhook
   ```
   Para desarrollo local, usa un túnel como ngrok:
   ```
   https://tu-tunel.ngrok.io/api/lemonsqueezy/webhook
   ```
3. Selecciona los siguientes eventos:
   - `subscription_created`
   - `subscription_updated`
   - `subscription_cancelled`
   - `subscription_payment_success`
   - `subscription_payment_failed`
   - `subscription_expired`
   - `order_created`
4. Anota el **Webhook Secret** que se genera

### 5. Variables de Entorno

Agrega las siguientes variables a tu `.env.local`:

```env
# LemonSqueezy Configuration
LEMONSQUEEZY_API_KEY=tu_api_key_aqui
LEMONSQUEEZY_STORE_ID=tu_store_id_aqui
LEMONSQUEEZY_WEBHOOK_SECRET=tu_webhook_secret_aqui

# Variant IDs (IDs de las variantes de cada plan)
LEMONSQUEEZY_PREMIUM_VARIANT_ID=variante_id_mensual_o_anual
LEMONSQUEEZY_TEAM_VARIANT_ID=variante_id_team (opcional)
LEMONSQUEEZY_AGENCY_VARIANT_ID=variante_id_agency (opcional)

# URL de la aplicación
NEXT_PUBLIC_APP_URL=http://localhost:3000
# En producción: NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

### 6. Actualizar Base de Datos

Ejecuta el script SQL actualizado para cambiar los campos de Stripe a LemonSqueezy:

```sql
-- Actualizar columnas de Stripe a LemonSqueezy
ALTER TABLE public.subscriptions 
  RENAME COLUMN stripe_subscription_id TO lemonsqueezy_subscription_id;

ALTER TABLE public.subscriptions 
  RENAME COLUMN stripe_customer_id TO lemonsqueezy_customer_id;

-- Agregar nuevas columnas específicas de LemonSqueezy
ALTER TABLE public.subscriptions 
  ADD COLUMN IF NOT EXISTS lemonsqueezy_order_id TEXT,
  ADD COLUMN IF NOT EXISTS lemonsqueezy_variant_id TEXT;
```

O ejecuta el script completo `supabase-subscriptions.sql` actualizado.

## Uso de la API

### Crear Checkout

```typescript
// En tu componente
const createCheckout = async (variantId: string) => {
  const response = await fetch('/api/lemonsqueezy/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`, // Token de Supabase
    },
    body: JSON.stringify({
      variantId: variantId,
    }),
  });

  const { checkout_url } = await response.json();
  window.location.href = checkout_url;
};
```

### Verificar Estado de Suscripción

El webhook actualiza automáticamente las suscripciones en la base de datos. Puedes usar el hook `useSubscription` existente para verificar el estado.

## Webhooks

Los webhooks se procesan automáticamente en `/api/lemonsqueezy/webhook`. 

Eventos manejados:
- ✅ `subscription_created` - Crea nueva suscripción
- ✅ `subscription_updated` - Actualiza suscripción existente
- ✅ `subscription_payment_success` - Confirma pago exitoso
- ✅ `subscription_cancelled` - Cancela suscripción
- ✅ `subscription_payment_failed` - Marca como past_due
- ✅ `subscription_expired` - Marca como cancelada
- ✅ `order_created` - Guarda order_id

## Pruebas

LemonSqueezy tiene un modo de prueba. Asegúrate de:
1. Usar variantes de prueba
2. Configurar `test_mode: true` en el checkout (ya está configurado)
3. Usar tarjetas de prueba de LemonSqueezy

## Recursos

- [Documentación de LemonSqueezy API](https://docs.lemonsqueezy.com/api)
- [Guía de Webhooks](https://docs.lemonsqueezy.com/help/webhooks)
- [Tarjetas de Prueba](https://docs.lemonsqueezy.com/help/testing)

