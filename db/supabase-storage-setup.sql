-- ============================================
-- CONFIGURACIÓN DE STORAGE PARA SUBIDA DE IMÁGENES
-- ============================================
-- Ejecuta este script en el SQL Editor de tu proyecto Supabase
-- 
-- IMPORTANTE: 
-- 1. Primero crea el bucket 'demomail' en Storage > Buckets
-- 2. Marca el bucket como Público si quieres URLs públicas
-- 3. Luego ejecuta estas políticas

-- Eliminar políticas existentes si las hay (opcional, ejecuta solo si necesitas reemplazarlas)
-- DROP POLICY IF EXISTS "Authenticated users can upload own files" ON storage.objects;
-- DROP POLICY IF EXISTS "Authenticated users can read own files" ON storage.objects;
-- DROP POLICY IF EXISTS "Authenticated users can update own files" ON storage.objects;
-- DROP POLICY IF EXISTS "Authenticated users can delete own files" ON storage.objects;
-- DROP POLICY IF EXISTS "Public read access" ON storage.objects;

-- Política: Usuarios autenticados pueden subir archivos en la carpeta signatures/
CREATE POLICY "Authenticated users can upload to signatures"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'demomail' AND
        (storage.foldername(name))[1] = 'signatures'
    );

-- Política: Usuarios autenticados pueden leer todos los archivos (incluidos los propios y de otros)
CREATE POLICY "Authenticated users can read all files"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (bucket_id = 'demomail');

-- Política: Usuarios autenticados pueden actualizar archivos en su propia carpeta
CREATE POLICY "Authenticated users can update own files in signatures"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'demomail' AND
        (storage.foldername(name))[1] = 'signatures'
    )
    WITH CHECK (
        bucket_id = 'demomail' AND
        (storage.foldername(name))[1] = 'signatures'
    );

-- Política: Usuarios autenticados pueden eliminar archivos en su propia carpeta
CREATE POLICY "Authenticated users can delete own files in signatures"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'demomail' AND
        (storage.foldername(name))[1] = 'signatures'
    );

-- Política: Acceso público de lectura (necesario para que las URLs públicas funcionen)
CREATE POLICY "Public read access to demomail"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'demomail');


