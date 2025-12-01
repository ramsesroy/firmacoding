# Guía: Configurar Google OAuth con Supabase

Esta guía te ayudará a configurar el inicio de sesión con Google en tu aplicación Signature For Me.

## Paso 1: Crear proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Crea un nuevo proyecto:
   - Haz clic en el selector de proyectos (parte superior)
   - Selecciona "Nuevo proyecto"
   - Asigna un nombre (ej: "Signature For Me")
   - Haz clic en "Crear"

## Paso 2: Configurar la Pantalla de Consentimiento OAuth

1. En el menú lateral, ve a **APIs y servicios** > **Pantalla de consentimiento OAuth**
2. Selecciona **Externo** (si es para uso público) y haz clic en **Crear**
3. Completa la información:
   - **Nombre de la aplicación**: Signature For Me
   - **Correo electrónico de soporte**: Tu email
   - **Dominios autorizados**: (opcional, puedes dejarlo vacío para desarrollo)
4. En **Ámbitos**, agrega:
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
5. Haz clic en **Guardar y continuar** hasta completar todos los pasos

## Paso 3: Crear credenciales OAuth 2.0

1. Ve a **APIs y servicios** > **Credenciales**
2. Haz clic en **+ Crear credenciales** > **ID de cliente de OAuth**
3. Selecciona **Aplicación web** como tipo
4. Configura los siguientes campos:

### Orígenes de JavaScript autorizados:
```
http://localhost:3000
https://tu-dominio.com
```

### URI de redireccionamiento autorizados:
**IMPORTANTE**: Debes usar la URL de tu proyecto Supabase, no la de tu aplicación.

```
https://[TU-PROYECTO-SUPABASE].supabase.co/auth/v1/callback
```

**Ejemplo**: Si tu URL de Supabase es `https://abcdefghijklmnop.supabase.co`, entonces:
```
https://abcdefghijklmnop.supabase.co/auth/v1/callback
```

5. Haz clic en **Crear**
6. **Copia y guarda**:
   - **ID de cliente** (Client ID)
   - **Secreto de cliente** (Client Secret)

## Paso 4: Configurar en Supabase

1. Ve a tu [Dashboard de Supabase](https://app.supabase.com/)
2. Selecciona tu proyecto
3. Ve a **Authentication** > **Providers**
4. Busca **Google** y haz clic para habilitarlo
5. Ingresa las credenciales:
   - **Client ID (for OAuth)**: Pega el Client ID que copiaste
   - **Client Secret (for OAuth)**: Pega el Client Secret que copiaste
6. Haz clic en **Save**

## Paso 5: Verificar URLs de redirección en Supabase

1. En Supabase, ve a **Authentication** > **URL Configuration**
2. Verifica que estén configuradas las siguientes URLs:

### Site URL:
```
http://localhost:3000
```
(o tu dominio de producción)

### Redirect URLs:
```
http://localhost:3000/**
https://tu-dominio.com/**
```

## Paso 6: Probar el login

1. Inicia tu servidor de desarrollo: `npm run dev`
2. Ve a `http://localhost:3000/login`
3. Haz clic en "Continuar con Google"
4. Deberías ser redirigido a Google para autenticarte
5. Después de autenticarte, serás redirigido de vuelta a tu aplicación

## Solución de problemas

### Error: "redirect_uri_mismatch"
- Verifica que el URI de redirección en Google Cloud Console sea exactamente:
  `https://[TU-PROYECTO-SUPABASE].supabase.co/auth/v1/callback`
- Asegúrate de que no haya espacios o caracteres extra

### Error: "access_denied"
- Verifica que la Pantalla de Consentimiento OAuth esté configurada correctamente
- Asegúrate de que los ámbitos estén agregados

### No se redirige después del login
- Verifica que las Redirect URLs en Supabase incluyan tu dominio
- Asegúrate de que `/auth/callback` esté configurado correctamente

## Notas importantes

- **Nunca compartas** tu Client Secret públicamente
- Para producción, asegúrate de agregar tu dominio real en Google Cloud Console
- El Client Secret solo se usa en Supabase, nunca en el código del frontend


