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
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

Puedes obtener estas credenciales desde tu proyecto en [Supabase](https://supabase.com).

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

