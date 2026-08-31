# Instrucciones para Configurar Storage en Supabase

## Problema
Error al subir imágenes: "new row violates row-level security policy"

## Solución

### Paso 1: Crear el Bucket (si no existe)

1. Ve a tu proyecto en Supabase: https://supabase.com
2. En el menú lateral, haz clic en **"Storage"**
3. Haz clic en **"Buckets"**
4. Si no existe un bucket llamado `demomail`:
   - Haz clic en **"New bucket"**
   - Nombre: `demomail`
   - Marca como **"Public bucket"** (ON)
   - Haz clic en **"Create bucket"**

### Paso 2: Ejecutar las Políticas SQL

1. En el menú lateral de Supabase, haz clic en **"SQL Editor"**
2. Haz clic en **"New query"** (si es necesario)
3. Copia y pega el siguiente código:

```sql
-- Política: Usuarios autenticados pueden subir archivos en la carpeta signatures/
CREATE POLICY "Authenticated users can upload to signatures"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'demomail' AND
        (storage.foldername(name))[1] = 'signatures'
    );

-- Política: Usuarios autenticados pueden leer todos los archivos
CREATE POLICY "Authenticated users can read all files"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (bucket_id = 'demomail');

-- Política: Usuarios autenticados pueden actualizar archivos en signatures/
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

-- Política: Usuarios autenticados pueden eliminar archivos en signatures/
CREATE POLICY "Authenticated users can delete own files in signatures"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'demomail' AND
        (storage.foldername(name))[1] = 'signatures'
    );

-- Política: Acceso público de lectura
CREATE POLICY "Public read access to demomail"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'demomail');
```

4. Haz clic en **"RUN"** o presiona `Ctrl + Enter` (o `Cmd + Enter` en Mac)
5. Deberías ver un mensaje de éxito

### Paso 3: Verificar

1. Intenta subir una imagen de perfil en tu aplicación
2. El error debería desaparecer

## Si hay algún error al ejecutar el SQL

Si ves un error como "policy already exists", ejecuta primero este código para eliminar las políticas existentes:

```sql
DROP POLICY IF EXISTS "Authenticated users can upload to signatures" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can read all files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update own files in signatures" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete own files in signatures" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to demomail" ON storage.objects;
```

Y luego ejecuta el código de las políticas nuevamente.


