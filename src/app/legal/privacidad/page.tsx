import Link from "next/link";

export const metadata = {
  title: "Política de Privacidad - Signature For Me",
  description: "Política de privacidad de Signature For Me. Conoce cómo protegemos y utilizamos tu información personal.",
};

export default function PrivacidadPage() {
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
            Política de Privacidad
          </h1>
          
          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <p className="text-sm text-gray-500">
              Última actualización: {new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
            </p>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Introducción</h2>
              <p>
                Signature For Me ("nosotros", "nuestro" o "la aplicación") se compromete a proteger tu privacidad. 
                Esta Política de Privacidad explica cómo recopilamos, utilizamos, divulgamos y protegemos tu información 
                personal cuando utilizas nuestro servicio de creación de firmas digitales profesionales.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Información que Recopilamos</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.1 Información de Cuenta</h3>
              <p>
                Cuando creas una cuenta en Signature For Me, recopilamos:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Dirección de correo electrónico</li>
                <li>Nombre (opcional)</li>
                <li>Información de autenticación (a través de Supabase)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.2 Información de Firmas</h3>
              <p>
                Cuando creas una firma digital, almacenamos:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Nombre y cargo profesional</li>
                <li>Número de teléfono (opcional)</li>
                <li>Foto de perfil (si proporcionada)</li>
                <li>Enlaces a redes sociales</li>
                <li>Plantilla y preferencias de diseño seleccionadas</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.3 Información Técnica</h3>
              <p>
                Automáticamente recopilamos:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Dirección IP</li>
                <li>Tipo de navegador y sistema operativo</li>
                <li>Páginas visitadas y tiempo de permanencia</li>
                <li>Fecha y hora de acceso</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Cómo Utilizamos tu Información</h2>
              <p>
                Utilizamos la información recopilada para:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Proporcionar, mantener y mejorar nuestros servicios</li>
                <li>Crear y almacenar tus firmas digitales</li>
                <li>Procesar tus solicitudes y gestionar tu cuenta</li>
                <li>Enviar notificaciones importantes sobre el servicio</li>
                <li>Detectar y prevenir fraudes o actividades no autorizadas</li>
                <li>Cumplir con obligaciones legales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Compartir Información</h2>
              <p>
                No vendemos, alquilamos ni compartimos tu información personal con terceros, excepto en las siguientes circunstancias:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Proveedores de Servicios:</strong> Utilizamos Supabase para el almacenamiento de datos y autenticación, 
                  que está sujeta a sus propias políticas de privacidad.
                </li>
                <li>
                  <strong>OAuth con Google:</strong> Si eliges iniciar sesión con Google, Google puede recopilar información 
                  según su política de privacidad.
                </li>
                <li>
                  <strong>Requisitos Legales:</strong> Podemos divulgar información si es requerido por ley o para proteger 
                  nuestros derechos legales.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Almacenamiento y Seguridad</h2>
              <p>
                Tus datos se almacenan de forma segura utilizando:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cifrado de datos en tránsito (HTTPS)</li>
                <li>Cifrado de datos en reposo</li>
                <li>Autenticación segura mediante Supabase</li>
                <li>Políticas de seguridad de nivel de fila (RLS) en la base de datos</li>
              </ul>
              <p className="mt-4">
                Sin embargo, ningún método de transmisión por Internet o almacenamiento electrónico es 100% seguro. 
                Aunque nos esforzamos por proteger tu información, no podemos garantizar su seguridad absoluta.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Tus Derechos</h2>
              <p>
                Tienes derecho a:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Acceder a tu información personal</li>
                <li>Corregir información incorrecta</li>
                <li>Solicitar la eliminación de tu cuenta y datos</li>
                <li>Exportar tus datos</li>
                <li>Oponerte al procesamiento de tus datos</li>
              </ul>
              <p className="mt-4">
                Para ejercer estos derechos, puedes contactarnos o eliminar tu cuenta desde la sección de Configuración.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Cookies y Tecnologías Similares</h2>
              <p>
                Utilizamos cookies y tecnologías similares para mejorar tu experiencia. Para más información, 
                consulta nuestra <Link href="/legal/cookies" className="text-blue-600 hover:underline">Política de Cookies</Link>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Menores de Edad</h2>
              <p>
                Nuestro servicio está dirigido a personas mayores de 18 años. No recopilamos intencionalmente información 
                de menores de edad. Si descubrimos que hemos recopilado información de un menor, la eliminaremos inmediatamente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Cambios a esta Política</h2>
              <p>
                Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos sobre cambios importantes 
                publicando la nueva política en esta página y actualizando la fecha de "Última actualización".
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Contacto</h2>
              <p>
                Si tienes preguntas sobre esta Política de Privacidad, puedes contactarnos a través de:
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


