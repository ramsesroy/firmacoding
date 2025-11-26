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

