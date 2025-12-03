-- Script SQL para crear suscripciones free para usuarios existentes
-- Ejecuta este script DESPUÉS de ejecutar supabase-subscriptions.sql
-- Solo es necesario si ya tienes usuarios registrados antes de ejecutar el script principal

-- Crear suscripciones free para usuarios existentes que no tienen suscripción
INSERT INTO public.subscriptions (
    user_id, 
    plan_type, 
    status, 
    current_period_start, 
    current_period_end, 
    cancel_at_period_end
)
SELECT 
  id,
  'free',
  'active',
  TIMEZONE('utc', NOW()),
  TIMEZONE('utc', NOW() + INTERVAL '100 years'),
  false
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.subscriptions WHERE user_id IS NOT NULL)
ON CONFLICT (user_id) DO NOTHING;

-- Crear límites para usuarios existentes que no tienen límites
INSERT INTO public.user_limits (
    user_id, 
    saved_signatures_count, 
    max_saved_signatures, 
    last_reset_date
)
SELECT 
  id,
  COALESCE((SELECT COUNT(*) FROM public.signatures WHERE user_id = auth.users.id), 0),
  3,
  CURRENT_DATE
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_limits WHERE user_id IS NOT NULL)
ON CONFLICT (user_id) DO NOTHING;

-- Actualizar contador de firmas guardadas para usuarios que ya tienen firmas
UPDATE public.user_limits ul
SET saved_signatures_count = (
  SELECT COUNT(*) 
  FROM public.signatures 
  WHERE user_id = ul.user_id
)
WHERE EXISTS (
  SELECT 1 
  FROM public.signatures 
  WHERE user_id = ul.user_id
);

