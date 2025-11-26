# Campos que se guardan en Supabase - Tabla `signatures`

## ✅ Campos que SÍ se están guardando actualmente:

### Campos básicos:
- `user_id` - UUID del usuario (requerido)
- `name` - Nombre de la persona
- `role` - Cargo/posición
- `phone` - Teléfono principal
- `image_url` - URL de la foto de perfil
- `social_links` - Array JSON con redes sociales
- `template_id` - ID del template seleccionado
- `created_at` - Fecha de creación (automático)

### Campos adicionales que SÍ se guardan:
- ✅ `logo_empresa` - URL del logo de la empresa
- ✅ `logo_posicion` - Posición del logo ("top", "center", "bottom")
- ✅ `telefono_movil` - Teléfono móvil adicional
- ✅ `direccion` - Dirección física
- ✅ `horario` - Horario de atención
- ✅ `texto_adicional` - Texto adicional para templates específicos
- ✅ `color_personalizado` - Color personalizado elegido por el usuario
- ✅ `qr_link` - URL del código QR
- ✅ `cta_texto` - Texto del botón CTA
- ✅ `icono_telefono` - Icono personalizado para teléfono
- ✅ `icono_telefono_movil` - Icono personalizado para teléfono móvil
- ✅ `icono_direccion` - Icono personalizado para dirección

## 📋 Estructura de la tabla en Supabase

Asegúrate de que tu tabla `signatures` tenga todas estas columnas:

```sql
-- Columnas básicas (ya deberías tenerlas)
user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
name TEXT NOT NULL
role TEXT NOT NULL
phone TEXT
image_url TEXT
social_links JSONB
template_id TEXT NOT NULL
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

-- Columnas adicionales (verifica que las tengas)
logo_empresa TEXT
logo_posicion TEXT  -- 'top', 'center', 'bottom'
telefono_movil TEXT
direccion TEXT
horario TEXT
texto_adicional TEXT
color_personalizado TEXT  -- Color en formato hex (#RRGGBB)
qr_link TEXT
cta_texto TEXT
icono_telefono TEXT
icono_telefono_movil TEXT
icono_direccion TEXT
```

## 🔍 Cómo verificar

1. Ve a Supabase Dashboard → Table Editor → `signatures`
2. Verifica que todas las columnas listadas arriba existan
3. Si falta alguna, créala con el tipo de dato correcto

## ✅ Confirmación

El código en `src/app/dashboard/page.tsx` (líneas 231-251) SÍ está guardando todos estos campos cuando el usuario hace clic en "Guardar Firma".

