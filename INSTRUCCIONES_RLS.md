# Instrucciones para Configurar RLS en Supabase

## ⚠️ IMPORTANTE: Copia el CONTENIDO del archivo, NO el nombre

## Pasos:

1. **Abre el archivo `supabase_rls_policies.sql`** en tu editor de código o aquí mismo
2. **Copia TODO el contenido** del archivo (desde `-- Script SQL...` hasta el final)
3. **Ve a Supabase Dashboard** → Tu proyecto
4. **Abre el SQL Editor** (menú lateral izquierdo)
5. **Pega el contenido** en el editor SQL
6. **Ejecuta el script** (botón "Run" o `Ctrl+Enter`)

## Contenido del Script (copia esto):

```sql
-- Script SQL para configurar Row Level Security (RLS) en Supabase
-- Ejecuta este script en el SQL Editor de Supabase Dashboard

-- 1. Habilitar RLS en la tabla signatures (si no está habilitado)
ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas existentes si las hay (opcional, solo si quieres empezar desde cero)
-- DROP POLICY IF EXISTS "Users can insert their own signatures" ON signatures;
-- DROP POLICY IF EXISTS "Users can read their own signatures" ON signatures;
-- DROP POLICY IF EXISTS "Users can update their own signatures" ON signatures;
-- DROP POLICY IF EXISTS "Users can delete their own signatures" ON signatures;

-- 3. Política para INSERT (Crear firmas)
-- Los usuarios autenticados solo pueden insertar firmas con su propio user_id
CREATE POLICY "Users can insert their own signatures"
ON signatures FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 4. Política para SELECT (Leer firmas)
-- Los usuarios autenticados solo pueden leer sus propias firmas
CREATE POLICY "Users can read their own signatures"
ON signatures FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 5. Política para UPDATE (Actualizar firmas)
-- Los usuarios autenticados solo pueden actualizar sus propias firmas
CREATE POLICY "Users can update their own signatures"
ON signatures FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 6. Política para DELETE (Eliminar firmas)
-- Los usuarios autenticados solo pueden eliminar sus propias firmas
CREATE POLICY "Users can delete their own signatures"
ON signatures FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Verificar que las políticas se crearon correctamente
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'signatures';
```

## Si las políticas ya existen:

Si ejecutas el script y te dice que las políticas ya existen, primero ejecuta esto para eliminarlas:

```sql
DROP POLICY IF EXISTS "Users can insert their own signatures" ON signatures;
DROP POLICY IF EXISTS "Users can read their own signatures" ON signatures;
DROP POLICY IF EXISTS "Users can update their own signatures" ON signatures;
DROP POLICY IF EXISTS "Users can delete their own signatures" ON signatures;
```

Y luego ejecuta el script completo de nuevo.

