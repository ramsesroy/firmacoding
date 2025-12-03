# Signature For Me - SaaS de Editor de Firmas

Proyecto SaaS para creación y gestión de firmas digitales.

## Tecnologías

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase (Base de datos y autenticación)

## Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase

# LemonSqueezy Configuration
LEMONSQUEEZY_API_KEY=tu_api_key_de_lemonsqueezy
LEMONSQUEEZY_STORE_ID=tu_store_id_de_lemonsqueezy
LEMONSQUEEZY_WEBHOOK_SECRET=tu_webhook_secret_de_lemonsqueezy

# LemonSqueezy Variant IDs (IDs de los productos/planes)
NEXT_PUBLIC_LEMONSQUEEZY_PREMIUM_VARIANT_ID=variante_id_premium
NEXT_PUBLIC_LEMONSQUEEZY_PREMIUM_YEARLY_VARIANT_ID=variante_id_premium_anual (opcional)
NEXT_PUBLIC_LEMONSQUEEZY_TEAM_VARIANT_ID=variante_id_team (opcional)
NEXT_PUBLIC_LEMONSQUEEZY_AGENCY_VARIANT_ID=variante_id_agency (opcional)

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
# En producción: NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

**Nota importante**: 
- Puedes obtener las credenciales de Supabase desde tu proyecto en [Supabase](https://supabase.com).
- Puedes obtener las credenciales de LemonSqueezy desde el panel de [LemonSqueezy](https://app.lemonsqueezy.com/).
- Ver `LEMONSQUEEZY_SETUP.md` para instrucciones detalladas de configuración.

### Base de Datos

Ejecuta el script SQL `supabase-setup.sql` en el SQL Editor de tu proyecto Supabase para crear la tabla `signatures` con las políticas de seguridad necesarias.

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

- `/src/app` - Páginas de la aplicación
- `/src/components` - Componentes reutilizables
- `/src/lib` - Utilidades y funciones helper
- `/src/types` - Definiciones de tipos TypeScript

