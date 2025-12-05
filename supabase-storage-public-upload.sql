-- ============================================
-- PERMITIR SUBIDA DE IMÁGENES A USUARIOS NO AUTENTICADOS
-- ============================================
-- Ejecuta este script en el SQL Editor de tu proyecto Supabase
-- 
-- Esto permite que usuarios no registrados puedan subir imágenes
-- para crear sus firmas sin necesidad de autenticarse

-- Política: Usuarios NO autenticados (anónimos) pueden subir archivos en la carpeta temp/
-- Los archivos en temp/ se eliminan automáticamente después de 24 horas
CREATE POLICY "Anonymous users can upload to temp"
    ON storage.objects
    FOR INSERT
    TO anon
    WITH CHECK (
        bucket_id = 'demomail' AND
        (storage.foldername(name))[1] = 'temp'
    );

-- Política: Usuarios NO autenticados pueden leer archivos en temp/ (necesario para mostrar imágenes)
CREATE POLICY "Anonymous users can read temp files"
    ON storage.objects
    FOR SELECT
    TO anon
    USING (
        bucket_id = 'demomail' AND
        (storage.foldername(name))[1] = 'temp'
    );

-- La política de lectura pública ya existe y permite que todos lean los archivos
-- La política "Public read access to demomail" ya cubre esto

