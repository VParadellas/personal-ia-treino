import Navbar from '@/components/custom/navbar';
import Link from 'next/link';
import { Dumbbell, Brain, Camera, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6 animate-pulse">
              <Sparkles className="w-4 h-4" />
              Powered by Inteligência Artificial
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Seu Personal Trainer
              <span className="block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Inteligente e Personalizado
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed">
              Treinos personalizados, planos alimentares completos e análise de calorias por foto.
              Tudo gerado por IA especialmente para você.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/quiz"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 flex items-center gap-2"
              >
                Começar Agora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="#features"
                className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all border-2 border-gray-200 hover:border-blue-300"
              >
                Ver Funcionalidades
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1">100%</div>
                <div className="text-sm text-gray-600">Personalizado</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1">IA</div>
                <div className="text-sm text-gray-600">Avançada</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1">24/7</div>
                <div className="text-sm text-gray-600">Disponível</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tecnologia de ponta para transformar seu corpo e sua saúde
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 hover:shadow-xl transition-all hover:scale-105 border border-blue-200">
              <div className="bg-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Dumbbell className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Treino Personalizado</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Planos completos adaptados ao seu objetivo, experiência e equipamentos disponíveis.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 hover:shadow-xl transition-all hover:scale-105 border border-green-200">
              <div className="bg-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Dieta Inteligente</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Cardápios completos com macros, receitas e lista de compras gerados por IA.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 hover:shadow-xl transition-all hover:scale-105 border border-purple-200">
              <div className="bg-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Camera className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Foto → Calorias</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Tire foto do seu prato e descubra instantaneamente as calorias e macros.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 hover:shadow-xl transition-all hover:scale-105 border border-orange-200">
              <div className="bg-orange-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Acompanhamento</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Monitore seu progresso, histórico de treinos e evolução nutricional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Como funciona?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simples, rápido e eficiente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Responda o Quiz</h3>
              <p className="text-gray-600">
                Conte sobre seus objetivos, rotina e preferências em um quiz rápido e intuitivo.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">IA Gera Seu Plano</h3>
              <p className="text-gray-600">
                Nossa inteligência artificial cria treinos e dieta 100% personalizados para você.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Comece a Treinar</h3>
              <p className="text-gray-600">
                Acesse seu plano completo com ilustrações, dicas e acompanhe seu progresso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Pronto para transformar seu corpo?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Comece agora e tenha seu personal trainer de IA disponível 24/7
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-xl hover:scale-105"
          >
            Criar Meu Plano Agora
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-center">
        <p className="text-gray-400 text-sm">
          © 2024 Personal IA. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
