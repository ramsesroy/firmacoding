# 📋 Instrucciones para Ejecutar el SQL en Supabase

## Pasos a Seguir:

### 1. Acceder al SQL Editor de Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. En el menú lateral izquierdo, haz clic en **"SQL Editor"** (icono de terminal/consola)
3. Haz clic en el botón **"New query"** o **"+"** para crear una nueva consulta

### 2. Ejecutar el Script

1. Copia TODO el contenido del archivo `supabase-subscriptions.sql`
2. Pega el contenido en el editor SQL de Supabase
3. Haz clic en el botón **"Run"** (o presiona `Ctrl + Enter` / `Cmd + Enter`)

### 3. Verificar que se Ejecutó Correctamente

Después de ejecutar el script, deberías ver un mensaje de éxito. Para verificar:

1. Ve a la sección **"Table Editor"** en el menú lateral
2. Deberías ver dos nuevas tablas:
   - ✅ `subscriptions`
   - ✅ `user_limits`

3. También puedes verificar las funciones ejecutando:
   ```sql
   SELECT routine_name 
   FROM information_schema.routines 
   WHERE routine_schema = 'public' 
   AND routine_name IN (
     'increment_saved_signatures', 
     'decrement_saved_signatures',
     'create_default_subscription'
   );
   ```

### 4. Para Usuarios Existentes (Opcional)

Si ya tienes usuarios registrados en tu aplicación, puedes crear suscripciones free para ellos ejecutando este script adicional:

```sql
-- Crear suscripciones free para usuarios existentes que no tienen suscripción
INSERT INTO public.subscriptions (user_id, plan_type, status, current_period_start, current_period_end, cancel_at_period_end)
SELECT 
  id,
  'free',
  'active',
  TIMEZONE('utc', NOW()),
  TIMEZONE('utc', NOW() + INTERVAL '100 years'),
  false
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.subscriptions)
ON CONFLICT (user_id) DO NOTHING;

-- Crear límites para usuarios existentes que no tienen límites
INSERT INTO public.user_limits (user_id, saved_signatures_count, max_saved_signatures, last_reset_date)
SELECT 
  id,
  0,
  3,
  CURRENT_DATE
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_limits)
ON CONFLICT (user_id) DO NOTHING;
```

### 5. Verificar Permisos RLS

Para asegurarte de que las políticas RLS están correctamente configuradas:

1. Ve a **"Authentication" > "Policies"** en Supabase
2. Deberías ver políticas para ambas tablas:
   - `subscriptions`: "Users can view own subscription", "Users can insert own subscription", "Users can update own subscription"
   - `user_limits`: "Users can view own limits", "Users can insert own limits", "Users can update own limits"

### ⚠️ Notas Importantes:

- **La función `handle_updated_at()`** debe existir antes de ejecutar este script. Si no existe, ejecuta primero el script `supabase-setup.sql` que contiene esta función.
- **El trigger `on_auth_user_created`** se ejecutará automáticamente para todos los nuevos usuarios que se registren después de ejecutar este script.
- Los usuarios que ya existan necesitarán que les crees suscripciones manualmente (usando el script del paso 4) o esperarán hasta que se registre un nuevo usuario para que se cree automáticamente.

### ✅ Una vez completado:

Después de ejecutar el SQL exitosamente, el sistema premium estará listo para:
- ✅ Crear suscripciones free automáticamente para nuevos usuarios
- ✅ Limitar a 3 firmas guardadas para usuarios free
- ✅ Verificar estado premium en el código
- ✅ Gestionar límites de usuarios

---

**¿Problemas?** Si encuentras algún error al ejecutar el SQL, compártelo y te ayudo a solucionarlo.

