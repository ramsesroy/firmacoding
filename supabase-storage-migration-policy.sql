-- ============================================
-- POLÍTICAS PARA MIGRACIÓN DE IMÁGENES
-- ============================================
-- Ejecuta este script en el SQL Editor de tu proyecto Supabase
-- 
-- Estas políticas permiten que usuarios autenticados puedan:
-- 1. Leer archivos de temp/ (para migrarlos)
-- 2. Subir a signatures/ (ya existe)
-- 3. Eliminar de temp/ (después de migrar)

-- Política: Usuarios autenticados pueden leer archivos en temp/ (para migración)
CREATE POLICY "Authenticated users can read temp files for migration"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'demomail' AND
        (storage.foldername(name))[1] = 'temp'
    );

-- Política: Usuarios autenticados pueden eliminar archivos en temp/ (después de migrar)
CREATE POLICY "Authenticated users can delete temp files after migration"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'demomail' AND
        (storage.foldername(name))[1] = 'temp'
    );

-- Nota: La política para subir a signatures/ ya existe en supabase-storage-setup.sql
-- No es necesario crearla de nuevo

