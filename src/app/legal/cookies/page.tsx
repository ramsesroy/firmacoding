import Link from "next/link";

export const metadata = {
  title: "Política de Cookies - Signature For Me",
  description: "Política de cookies de Signature For Me. Conoce cómo utilizamos las cookies y tecnologías similares en nuestro sitio.",
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Signature<span className="text-blue-600">For Me</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
            Política de Cookies
          </h1>
          
          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <p className="text-sm text-gray-500">
              Última actualización: {new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
            </p>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. ¿Qué son las Cookies?</h2>
              <p>
                Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. 
                Estas cookies permiten que el sitio web recuerde tus acciones y preferencias durante un período de tiempo, 
                por lo que no tienes que volver a configurarlas cada vez que regresas al sitio o navegas de una página a otra.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Cómo Utilizamos las Cookies</h2>
              <p>
                Signature For Me utiliza cookies y tecnologías similares para:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Autenticación:</strong> Mantener tu sesión activa mientras utilizas el servicio
                </li>
                <li>
                  <strong>Preferencias:</strong> Recordar tus preferencias y configuraciones
                </li>
                <li>
                  <strong>Seguridad:</strong> Detectar y prevenir actividades fraudulentas o no autorizadas
                </li>
                <li>
                  <strong>Análisis:</strong> Entender cómo utilizas nuestro servicio para mejorarlo
                </li>
                <li>
                  <strong>Funcionalidad:</strong> Permitir que ciertas funciones del sitio operen correctamente
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Tipos de Cookies que Utilizamos</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.1 Cookies Esenciales</h3>
              <p>
                Estas cookies son necesarias para que el sitio web funcione correctamente. Incluyen cookies de autenticación 
                que mantienen tu sesión activa y cookies de seguridad. No puedes desactivar estas cookies sin afectar 
                la funcionalidad del sitio.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.2 Cookies de Funcionalidad</h3>
              <p>
                Estas cookies permiten que el sitio web recuerde las elecciones que haces (como tu idioma preferido 
                o la región en la que te encuentras) y proporcionan características mejoradas y personalizadas.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.3 Cookies de Análisis</h3>
              <p>
                Estas cookies nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web, 
                proporcionando información sobre las áreas visitadas, el tiempo de permanencia y cualquier problema 
                encontrado, como mensajes de error.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Cookies de Terceros</h2>
              <p>
                Utilizamos servicios de terceros que pueden establecer cookies en tu dispositivo:
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.1 Supabase</h3>
              <p>
                Utilizamos Supabase para autenticación y almacenamiento de datos. Supabase puede utilizar cookies 
                para gestionar sesiones y proporcionar sus servicios. Para más información, consulta la 
                <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline"> política de privacidad de Supabase</a>.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.2 Google OAuth</h3>
              <p>
                Si eliges iniciar sesión con Google, Google puede establecer cookies según su política de privacidad. 
                Para más información, consulta la 
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline"> política de privacidad de Google</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Gestión de Cookies</h2>
              <p>
                Puedes controlar y/o eliminar las cookies como desees. Puedes eliminar todas las cookies que ya están 
                en tu dispositivo y puedes configurar la mayoría de los navegadores para evitar que se coloquen. 
                Sin embargo, si haces esto, es posible que tengas que ajustar manualmente algunas preferencias cada vez 
                que visites un sitio y algunos servicios y funcionalidades pueden no funcionar.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.1 Cómo Eliminar o Bloquear Cookies</h3>
              <p>
                Puedes gestionar las cookies a través de la configuración de tu navegador. Aquí tienes enlaces 
                a las instrucciones para los navegadores más populares:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Safari
                  </a>
                </li>
                <li>
                  <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Microsoft Edge
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Cookies que Utilizamos Específicamente</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Propósito
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duración
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        sb-access-token
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        Mantener la sesión de autenticación
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        Sesión
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        sb-refresh-token
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        Renovar la sesión de autenticación
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        30 días
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Cambios a esta Política</h2>
              <p>
                Podemos actualizar esta Política de Cookies ocasionalmente. Te notificaremos sobre cambios importantes 
                publicando la nueva política en esta página y actualizando la fecha de "Última actualización".
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Más Información</h2>
              <p>
                Para más información sobre cómo protegemos tu privacidad, consulta nuestra 
                <Link href="/legal/privacidad" className="text-blue-600 hover:underline"> Política de Privacidad</Link>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Contacto</h2>
              <p>
                Si tienes preguntas sobre nuestra Política de Cookies, puedes contactarnos a través de:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email: contacto@signaturefor.me</li>
                <li>Sitio web: <Link href="/" className="text-blue-600 hover:underline">http://signaturefor.me</Link></li>
              </ul>
            </section>
          </div>

          {/* Back to Home */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}


