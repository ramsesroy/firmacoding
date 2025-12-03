# 🍋 LemonSqueezy - Guía Rápida de Configuración

## ✅ Lo que ya tienes:
- ✅ API Key: `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...`

## 📋 Lo que necesitas obtener:

### 1. Store ID
**Pasos:**
1. Ve a [LemonSqueezy Dashboard](https://app.lemonsqueezy.com/)
2. En el menú lateral: **Settings** → **Stores**
3. Haz clic en tu tienda (o crea una nueva si no tienes)
4. El **Store ID** aparece en la URL o en la configuración
   - Ejemplo de URL: `https://app.lemonsqueezy.com/settings/stores/94d59cef-dbb8-4ea5-b178-d2540fcd6919`
   - Store ID sería: `94d59cef-dbb8-4ea5-b178-d2540fcd6919`

### 2. Variant IDs (IDs de Productos)

#### Crear Producto "Premium"
1. Ve a **Products** → **Create Product**
2. Nombre: `Signature For Me Premium`
3. Descripción: `Premium plan with unlimited signatures, no watermarks, and advanced features`
4. Crea **dos variantes** (prices):
   - **Variante 1 - Mensual**: $5.00 USD, recurrente mensual
   - **Variante 2 - Anual**: $49.00 USD, recurrente anual
5. Guarda el producto

#### Obtener Variant IDs:
**Opción A - Desde la URL:**
1. Ve a **Products** → Selecciona tu producto
2. Haz clic en una variante (price)
3. En la URL verás algo como:
   ```
   https://app.lemonsqueezy.com/products/123456/variants/789012
   ```
   El Variant ID es: `789012`

**Opción B - Desde la API:**
Puedes usar esta consulta (con tu API Key):
```bash
curl -H "Authorization: Bearer TU_API_KEY" \
     -H "Accept: application/vnd.api+json" \
     "https://api.lemonsqueezy.com/v1/variants"
```

**Opción C - Script Helper:**
Ejecuta este script para obtener todos tus Variant IDs:

```bash
# Crear archivo temporal
cat > get_variants.js << 'EOF'
const fetch = require('node-fetch');

const API_KEY = 'TU_API_KEY_AQUI'; // Reemplaza con tu API key

async function getVariants() {
  try {
    const response = await fetch('https://api.lemonsqueezy.com/v1/variants', {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/vnd.api+json',
      },
    });
    
    const data = await response.json();
    
    console.log('\n=== Variant IDs encontrados ===\n');
    data.data.forEach(variant => {
      console.log(`Producto: ${variant.attributes.name}`);
      console.log(`Variant ID: ${variant.id}`);
      console.log(`Precio: $${variant.attributes.price} ${variant.attributes.currency}`);
      console.log(`Interval: ${variant.attributes.interval} (${variant.attributes.interval_count})`);
      console.log('---\n');
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

getVariants();
EOF

node get_variants.js
```

### 3. Webhook Secret

**Pasos:**
1. Ve a **Settings** → **Webhooks**
2. Haz clic en **Create Webhook**
3. Configura:
   - **Webhook URL**: 
     - Producción: `https://tu-dominio.com/api/lemonsqueezy/webhook`
     - Desarrollo: Usa [ngrok](https://ngrok.com/) para crear un túnel:
       ```bash
       ngrok http 3000
       # Copia la URL: https://xxxx.ngrok.io/api/lemonsqueezy/webhook
       ```
   
   - **Events**: Selecciona estos eventos:
     - ✅ `subscription_created`
     - ✅ `subscription_updated`
     - ✅ `subscription_cancelled`
     - ✅ `subscription_payment_success`
     - ✅ `subscription_payment_failed`
     - ✅ `subscription_expired`
     - ✅ `order_created`

4. Haz clic en **Create Webhook**
5. **IMPORTANTE**: Copia el **Webhook Secret** inmediatamente (solo se muestra una vez)
   - Se ve algo como: `whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## 🔧 Configurar Variables de Entorno

Una vez que tengas toda la información, actualiza tu `.env.local`:

```env
# LemonSqueezy Configuration
LEMONSQUEEZY_API_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...
LEMONSQUEEZY_STORE_ID=tu_store_id_aqui
LEMONSQUEEZY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Variant IDs
NEXT_PUBLIC_LEMONSQUEEZY_PREMIUM_VARIANT_ID=variante_id_mensual
NEXT_PUBLIC_LEMONSQUEEZY_PREMIUM_YEARLY_VARIANT_ID=variante_id_anual

# Application URL
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
# Desarrollo: NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📝 Checklist

- [ ] Store ID obtenido
- [ ] Producto "Premium" creado con 2 variantes (mensual y anual)
- [ ] Variant IDs copiados
- [ ] Webhook creado y configurado
- [ ] Webhook Secret copiado
- [ ] Variables de entorno actualizadas
- [ ] Servidor reiniciado (`npm run dev`)

## 🧪 Probar la Integración

1. Inicia el servidor: `npm run dev`
2. Ve a `/dashboard/subscription`
3. Haz clic en "Upgrade to Premium"
4. Debería redirigirte al checkout de LemonSqueezy

## 📚 Recursos Útiles

- [LemonSqueezy API Docs](https://docs.lemonsqueezy.com/api)
- [Webhooks Guide](https://docs.lemonsqueezy.com/help/webhooks)
- [Testing Cards](https://docs.lemonsqueezy.com/help/testing)

## ⚠️ Notas Importantes

1. **En modo de prueba**: Usa las variantes de prueba y tarjetas de prueba
2. **Webhook en desarrollo**: Usa ngrok para exponer tu localhost
3. **Variables públicas**: Solo las que empiezan con `NEXT_PUBLIC_` se exponen al cliente
4. **Seguridad**: Nunca compartas tu API Key o Webhook Secret públicamente

