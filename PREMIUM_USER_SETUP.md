# 👑 Crear Usuario Premium de Prueba

## Método 1: Desde Supabase Dashboard (Más Fácil)

### Paso 1: Crear el Usuario

1. **Ve a Supabase Dashboard:**
   - https://supabase.com/dashboard
   - Selecciona tu proyecto

2. **Crea un nuevo usuario:**
   - Ve a **Authentication** → **Users**
   - Haz clic en **"Add user"** → **"Create new user"**
   - **Email:** `premium@example.com` (o el que prefieras)
   - **Password:** `premium123456` (o el que prefieras)
   - **IMPORTANTE:** Marca ✅ **"Auto Confirm User"**
   - Haz clic en **"Create user"**

3. **Copia el User ID:**
   - Después de crear el usuario, verás una lista de usuarios
   - Haz clic en el usuario que acabas de crear
   - Copia el **User ID** (UUID)

### Paso 2: Crear la Suscripción Premium

1. **Ve al SQL Editor:**
   - Menú lateral → **SQL Editor**
   - Haz clic en **"New query"**

2. **Ejecuta este SQL** (cambia el email si usaste uno diferente):

```sql
DO $$
DECLARE
    v_user_id UUID;
    user_email TEXT := 'premium@example.com';  -- CAMBIA ESTE EMAIL si usaste otro
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
```

3. **Ejecuta el query** (haz clic en "Run" o presiona `Ctrl+Enter`)

### Paso 3: Verificar

Ejecuta este query para verificar que todo esté correcto:

```sql
SELECT 
    u.email,
    s.plan_type,
    s.status,
    ul.max_saved_signatures,
    ul.saved_signatures_count
FROM auth.users u
LEFT JOIN public.subscriptions s ON u.id = s.user_id
LEFT JOIN public.user_limits ul ON u.id = ul.user_id
WHERE u.email = 'premium@example.com';  -- Cambia el email si usaste otro
```

Deberías ver:
- `plan_type`: `premium`
- `status`: `active`
- `max_saved_signatures`: `-1` (ilimitado)

## Método 2: Usando el Script Automático

1. **Crea el usuario primero** (Método 1, Paso 1)

2. **Abre el archivo `create-premium-test-user.sql`**

3. **Edita el email:**
   - Cambia `'premium@example.com'` por el email del usuario que creaste

4. **Copia y pega todo el script** en el SQL Editor de Supabase

5. **Ejecuta el script**

El script automáticamente:
- Buscará el usuario por email
- Creará la suscripción Premium
- Configurará límites ilimitados

## Método 3: Usando Table Editor (Interfaz Gráfica)

### Crear Suscripción:

1. **Ve a Table Editor:**
   - Menú lateral → **Table Editor** → **subscriptions**

2. **Inserta nueva fila:**
   - Haz clic en **"Insert"** → **"Insert row"**
   - **user_id:** Pega el UUID del usuario (de Authentication → Users)
   - **plan_type:** Selecciona `premium`
   - **status:** Selecciona `active`
   - **current_period_start:** Fecha actual
   - **current_period_end:** Fecha + 1 año
   - **cancel_at_period_end:** `false`
   - Haz clic en **"Save"**

### Actualizar Límites:

1. **Ve a Table Editor:**
   - **Table Editor** → **user_limits**

2. **Inserta nueva fila:**
   - **user_id:** Pega el UUID del usuario
   - **saved_signatures_count:** `0`
   - **max_saved_signatures:** `-1` (esto significa ilimitado)
   - **last_reset_date:** Fecha actual
   - Haz clic en **"Save"**

## Tipos de Plan Disponibles

Puedes crear usuarios con estos planes:

- **`free`** - Plan gratuito (límite: 3 firmas)
- **`premium`** - Plan premium (ilimitado)
- **`team`** - Plan team (ilimitado)
- **`agency`** - Plan agency (ilimitado)

## Estados de Suscripción

- **`active`** - Suscripción activa
- **`canceled`** - Suscripción cancelada
- **`past_due`** - Pago vencido
- **`trialing`** - En periodo de prueba

## Límites de Firmas Guardadas

- **Plan Free:** `max_saved_signatures = 3`
- **Planes Premium/Team/Agency:** `max_saved_signatures = -1` (ilimitado)

## Probar el Usuario Premium

1. **Inicia sesión en la aplicación:**
   - Ve a `/login`
   - Email: `premium@example.com`
   - Password: `premium123456`

2. **Verifica funcionalidades Premium:**
   - ✅ Acceso a todos los templates (incluidos los premium)
   - ✅ Guardar firmas ilimitadas
   - ✅ Exportar PNG/PDF sin watermark
   - ✅ Acceso al AI Generator
   - ✅ Badge "Premium" visible en el dashboard

3. **Verifica en el Dashboard:**
   - Ve a `/dashboard/subscription`
   - Deberías ver "Premium Plan" como plan activo

## Solución de Problemas

### "Permission denied" al insertar suscripción

**Solución:** Asegúrate de estar usando el SQL Editor con permisos de administrador, o ejecuta el script desde el SQL Editor (no desde Table Editor).

### El usuario no aparece como Premium

**Verifica:**
1. Que la suscripción esté con `status = 'active'`
2. Que `plan_type = 'premium'`
3. Que el `user_id` coincida exactamente
4. Cierra sesión y vuelve a iniciar sesión en la aplicación

### Error: "duplicate key value violates unique constraint"

**Solución:** El usuario ya tiene una suscripción. Usa `ON CONFLICT` o primero elimina la suscripción existente:

```sql
DELETE FROM public.subscriptions WHERE user_id = 'TU-USER-ID-AQUI'::UUID;
```

Luego ejecuta el INSERT nuevamente.

## Comandos Útiles

### Ver todos los usuarios con sus planes:

```sql
SELECT 
    u.email,
    u.id,
    s.plan_type,
    s.status,
    ul.max_saved_signatures
FROM auth.users u
LEFT JOIN public.subscriptions s ON u.id = s.user_id
LEFT JOIN public.user_limits ul ON u.id = ul.user_id
ORDER BY u.created_at DESC;
```

### Eliminar suscripción Premium:

```sql
DELETE FROM public.subscriptions 
WHERE user_id = 'TU-USER-ID-AQUI'::UUID;
```

### Cambiar usuario a Free:

```sql
UPDATE public.subscriptions
SET plan_type = 'free', status = 'active'
WHERE user_id = 'TU-USER-ID-AQUI'::UUID;

UPDATE public.user_limits
SET max_saved_signatures = 3
WHERE user_id = 'TU-USER-ID-AQUI'::UUID;
```

