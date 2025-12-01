import Link from "next/link";

export const metadata = {
  title: "Términos de Servicio - Signature For Me",
  description: "Términos y condiciones de uso de Signature For Me. Lee nuestros términos de servicio antes de usar la plataforma.",
};

export default function TerminosPage() {
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
            Términos de Servicio
          </h1>
          
          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <p className="text-sm text-gray-500">
              Última actualización: {new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
            </p>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Aceptación de los Términos</h2>
              <p>
                Al acceder y utilizar Signature For Me (el "Servicio"), aceptas estar sujeto a estos Términos de Servicio 
                y a todas las leyes y regulaciones aplicables. Si no estás de acuerdo con alguno de estos términos, 
                no debes usar nuestro servicio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Descripción del Servicio</h2>
              <p>
                Signature For Me es una plataforma SaaS que permite a los usuarios crear, personalizar y gestionar 
                firmas digitales profesionales. El servicio incluye:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Editor de firmas con múltiples plantillas</li>
                <li>Almacenamiento de firmas personalizadas</li>
                <li>Exportación en formato HTML</li>
                <li>Gestión de cuentas de usuario</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Registro y Cuenta de Usuario</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.1 Creación de Cuenta</h3>
              <p>
                Para utilizar nuestro servicio, debes crear una cuenta proporcionando información precisa y completa. 
                Eres responsable de mantener la confidencialidad de tus credenciales de acceso.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.2 Responsabilidad</h3>
              <p>
                Eres responsable de todas las actividades que ocurran bajo tu cuenta. Debes notificarnos inmediatamente 
                de cualquier uso no autorizado de tu cuenta.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.3 Elegibilidad</h3>
              <p>
                Debes ser mayor de 18 años para utilizar este servicio. Al registrarte, confirmas que cumples con 
                este requisito de edad.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Uso Aceptable</h2>
              <p>
                Te comprometes a utilizar el servicio únicamente para fines legales y de acuerdo con estos términos. 
                No debes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Usar el servicio para actividades ilegales o no autorizadas</li>
                <li>Intentar acceder a áreas no autorizadas del servicio</li>
                <li>Interferir con el funcionamiento del servicio</li>
                <li>Crear firmas que contengan contenido ofensivo, difamatorio o ilegal</li>
                <li>Usar el servicio para enviar spam o comunicaciones no solicitadas</li>
                <li>Suplantar la identidad de otra persona o entidad</li>
                <li>Violar los derechos de propiedad intelectual de terceros</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Propiedad Intelectual</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.1 Contenido del Usuario</h3>
              <p>
                Mantienes todos los derechos sobre las firmas que crees utilizando nuestro servicio. Sin embargo, 
                al utilizar el servicio, nos otorgas una licencia para almacenar y procesar tus firmas para 
                proporcionar el servicio.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.2 Propiedad de Signature For Me</h3>
              <p>
                El servicio, incluyendo todas las plantillas, diseño, código y funcionalidades, es propiedad de 
                Signature For Me y está protegido por leyes de propiedad intelectual. No puedes copiar, modificar 
                o distribuir nuestro contenido sin autorización.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Disponibilidad del Servicio</h2>
              <p>
                Nos esforzamos por mantener el servicio disponible las 24 horas del día, pero no garantizamos 
                disponibilidad ininterrumpida. El servicio puede estar sujeto a mantenimiento programado, 
                actualizaciones o interrupciones por causas fuera de nuestro control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Limitación de Responsabilidad</h2>
              <p>
                Signature For Me se proporciona "tal cual" sin garantías de ningún tipo. En la medida máxima 
                permitida por la ley, no seremos responsables de:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Daños indirectos, incidentales o consecuentes</li>
                <li>Pérdida de datos o información</li>
                <li>Interrupciones del servicio</li>
                <li>Errores o imprecisiones en el contenido</li>
                <li>Decisiones tomadas basándose en el uso del servicio</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Modificaciones del Servicio</h2>
              <p>
                Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto del servicio 
                en cualquier momento, con o sin previo aviso. No seremos responsables ante ti ni ante ningún 
                tercero por cualquier modificación, suspensión o discontinuación del servicio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Terminación</h2>
              <p>
                Podemos terminar o suspender tu acceso al servicio inmediatamente, sin previo aviso, si violas 
                estos Términos de Servicio. También puedes eliminar tu cuenta en cualquier momento desde la 
                sección de Configuración. Al eliminar tu cuenta, se eliminarán permanentemente tus datos y firmas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Privacidad</h2>
              <p>
                Tu uso del servicio también está sujeto a nuestra 
                <Link href="/legal/privacidad" className="text-blue-600 hover:underline"> Política de Privacidad</Link>, 
                que describe cómo recopilamos, utilizamos y protegemos tu información.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Cambios en los Términos</h2>
              <p>
                Nos reservamos el derecho de modificar estos Términos de Servicio en cualquier momento. 
                Los cambios entrarán en vigor inmediatamente después de su publicación. Tu uso continuado 
                del servicio después de los cambios constituye tu aceptación de los nuevos términos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Ley Aplicable</h2>
              <p>
                Estos Términos de Servicio se rigen por las leyes aplicables. Cualquier disputa relacionada 
                con estos términos será resuelta en los tribunales competentes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">13. Contacto</h2>
              <p>
                Si tienes preguntas sobre estos Términos de Servicio, puedes contactarnos a través de:
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

