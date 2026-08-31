-- ============================================
-- LIMPIEZA AUTOMÁTICA DE IMÁGENES TEMPORALES
-- ============================================
-- Ejecuta este script en el SQL Editor de tu proyecto Supabase
-- 
-- Este script crea una función que elimina automáticamente archivos
-- en la carpeta 'temp/' que tengan más de 24 horas de antigüedad
-- 
-- Las imágenes de usuarios no registrados se guardan en 'temp/' y se eliminan
-- automáticamente para ahorrar espacio de almacenamiento

-- Función para eliminar archivos temporales antiguos (más de 24 horas)
CREATE OR REPLACE FUNCTION cleanup_temp_images()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER := 0;
BEGIN
  -- Eliminar archivos en la carpeta 'temp/' que tengan más de 24 horas
  -- Los nombres de archivo incluyen timestamp: {timestamp}-{random}.{ext}
  -- Extraemos el timestamp del nombre del archivo
  
  DELETE FROM storage.objects
  WHERE bucket_id = 'demomail'
    AND (storage.foldername(name))[1] = 'temp'
    AND (
      -- Extraer timestamp del nombre del archivo (primer número antes del guión)
      -- Formato: {timestamp}-{random}.{ext}
      (regexp_split_to_array(name, '-'))[1]::bigint < EXTRACT(EPOCH FROM (NOW() - INTERVAL '24 hours')) * 1000
      OR
      -- Fallback: eliminar por fecha de creación si el nombre no tiene timestamp válido
      created_at < NOW() - INTERVAL '24 hours'
    );
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Log (opcional, puedes crear una tabla de logs si quieres)
  RAISE NOTICE 'Deleted % temporary image files older than 24 hours', deleted_count;
END;
$$;

-- Crear un cron job usando pg_cron (si está habilitado en tu instancia de Supabase)
-- Nota: pg_cron puede no estar disponible en todos los planes de Supabase
-- Alternativa: Usar Supabase Edge Functions o un servicio externo (cron job)

-- Opción 1: Si tienes pg_cron habilitado, ejecuta esto:
-- SELECT cron.schedule(
--   'cleanup-temp-images',
--   '0 2 * * *', -- Ejecutar diariamente a las 2 AM
--   $$SELECT cleanup_temp_images()$$
-- );

-- Opción 2: Ejecutar manualmente cuando necesites limpiar:
-- SELECT cleanup_temp_images();

-- ============================================
-- INSTRUCCIONES PARA AUTOMATIZAR
-- ============================================
-- 
-- Opción A: Supabase Edge Function (Recomendado)
-- 1. Crea una Edge Function que llame a cleanup_temp_images()
-- 2. Configura un cron job externo (GitHub Actions, Vercel Cron, etc.) 
--    que llame a la función diariamente
--
-- Opción B: pg_cron (si está disponible)
-- 1. Ejecuta el SELECT cron.schedule() comentado arriba
-- 2. Verifica que pg_cron esté habilitado en tu proyecto
--
-- Opción C: Manual
-- 1. Ejecuta SELECT cleanup_temp_images(); periódicamente desde el SQL Editor

