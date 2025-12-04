# 🤖 AI Enhancer - Generador de Firmas con IA

## Descripción

La funcionalidad **AI Enhancer** permite a los usuarios generar firmas de correo profesional utilizando inteligencia artificial. Simplemente completan un formulario y la IA genera múltiples diseños únicos de firmas.

## Configuración

### 1. Variable de Entorno

Agrega la siguiente variable a tu archivo `.env.local`:

```env
NEXT_PUBLIC_AI_WEBHOOK_URL=https://tu-webhook-url-de-n8n.com/webhook/ai-signature
```

**Nota:** Reemplaza la URL con la URL real de tu webhook de n8n.

### 2. Estructura del Webhook

El webhook debe aceptar un POST request con el siguiente formato JSON:

```json
{
  "fullName": "John Doe",
  "position": "Senior Developer",
  "company": "Tech Corp",
  "email": "john@example.com",
  "phone": "+1 (555) 123-4567",
  "website": "https://linkedin.com/in/johndoe",
  "image": "https://example.com/image.jpg",
  "logo": "https://example.com/logo.png"
}
```

**Campos:**
- `fullName` (requerido): Nombre completo
- `position` (opcional): Cargo o puesto
- `company` (opcional): Empresa
- `email` (requerido): Email
- `phone` (opcional): Teléfono
- `website` (opcional): Sitio web o LinkedIn
- `image` (opcional): URL de imagen de perfil
- `logo` (opcional): URL del logo de la empresa

### 3. Respuesta Esperada

El webhook debe devolver un Array JSON con el siguiente formato:

```json
[
  {
    "name": "Minimal",
    "html": "<table>...</table>"
  },
  {
    "name": "Bold",
    "html": "<table>...</table>"
  },
  {
    "name": "Corporate",
    "html": "<table>...</table>"
  }
]
```

**Estructura de respuesta:**
- `name`: Nombre del diseño (ej: "Minimal", "Bold", "Corporate")
- `html`: HTML completo de la firma (debe ser HTML válido para email)

## Características

### ✨ Funcionalidades

1. **Formulario Intuitivo**
   - Campos claros y organizados
   - Validación de campos requeridos
   - Subida de imágenes para foto de perfil y logo

2. **Preview en Tiempo Real**
   - Vista previa de las firmas generadas
   - Múltiples diseños simultáneos
   - Renderizado seguro con DOMPurify

3. **Acciones Disponibles**
   - **Copiar HTML**: Copia el código HTML al portapapeles
   - **Guardar Firma**: Guarda la firma en la cuenta del usuario

4. **Estados de UI**
   - **Estado Inicial**: Mensaje de bienvenida
   - **Estado Loading**: Spinner animado con frases inspiradoras
   - **Estado Success**: Muestra las firmas generadas

### 🎨 Diseño

- **Diseño Split View**: Formulario a la izquierda, preview a la derecha
- **Responsive**: Se adapta perfectamente a móviles y tablets
- **Animaciones**: Transiciones suaves y efectos modernos
- **Gradientes**: Colores vibrantes (violeta, púrpura, fucsia)

## Uso

### Para Usuarios

1. Navega al Dashboard
2. Haz clic en el botón "Create with AI"
3. Completa el formulario (nombre y email son requeridos)
4. Haz clic en "Generate with AI"
5. Espera a que la IA genere tus firmas
6. Revisa los resultados y elige tu favorita
7. Copia el HTML o guarda la firma directamente

### Para Desarrolladores

La página está ubicada en:
```
src/app/dashboard/ai-generator/page.tsx
```

**Componentes clave:**
- Formulario con validación
- Manejo de estado para loading/error/success
- Integración con Supabase para guardar firmas
- Analytics tracking para métricas

## Seguridad

- **Sanitización HTML**: Usa DOMPurify para prevenir XSS
- **Validación de datos**: Campos requeridos y tipos correctos
- **Autenticación**: Guardar firmas requiere login
- **Límites de guardado**: Respeta los límites de suscripción del usuario

## Analytics

Los siguientes eventos se registran automáticamente:

- `ai_signature_generated`: Cuando se generan firmas exitosamente
- `ai_signature_error`: Cuando hay un error en la generación
- `copy_signature`: Cuando se copia el HTML
- `create_signature`: Cuando se guarda una firma

## Solución de Problemas

### Error: "AI Generator is not configured"
- Verifica que `NEXT_PUBLIC_AI_WEBHOOK_URL` esté definida en `.env.local`
- Reinicia el servidor de desarrollo después de agregar la variable

### Error: "Invalid response from AI generator"
- Verifica que el webhook devuelva un array JSON válido
- Cada objeto debe tener `name` y `html`

### Las firmas no se muestran correctamente
- Verifica que el HTML generado sea válido
- Asegúrate de que las imágenes/URLs sean accesibles
- Revisa la consola del navegador para errores

## Próximas Mejoras

- [ ] Edición de firmas generadas
- [ ] Más opciones de personalización
- [ ] Historial de generaciones
- [ ] Favoritos
- [ ] Compartir firmas

## Soporte

Si tienes problemas con la configuración o el uso del AI Generator, contacta al equipo de desarrollo.

