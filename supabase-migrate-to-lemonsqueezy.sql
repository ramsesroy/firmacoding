-- Script de migración para cambiar de Stripe a LemonSqueezy
-- Ejecuta este script si ya tienes la tabla subscriptions creada con campos de Stripe

-- Renombrar columnas existentes
DO $$ 
BEGIN
  -- Renombrar stripe_subscription_id si existe
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'subscriptions' 
    AND column_name = 'stripe_subscription_id'
  ) THEN
    ALTER TABLE public.subscriptions 
    RENAME COLUMN stripe_subscription_id TO lemonsqueezy_subscription_id;
  END IF;

  -- Renombrar stripe_customer_id si existe
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'subscriptions' 
    AND column_name = 'stripe_customer_id'
  ) THEN
    ALTER TABLE public.subscriptions 
    RENAME COLUMN stripe_customer_id TO lemonsqueezy_customer_id;
  END IF;
END $$;

-- Agregar nuevas columnas específicas de LemonSqueezy si no existen
ALTER TABLE public.subscriptions 
  ADD COLUMN IF NOT EXISTS lemonsqueezy_order_id TEXT,
  ADD COLUMN IF NOT EXISTS lemonsqueezy_variant_id TEXT;

-- Actualizar índices
DROP INDEX IF EXISTS subscriptions_stripe_subscription_id_idx;
CREATE INDEX IF NOT EXISTS subscriptions_lemonsqueezy_subscription_id_idx 
  ON public.subscriptions(lemonsqueezy_subscription_id);

-- Comentarios para documentación
COMMENT ON COLUMN public.subscriptions.lemonsqueezy_subscription_id IS 'ID de la suscripción en LemonSqueezy';
COMMENT ON COLUMN public.subscriptions.lemonsqueezy_customer_id IS 'ID del cliente en LemonSqueezy';
COMMENT ON COLUMN public.subscriptions.lemonsqueezy_order_id IS 'ID de la orden en LemonSqueezy';
COMMENT ON COLUMN public.subscriptions.lemonsqueezy_variant_id IS 'ID de la variante del producto en LemonSqueezy';

