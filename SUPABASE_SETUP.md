# Configuración de Supabase para Guardar Firmas

## Problema Común: Error al Guardar Firmas Después de Login

Si después de hacer login correctamente, al intentar guardar una firma aparece un error, probablemente es un problema de **Row Level Security (RLS)** en Supabase.

## Solución: Configurar Políticas RLS

### 1. Habilitar RLS en la tabla `signatures`

1. Ve a tu proyecto en Supabase Dashboard
2. Navega a **Table Editor** → **signatures**
3. Haz clic en la pestaña **Policies**
4. Verifica que **RLS está habilitado** (toggle en la parte superior)

### 2. Crear Política para INSERT (Crear Firmas)

1. En la sección de Policies, haz clic en **New Policy**
2. Configura así:
   - **Policy name**: `Users can insert their own signatures`
   - **Allowed operation**: `INSERT`
   - **Target roles**: `authenticated`
   - **USING expression**: `auth.uid() = user_id`
   - **WITH CHECK expression**: `auth.uid() = user_id`
3. Haz clic en **Review** y luego **Save policy**

### 3. Crear Política para SELECT (Leer Firmas)

1. **New Policy**
2. Configura:
   - **Policy name**: `Users can read their own signatures`
   - **Allowed operation**: `SELECT`
   - **Target roles**: `authenticated`
   - **USING expression**: `auth.uid() = user_id`
3. **Save policy**

### 4. Crear Política para UPDATE (Actualizar Firmas)

1. **New Policy**
2. Configura:
   - **Policy name**: `Users can update their own signatures`
   - **Allowed operation**: `UPDATE`
   - **Target roles**: `authenticated`
   - **USING expression**: `auth.uid() = user_id`
   - **WITH CHECK expression**: `auth.uid() = user_id`
3. **Save policy**

### 5. Crear Política para DELETE (Eliminar Firmas)

1. **New Policy**
2. Configura:
   - **Policy name**: `Users can delete their own signatures`
   - **Allowed operation**: `DELETE`
   - **Target roles**: `authenticated`
   - **USING expression**: `auth.uid() = user_id`
3. **Save policy**

## Verificar que el Usuario Está Autenticado

Si después de configurar las políticas sigue fallando:

1. Verifica que el usuario haya **confirmado su email** (si tienes confirmación habilitada)
2. Revisa la consola del navegador para ver los logs detallados del error
3. Verifica que el `user_id` en la base de datos coincida con `auth.uid()`

## SQL Directo (Alternativa)

Si prefieres usar SQL directamente en el SQL Editor de Supabase:

```sql
-- Habilitar RLS
ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;

-- Política para INSERT
CREATE POLICY "Users can insert their own signatures"
ON signatures FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Política para SELECT
CREATE POLICY "Users can read their own signatures"
ON signatures FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Política para UPDATE
CREATE POLICY "Users can update their own signatures"
ON signatures FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política para DELETE
CREATE POLICY "Users can delete their own signatures"
ON signatures FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

## Notas Importantes

- Las políticas RLS son **obligatorias** si RLS está habilitado
- Sin políticas, **ninguna operación** funcionará, incluso para usuarios autenticados
- `auth.uid()` devuelve el ID del usuario actualmente autenticado
- Asegúrate de que el campo `user_id` en la tabla coincida con el tipo de `auth.uid()` (UUID)

