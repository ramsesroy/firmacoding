-- Script SQL SIMPLE para crear usuario Premium de prueba
-- INSTRUCCIONES:
-- 1. Reemplaza 'TU-USER-ID-AQUI' con el UUID real del usuario
-- 2. O reemplaza 'premium@example.com' con el email del usuario
-- 3. Ejecuta en Supabase SQL Editor

-- OPCIÓN 1: Usando el UUID del usuario directamente
-- Descomenta y reemplaza el UUID:
/*
INSERT INTO public.subscriptions (
    user_id,
    plan_type,
    status,
    current_period_start,
    current_period_end,
    cancel_at_period_end
) VALUES (
    'TU-USER-ID-AQUI'::UUID,
    'premium',
    'active',
    NOW(),
    NOW() + INTERVAL '1 year',
    FALSE
)
ON CONFLICT (user_id) 
DO UPDATE SET
    plan_type = 'premium',
    status = 'active',
    current_period_start = NOW(),
    current_period_end = NOW() + INTERVAL '1 year',
    cancel_at_period_end = FALSE,
    updated_at = NOW();

INSERT INTO public.user_limits (
    user_id,
    saved_signatures_count,
    max_saved_signatures,
    last_reset_date
) VALUES (
    'TU-USER-ID-AQUI'::UUID,
    0,
    -1,
    CURRENT_DATE
)
ON CONFLICT (user_id)
DO UPDATE SET
    max_saved_signatures = -1,
    updated_at = NOW();
*/

-- OPCIÓN 2: Usando el email del usuario (MÁS FÁCIL)
-- Descomenta y reemplaza el email:
DO $$
DECLARE
    v_user_id UUID;
    user_email TEXT := 'premium@example.com';  -- CAMBIA ESTE EMAIL
BEGIN
    -- Buscar el usuario por email
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = user_email;

    -- Verificar si el usuario existe
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Usuario con email % no encontrado. Por favor crea el usuario primero.', user_email;
    END IF;

    -- Crear/Actualizar suscripción Premium
    INSERT INTO public.subscriptions (
        user_id,
        plan_type,
        status,
        current_period_start,
        current_period_end,
        cancel_at_period_end
    ) VALUES (
        v_user_id,
        'premium',
        'active',
        NOW(),
        NOW() + INTERVAL '1 year',
        FALSE
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET
        plan_type = 'premium',
        status = 'active',
        current_period_start = NOW(),
        current_period_end = NOW() + INTERVAL '1 year',
        cancel_at_period_end = FALSE,
        updated_at = NOW();

    -- Crear/Actualizar límites (ilimitado)
    INSERT INTO public.user_limits (
        user_id,
        saved_signatures_count,
        max_saved_signatures,
        last_reset_date
    ) VALUES (
        v_user_id,
        0,
        -1,
        CURRENT_DATE
    )
    ON CONFLICT (user_id)
    DO UPDATE SET
        max_saved_signatures = -1,
        updated_at = NOW();

    RAISE NOTICE 'Usuario Premium configurado correctamente para: % (ID: %)', user_email, v_user_id;
END $$;

