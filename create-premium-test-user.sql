-- Script SQL para crear un usuario Premium de prueba en Supabase
-- Ejecuta este script en el SQL Editor de tu proyecto Supabase
-- IMPORTANTE: Necesitas ejecutar esto como administrador (service_role key)

-- ============================================
-- PASO 1: Crear el usuario en auth.users
-- ============================================
-- NOTA: Este paso debes hacerlo manualmente desde la UI de Supabase o usar la función create_default_subscription
-- Si el usuario ya existe, obtén su ID desde Authentication > Users

-- Obtener el ID del usuario (reemplaza 'premium@example.com' con el email del usuario que quieres hacer premium)
-- Si necesitas crear el usuario primero, hazlo desde Authentication > Users en el Dashboard
DO $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Obtener el ID del usuario por email
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'premium@example.com';

    -- Si el usuario no existe, mostrar mensaje
    IF v_user_id IS NULL THEN
        RAISE NOTICE 'Usuario no encontrado. Por favor crea el usuario primero desde Authentication > Users';
        RAISE NOTICE 'O cambia el email en este script por el email de un usuario existente';
        RETURN;
    END IF;

    RAISE NOTICE 'Usuario encontrado con ID: %', v_user_id;

    -- ============================================
    -- PASO 2: Crear suscripción Premium
    -- ============================================
    -- Eliminar suscripción existente si existe
    DELETE FROM public.subscriptions WHERE user_id = v_user_id;

    -- Insertar nueva suscripción Premium
    INSERT INTO public.subscriptions (
        user_id,
        plan_type,
        status,
        current_period_start,
        current_period_end,
        cancel_at_period_end
    ) VALUES (
        v_user_id,
        'premium',  -- Plan premium
        'active',   -- Estado activo
        NOW(),      -- Periodo inicio: ahora
        NOW() + INTERVAL '1 year',  -- Periodo fin: 1 año desde ahora
        FALSE       -- No cancelar al final del período
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET
        plan_type = 'premium',
        status = 'active',
        current_period_start = NOW(),
        current_period_end = NOW() + INTERVAL '1 year',
        cancel_at_period_end = FALSE,
        updated_at = NOW();

    RAISE NOTICE 'Suscripción Premium creada/actualizada para el usuario';

    -- ============================================
    -- PASO 3: Actualizar límites de usuario (ilimitado para Premium)
    -- ============================================
    -- Crear o actualizar límites del usuario
    INSERT INTO public.user_limits (
        user_id,
        saved_signatures_count,
        max_saved_signatures,  -- -1 significa ilimitado
        last_reset_date
    ) VALUES (
        v_user_id,
        0,        -- Contador inicial en 0
        -1,       -- -1 = ilimitado para usuarios premium
        CURRENT_DATE
    )
    ON CONFLICT (user_id)
    DO UPDATE SET
        max_saved_signatures = -1,  -- Ilimitado
        updated_at = NOW();

    RAISE NOTICE 'Límites actualizados: ilimitado para usuario Premium';
    RAISE NOTICE '¡Usuario Premium configurado correctamente!';

END $$;

-- ============================================
-- ALTERNATIVA: Si ya tienes el USER_ID directamente
-- ============================================
-- Reemplaza 'TU-USER-ID-AQUI' con el UUID real del usuario
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
    updated_at = NOW();

-- Actualizar límites
INSERT INTO public.user_limits (
    user_id,
    max_saved_signatures
) VALUES (
    'TU-USER-ID-AQUI'::UUID,
    -1  -- Ilimitado
)
ON CONFLICT (user_id)
DO UPDATE SET
    max_saved_signatures = -1;
*/

-- ============================================
-- VERIFICAR: Consultar datos del usuario Premium
-- ============================================
/*
SELECT 
    u.email,
    u.id as user_id,
    s.plan_type,
    s.status,
    s.current_period_end,
    ul.max_saved_signatures,
    ul.saved_signatures_count
FROM auth.users u
LEFT JOIN public.subscriptions s ON u.id = s.user_id
LEFT JOIN public.user_limits ul ON u.id = ul.user_id
WHERE u.email = 'premium@example.com';
*/

