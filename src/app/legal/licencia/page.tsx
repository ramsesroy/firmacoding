import Link from "next/link";

export const metadata = {
  title: "Licencia - Signature For Me",
  description: "Información sobre la licencia y términos de uso del software Signature For Me.",
};

export default function LicenciaPage() {
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
            Licencia
          </h1>
          
          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <p className="text-sm text-gray-500">
              Última actualización: {new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
            </p>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Propiedad Intelectual</h2>
              <p>
                Signature For Me y todo su contenido, incluyendo pero no limitado a diseños, texto, gráficos, 
                logotipos, iconos, imágenes, código fuente, compilaciones, software y otros materiales (colectivamente, 
                el "Contenido"), son propiedad de Signature For Me o de sus proveedores de contenido y están protegidos 
                por las leyes de derechos de autor, marcas comerciales y otras leyes de propiedad intelectual.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Licencia de Uso</h2>
              <p>
                Se te otorga una licencia limitada, no exclusiva, no transferible y revocable para acceder y utilizar 
                Signature For Me únicamente para tu uso personal o comercial interno. Esta licencia está sujeta a los 
                siguientes términos y condiciones:
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.1 Lo que PUEDES hacer:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Usar el servicio para crear firmas digitales profesionales</li>
                <li>Crear y almacenar múltiples firmas para tu uso personal o profesional</li>
                <li>Exportar tus firmas en formato HTML para usar en correos electrónicos</li>
                <li>Compartir tus firmas creadas con otras personas</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.2 Lo que NO PUEDES hacer:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Copiar, modificar o distribuir el código fuente del servicio</li>
                <li>Intentar extraer o descompilar el software</li>
                <li>Usar el servicio para crear productos o servicios competidores</li>
                <li>Reutilizar las plantillas para otros servicios sin autorización</li>
                <li>Eliminar o alterar avisos de derechos de autor o marcas registradas</li>
                <li>Vender, sublicenciar o transferir tu acceso al servicio</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Contenido del Usuario</h2>
              <p>
                Mantienes todos los derechos de propiedad intelectual sobre las firmas que creas utilizando Signature For Me. 
                Sin embargo, al utilizar el servicio, nos otorgas una licencia mundial, no exclusiva, libre de regalías 
                para almacenar, procesar y mostrar tus firmas únicamente para proporcionar el servicio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Plantillas y Diseños</h2>
              <p>
                Las plantillas y diseños proporcionados por Signature For Me son propiedad de Signature For Me. 
                Puedes usar estas plantillas para crear tus firmas personales, pero no puedes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Extraer o copiar los diseños de plantillas para uso fuera del servicio</li>
                <li>Crear servicios competidores basados en nuestras plantillas</li>
                <li>Modificar o redistribuir las plantillas</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Marcas Comerciales</h2>
              <p>
                "Signature For Me", el logotipo y otros nombres comerciales, marcas de servicio, gráficos y logotipos 
                utilizados en conexión con el servicio son marcas comerciales o marcas de servicio de Signature For Me. 
                No puedes usar estas marcas sin nuestro consentimiento previo por escrito.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Tecnologías de Terceros</h2>
              <p>
                Signature For Me utiliza tecnologías y servicios de terceros, incluyendo:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Supabase:</strong> Para autenticación y almacenamiento de datos. 
                  Sujeta a la licencia de Supabase.
                </li>
                <li>
                  <strong>Next.js:</strong> Framework de desarrollo bajo licencia MIT.
                </li>
                <li>
                  <strong>React:</strong> Biblioteca JavaScript bajo licencia MIT.
                </li>
                <li>
                  <strong>Tailwind CSS:</strong> Framework CSS bajo licencia MIT.
                </li>
              </ul>
              <p className="mt-4">
                Estas tecnologías están sujetas a sus propias licencias y términos de uso.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Terminación de la Licencia</h2>
              <p>
                Esta licencia es efectiva hasta que se termine. Terminará automáticamente si violas cualquiera de 
                estos términos. Además, podemos terminar tu acceso al servicio en cualquier momento, con o sin causa 
                o previo aviso.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Sin Garantías</h2>
              <p>
                El servicio se proporciona "tal cual" y "según disponibilidad" sin garantías de ningún tipo, 
                ya sean expresas o implícitas, incluyendo pero no limitado a garantías de comerciabilidad, 
                idoneidad para un propósito particular o no infracción.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Limitación de Responsabilidad</h2>
              <p>
                En la medida máxima permitida por la ley, Signature For Me no será responsable de ningún daño directo, 
                indirecto, incidental, especial, consecuente o punitivo que resulte del uso o la imposibilidad de usar 
                el servicio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Cambios a esta Licencia</h2>
              <p>
                Nos reservamos el derecho de modificar esta Licencia en cualquier momento. Los cambios entrarán en vigor 
                inmediatamente después de su publicación en esta página. Tu uso continuado del servicio después de los 
                cambios constituye tu aceptación de la licencia modificada.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Ley Aplicable</h2>
              <p>
                Esta Licencia se rige por las leyes aplicables. Cualquier disputa relacionada con esta licencia será 
                resuelta en los tribunales competentes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Contacto</h2>
              <p>
                Si tienes preguntas sobre esta Licencia, puedes contactarnos a través de:
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

