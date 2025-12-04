# 🔍 Test del Webhook de n8n

## Error 404 - Webhook no encontrado

El error que estás viendo indica que el webhook de n8n está devolviendo un **404 (Not Found)**. Esto significa que la URL del webhook no existe o no está configurada correctamente.

## URL del Webhook

```
http://207.180.211.243:5678/webhook/generar-firma
```

**Nota:** Usamos IP directa en lugar del dominio para evitar bloqueos de Hostinger.

## Pasos para Verificar y Corregir

### 1. Verificar que el Workflow esté Activo

1. **Ve a tu instancia de n8n:**
   - http://207.180.211.243:5678 (IP directa para evitar bloqueos)

2. **Verifica el workflow:**
   - Asegúrate de que el workflow con el webhook esté **ACTIVO**
   - Debe tener un nodo "Webhook" configurado
   - El path debe ser: `/webhook/generar-firma`

### 2. Verificar la URL del Webhook

En n8n, verifica:
- **Método HTTP:** Debe ser `POST`
- **Path:** `/webhook/generar-firma`
- **Authentication:** Verifica si requiere autenticación
- **Response Mode:** Debe responder con JSON

### 3. Probar el Webhook Directamente

Puedes probar el webhook usando **curl** o **Postman**:

#### Opción A: Usando curl (Terminal)

```bash
curl -X POST http://207.180.211.243:5678/webhook/generar-firma \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "position": "Developer",
    "company": "Test Corp",
    "email": "test@example.com",
    "phone": "+1234567890",
    "website": "https://example.com",
    "image": "",
    "logo": ""
  }'
```

#### Opción B: Usando Postman o similar

1. **Método:** POST
2. **URL:** `http://207.180.211.243:5678/webhook/generar-firma`
3. **Headers:**
   - `Content-Type: application/json`
4. **Body (raw JSON):**
```json
{
  "fullName": "John Doe",
  "position": "Developer",
  "company": "Test Corp",
  "email": "test@example.com",
  "phone": "+1234567890",
  "website": "https://example.com",
  "image": "",
  "logo": ""
}
```

### 4. Verificar la Respuesta Esperada

El webhook debe devolver un **Array JSON** con este formato:

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

### 5. Posibles Problemas y Soluciones

#### Problema 1: Workflow Inactivo
**Solución:** Activa el workflow en n8n

#### Problema 2: Path Incorrecto
**Solución:** Verifica que el path en n8n sea exactamente `/webhook/generar-firma`

#### Problema 3: Webhook Requiere Autenticación
**Solución:** 
- Si requiere autenticación, necesitas configurarla en el nodo Webhook
- O actualizar la API route para incluir las credenciales

#### Problema 4: URL Incorrecta
**Solución:** Verifica que la URL/IP de n8n sea correcta:
- `http://207.180.211.243:5678` (IP directa para evitar bloqueos)
- No debe tener trailing slash

#### Problema 5: CORS (si pruebas desde navegador)
**Solución:** Ya está resuelto usando API route como proxy

## Verificar en n8n

1. **Abre el workflow en n8n**
2. **Verifica el nodo Webhook:**
   - Debe estar configurado para recibir POST
   - El path debe coincidir exactamente
   - El workflow debe estar guardado y activado

3. **Prueba ejecutando el workflow:**
   - Haz clic en "Execute Workflow" en n8n
   - O usa el botón de test en el nodo Webhook

## Logs del Servidor

Cuando ejecutes el test, revisa los logs en la terminal donde corre `npm run dev`. Verás:

```
AI Generate API - Sending to webhook: http://207.180.211.243:5678/webhook/generar-firma
AI Generate API - Payload: {...}
AI Generate API - Response status: 404
AI Generate API - Error response body: ...
```

Esto te ayudará a identificar exactamente qué está pasando.

## Próximos Pasos

1. **Verifica que el workflow esté activo en n8n**
2. **Prueba el webhook directamente** con curl o Postman
3. **Verifica los logs** en la terminal del servidor
4. **Comparte los resultados** para seguir depurando

Si el webhook está activo pero sigue dando 404, puede ser que:
- El path esté mal configurado
- Necesite autenticación
- La URL base de n8n haya cambiado

