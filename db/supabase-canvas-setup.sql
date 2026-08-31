-- ============================================
-- CANVAS EDITOR - SUPABASE SETUP
-- ============================================
-- Script SQL para crear la tabla de firmas del Canvas Editor en Supabase
-- Ejecuta este script en el SQL Editor de tu proyecto Supabase

-- Crear la tabla canvas_signatures si no existe
CREATE TABLE IF NOT EXISTS public.canvas_signatures (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    -- Almacena el estado completo del canvas (rows, columns, elements, styles)
    canvas_data JSONB NOT NULL,
    -- HTML generado de la firma (para preview rápido)
    html_preview TEXT,
    -- Metadatos adicionales
    thumbnail_url TEXT,
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Crear índice para búsquedas por usuario
CREATE INDEX IF NOT EXISTS canvas_signatures_user_id_idx ON public.canvas_signatures(user_id);

-- Crear índice para búsquedas por favoritos
CREATE INDEX IF NOT EXISTS canvas_signatures_favorite_idx ON public.canvas_signatures(user_id, is_favorite) WHERE is_favorite = true;

-- Crear índice para búsquedas por nombre (búsqueda de texto)
CREATE INDEX IF NOT EXISTS canvas_signatures_name_idx ON public.canvas_signatures(user_id, name);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.canvas_signatures ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios solo pueden ver sus propias firmas del canvas
CREATE POLICY "Users can view own canvas signatures"
    ON public.canvas_signatures
    FOR SELECT
    USING (auth.uid() = user_id);

-- Política: Los usuarios solo pueden insertar sus propias firmas del canvas
CREATE POLICY "Users can insert own canvas signatures"
    ON public.canvas_signatures
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios solo pueden actualizar sus propias firmas del canvas
CREATE POLICY "Users can update own canvas signatures"
    ON public.canvas_signatures
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios solo pueden eliminar sus propias firmas del canvas
CREATE POLICY "Users can delete own canvas signatures"
    ON public.canvas_signatures
    FOR DELETE
    USING (auth.uid() = user_id);

-- Función para actualizar updated_at automáticamente (reutiliza la función existente)
-- Si ya existe handle_updated_at(), no es necesario crearla de nuevo
-- Si no existe, se creará automáticamente

-- Crear trigger para updated_at en canvas_signatures
DROP TRIGGER IF EXISTS set_canvas_signatures_updated_at ON public.canvas_signatures;
CREATE TRIGGER set_canvas_signatures_updated_at
    BEFORE UPDATE ON public.canvas_signatures
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- NOTAS IMPORTANTES:
-- ============================================
-- 1. El campo canvas_data almacena el estado completo del canvas en formato JSONB
--    Estructura esperada:
--    {
--      "rows": [...],      // Array de SignatureRow
--      "globalStyles": {...} // GlobalStyles object
--    }
--
-- 2. El campo html_preview es opcional pero recomendado para mostrar previews
--    sin necesidad de regenerar el HTML cada vez
--
-- 3. thumbnail_url puede almacenar una URL de imagen generada del canvas
--    (opcional, para mostrar miniaturas en la lista de firmas)
--
-- 4. is_favorite permite marcar firmas favoritas para acceso rápido
--
-- 5. Todos los índices están optimizados para consultas comunes:
--    - Búsqueda por usuario
--    - Búsqueda de favoritos
--    - Búsqueda por nombre

