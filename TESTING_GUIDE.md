# 🧪 Guía de Testing - Signature For Me

## Crear Usuario de Prueba

### Opción 1: Registro desde la Aplicación (Recomendado)

1. **Navega a la página de Login:**
   ```
   http://localhost:3000/login
   ```

2. **Activa el modo "Sign Up":**
   - Haz clic en el toggle o botón que dice "Sign Up" o "Create Account"

3. **Completa el formulario:**
   - **Email:** `test@example.com` (o cualquier email válido)
   - **Password:** Mínimo 6 caracteres (ej: `test123`)

4. **Haz clic en "Sign Up"**

5. **Verificación de Email:**
   - Si tienes verificación de email habilitada, recibirás un correo
   - Haz clic en el enlace de verificación
   - O deshabilita la verificación en Supabase (ver Opción 2)

### Opción 2: Deshabilitar Verificación de Email (Desarrollo)

Para desarrollo local, puedes deshabilitar la verificación de email:

1. **Ve a Supabase Dashboard:**
   - https://supabase.com/dashboard
   - Selecciona tu proyecto

2. **Navega a Authentication:**
   - Menú lateral → Authentication → Settings

3. **Deshabilita Email Confirmations:**
   - Busca "Enable email confirmations"
   - Desactívalo
   - Guarda los cambios

4. **Ahora puedes:**
   - Registrarte y hacer login inmediatamente
   - Sin necesidad de verificar el email

### Opción 3: Login con Google OAuth

1. **Configura Google OAuth en Supabase:**
   - Ve a Authentication → Providers
   - Habilita "Google"
   - Agrega tus credenciales de Google OAuth
   - Guarda

2. **En la aplicación:**
   - Ve a `/login`
   - Haz clic en "Sign in with Google"
   - Selecciona tu cuenta de Google
   - ¡Listo! No requiere verificación

### Opción 4: Crear Usuario Directamente en Supabase

1. **Ve a Supabase Dashboard:**
   - Authentication → Users

2. **Crea un nuevo usuario:**
   - Haz clic en "Add user" → "Create new user"
   - Email: `test@example.com`
   - Password: `test123456`
   - **IMPORTANTE:** Marca "Auto Confirm User"
   - Haz clic en "Create user"

3. **Ahora puedes hacer login:**
   - Ve a `/login`
   - Usa el email y password que creaste
   - ¡Inicia sesión inmediatamente!

## Funcionalidades para Probar

### ✅ Funcionalidades Básicas (Sin Login)

- [x] Ver templates disponibles (primeros 6)
- [x] Crear firma en el editor
- [x] Copiar HTML al portapapeles
- [x] Exportar como HTML

### 🔒 Funcionalidades que Requieren Login

- [ ] **Guardar firmas:**
  - Crea una firma en el editor
  - Haz clic en "Save Signature"
  - Verifica que se guarde correctamente

- [ ] **Ver firmas guardadas:**
  - Ve a `/dashboard/signatures`
  - Deberías ver tus firmas guardadas

- [ ] **Editar firma:**
  - En `/dashboard/signatures`
  - Haz clic en "Edit" en una firma
  - Modifica y guarda

- [ ] **Eliminar firma:**
  - En `/dashboard/signatures`
  - Haz clic en "Delete"
  - Confirma la eliminación

- [ ] **Exportar firmas:**
  - PNG (requiere login)
  - PDF (requiere login)
  - Verifica que se descarguen correctamente

- [ ] **Límites de guardado:**
  - Usuarios Free: máximo 3 firmas
  - Intenta guardar una 4ta firma
  - Debería mostrar mensaje de límite alcanzado

### 🤖 Funcionalidades Premium

- [ ] **Templates Premium:**
  - Ve a `/dashboard`
  - Verifica que puedas acceder a todos los templates premium
  - Crea una firma con un template premium
  - Verifica que no aparezca watermark en exports

**Nota:** Requiere `NEXT_PUBLIC_AI_WEBHOOK_URL` configurada

### 💳 Funcionalidades de Suscripción

- [ ] **Ver planes:**
  - Ve a `/pricing` o `/dashboard/subscription`
  - Revisa los planes disponibles

- [ ] **Upgrade a Premium:**
  - Haz clic en "Upgrade" en cualquier plan
  - Debería redirigir a checkout (si LemonSqueezy está configurado)

## Usuarios de Prueba Sugeridos

### Usuario Free (Límite: 3 firmas)
```
Email: test@example.com
Password: test123456
```

### Usuario Premium (Para probar funcionalidades premium)
```
Email: premium@example.com
Password: premium123
```
**Nota:** Necesitas actualizar manualmente la suscripción en Supabase o completar un checkout real.

## Verificar Estado de Usuario

### En Supabase Dashboard:

1. **Authentication → Users:**
   - Ver lista de usuarios
   - Ver estado de verificación
   - Ver última actividad

2. **Database → Table Editor → subscriptions:**
   - Ver suscripciones activas
   - Verificar plan del usuario

3. **Database → Table Editor → user_limits:**
   - Ver límites de guardado
   - Verificar contador de firmas guardadas

## Solución de Problemas

### "Email not confirmed"
- **Solución:** Deshabilita verificación de email en Supabase (Opción 2)
- O verifica el email desde el correo recibido

### "Invalid login credentials"
- Verifica que el email y password sean correctos
- Verifica que el usuario exista en Supabase

### "Permission denied" al guardar
- Verifica que las políticas RLS estén configuradas
- Ejecuta `supabase-setup.sql` y `supabase-subscriptions.sql`

### No puedo ver mis firmas guardadas
- Verifica que estés logueado
- Verifica que las firmas existan en la tabla `signatures`
- Revisa la consola del navegador para errores

## Checklist de Testing Completo

### Autenticación
- [ ] Registro con email/password
- [ ] Login con email/password
- [ ] Login con Google OAuth
- [ ] Recuperación de contraseña
- [ ] Cerrar sesión

### Editor de Firmas
- [ ] Seleccionar templates
- [ ] Completar formulario
- [ ] Subir foto de perfil
- [ ] Subir logo de empresa
- [ ] Agregar redes sociales
- [ ] Preview en tiempo real
- [ ] Copiar HTML

### Gestión de Firmas
- [ ] Guardar firma
- [ ] Ver lista de firmas
- [ ] Editar firma
- [ ] Eliminar firma
- [ ] Exportar PNG
- [ ] Exportar PDF

### Templates Premium
- [ ] Verificar acceso a templates premium
- [ ] Crear firma con template premium
- [ ] Verificar que no aparezca watermark
- [ ] Guardar firma generada

### Suscripciones
- [ ] Ver página de precios
- [ ] Ver página de suscripción
- [ ] Verificar límites Free
- [ ] Intentar upgrade

## Notas Importantes

1. **Desarrollo Local:**
   - Deshabilita verificación de email para facilitar testing
   - Usa emails de prueba (no reales)

2. **Producción:**
   - Mantén verificación de email habilitada
   - Configura correctamente Google OAuth
   - Verifica todas las políticas RLS

3. **Límites:**
   - Usuarios Free: 3 firmas guardadas
   - Usuarios Premium: Ilimitado
   - Los límites se verifican automáticamente

4. **Base de Datos:**
   - Asegúrate de ejecutar todos los scripts SQL
   - Verifica que las tablas existan
   - Revisa las políticas RLS

