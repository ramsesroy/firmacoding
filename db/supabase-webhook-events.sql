-- Script SQL para agregar tabla de eventos de webhook (idempotencia)
-- Ejecuta este script en el SQL Editor de tu proyecto Supabase

-- ============================================
-- TABLA DE EVENTOS DE WEBHOOK (IDEMPOTENCIA)
-- ============================================
CREATE TABLE IF NOT EXISTS public.webhook_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    event_data JSONB,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Índices para webhook_events
CREATE INDEX IF NOT EXISTS webhook_events_event_id_idx ON public.webhook_events(event_id);
CREATE INDEX IF NOT EXISTS webhook_events_event_type_idx ON public.webhook_events(event_type);
CREATE INDEX IF NOT EXISTS webhook_events_processed_at_idx ON public.webhook_events(processed_at);

-- Comentario de la tabla
COMMENT ON TABLE public.webhook_events IS 'Almacena eventos de webhook procesados para prevenir procesamiento duplicado (idempotencia)';

-- ============================================
-- POLÍTICA DE LIMPIEZA AUTOMÁTICA
-- ============================================
-- Función para limpiar eventos antiguos (más de 30 días)
CREATE OR REPLACE FUNCTION cleanup_old_webhook_events()
RETURNS void AS $$
BEGIN
  DELETE FROM public.webhook_events
  WHERE processed_at < TIMEZONE('utc', NOW() - INTERVAL '30 days');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentario: Ejecutar periódicamente con pg_cron o manualmente
COMMENT ON FUNCTION cleanup_old_webhook_events IS 'Limpia eventos de webhook procesados hace más de 30 días. Ejecutar periódicamente.';
