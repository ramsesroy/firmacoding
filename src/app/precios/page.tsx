"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function PreciosPage() {
  const [donationAmount, setDonationAmount] = useState("");
  const [customAmount, setCustomAmount] = useState(false);

  const handleDonation = () => {
    // Aquí iría la integración con Stripe, PayPal, etc.
    alert(`Gracias por tu donación de $${donationAmount}. Esta funcionalidad se implementará próximamente.`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Precios que se adaptan a ti
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Siempre gratuito. Tu apoyo nos ayuda a mantener la plataforma libre y accesible para todos.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Plan Gratuito</h3>
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  $0
                  <span className="text-xl text-gray-500 font-normal">/siempre</span>
                </div>
                <p className="text-gray-600">Perfecto para empezar</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Crear firmas ilimitadas</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Todas las plantillas disponibles</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Exportar como HTML, PNG y PDF</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Guardar y gestionar firmas</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Soporte de la comunidad</span>
                </li>
              </ul>
              <Link
                href="/register"
                className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
              >
                Comenzar Gratis
              </Link>
            </div>

            {/* Supporter Plan */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
              <div className="relative">
                <div className="text-center mb-8">
                  <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-semibold mb-4">
                    ⭐ Más Popular
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Apoya el Proyecto</h3>
                  <div className="text-5xl font-bold mb-2">
                    Tú decides
                  </div>
                  <p className="text-blue-100">Donación única o recurrente</p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Todo lo del plan gratuito</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Badge de "Supporter" en tu perfil</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Acceso prioritario a nuevas funciones</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Ayudas a mantener la plataforma gratuita</span>
                  </li>
                </ul>
                <div className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    {[5, 10, 25, 50].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => {
                          setDonationAmount(amount.toString());
                          setCustomAmount(false);
                        }}
                        className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                          donationAmount === amount.toString() && !customAmount
                            ? "bg-white text-blue-600"
                            : "bg-white/20 text-white hover:bg-white/30"
                        }`}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Otra cantidad"
                      value={customAmount ? donationAmount : ""}
                      onChange={(e) => {
                        setDonationAmount(e.target.value);
                        setCustomAmount(true);
                      }}
                      onFocus={() => setCustomAmount(true)}
                      className="flex-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder:text-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <button
                      onClick={handleDonation}
                      disabled={!donationAmount}
                      className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Donar
                    </button>
                  </div>
                  <p className="text-sm text-blue-100 text-center mt-2">
                    💝 Tu apoyo nos ayuda a mantener la plataforma gratuita para todos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Support Section */}
      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
            ¿Por qué apoyar el proyecto?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Desarrollo Continuo</h3>
              <p className="text-gray-600">
                Tu donación nos permite seguir mejorando la plataforma, agregando nuevas funciones y manteniendo todo actualizado.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Accesible para Todos</h3>
              <p className="text-gray-600">
                Mantenemos la plataforma gratuita para que cualquier persona, sin importar su situación económica, pueda crear firmas profesionales.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sin Publicidad</h3>
              <p className="text-gray-600">
                No mostramos anuncios ni vendemos tus datos. Tu donación nos permite mantener la plataforma limpia y enfocada en ti.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Innovación</h3>
              <p className="text-gray-600">
                Invertimos en nuevas tecnologías, mejoras de rendimiento y características que realmente importan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
            Preguntas Frecuentes
          </h2>
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ¿Realmente es gratis para siempre?
              </h3>
              <p className="text-gray-600">
                Sí, el plan gratuito siempre será gratuito. No hay trucos ni límites ocultos. Puedes crear todas las firmas que quieras sin costo.
              </p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ¿Qué pasa con mi donación?
              </h3>
              <p className="text-gray-600">
                Tu donación se usa exclusivamente para mantener y mejorar la plataforma: servidores, desarrollo, mejoras de seguridad y nuevas funciones.
              </p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ¿Puedo cancelar mi donación recurrente?
              </h3>
              <p className="text-gray-600">
                Sí, puedes cancelar en cualquier momento desde tu panel de configuración. No hay penalizaciones ni preguntas.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ¿Hay algún límite en el plan gratuito?
              </h3>
              <p className="text-gray-600">
                No hay límites. Puedes crear firmas ilimitadas, usar todas las plantillas, exportar en todos los formatos y guardar todas tus firmas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

