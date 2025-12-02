-- Script SQL para crear la tabla de firmas en Supabase
-- Ejecuta este script en el SQL Editor de tu proyecto Supabase

-- Crear la tabla signatures si no existe
CREATE TABLE IF NOT EXISTS public.signatures (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    phone TEXT,
    image_url TEXT,
    social_links JSONB,
    template_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Crear índice para búsquedas por usuario
CREATE INDEX IF NOT EXISTS signatures_user_id_idx ON public.signatures(user_id);

-- Crear índice para búsquedas por template
CREATE INDEX IF NOT EXISTS signatures_template_id_idx ON public.signatures(template_id);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.signatures ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios solo pueden ver sus propias firmas
CREATE POLICY "Users can view own signatures"
    ON public.signatures
    FOR SELECT
    USING (auth.uid() = user_id);

-- Política: Los usuarios solo pueden insertar sus propias firmas
CREATE POLICY "Users can insert own signatures"
    ON public.signatures
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios solo pueden actualizar sus propias firmas
CREATE POLICY "Users can update own signatures"
    ON public.signatures
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios solo pueden eliminar sus propias firmas
CREATE POLICY "Users can delete own signatures"
    ON public.signatures
    FOR DELETE
    USING (auth.uid() = user_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.signatures;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.signatures
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- CONFIGURACIÓN DE STORAGE (BUCKET: demomail)
-- ============================================
-- Nota: Debes crear el bucket 'demomail' en el Storage de Supabase antes de ejecutar estas políticas

-- Habilitar RLS en el bucket (esto se hace automáticamente al crear el bucket con RLS habilitado)
-- Si el bucket ya existe, verifica que RLS esté habilitado en la configuración del Storage

-- Política: Usuarios autenticados pueden subir archivos en su propia carpeta
CREATE POLICY "Authenticated users can upload own files"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'demomail' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Política: Usuarios autenticados pueden leer sus propios archivos
CREATE POLICY "Authenticated users can read own files"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'demomail' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Política: Usuarios autenticados pueden actualizar sus propios archivos
CREATE POLICY "Authenticated users can update own files"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'demomail' AND
        (storage.foldername(name))[1] = auth.uid()::text
    )
    WITH CHECK (
        bucket_id = 'demomail' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Política: Usuarios autenticados pueden eliminar sus propios archivos
CREATE POLICY "Authenticated users can delete own files"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'demomail' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Política: Los archivos son públicos para lectura (para que las URLs públicas funcionen)
CREATE POLICY "Public read access"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'demomail');
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.signatures
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();





