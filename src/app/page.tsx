import Navbar from '@/components/custom/navbar';
import Link from 'next/link';
import { Dumbbell, Brain, Camera, TrendingUp, Sparkles, ArrowRight, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full text-sm font-medium mb-6 animate-pulse">
              <Sparkles className="w-4 h-4" />
              Powered by Inteligência Artificial
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Seu Personal Trainer
              <span className="block bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                Inteligente e Personalizado
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-400 mb-10 leading-relaxed">
              Treinos personalizados, planos alimentares completos e análise de calorias por foto.
              Tudo gerado por IA especialmente para você.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/quiz"
                className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/50 hover:scale-105 flex items-center gap-2"
              >
                Começar Agora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="#features"
                className="px-8 py-4 bg-gray-800/50 backdrop-blur-sm text-gray-300 rounded-xl font-semibold hover:bg-gray-800 transition-all border border-orange-500/20 hover:border-orange-500/40"
              >
                Ver Funcionalidades
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-1">100%</div>
                <div className="text-sm text-gray-500">Personalizado</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-1">IA</div>
                <div className="text-sm text-gray-500">Avançada</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-1">24/7</div>
                <div className="text-sm text-gray-500">Disponível</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Tecnologia de ponta para transformar seu corpo e sua saúde
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 hover:shadow-2xl hover:shadow-orange-500/20 transition-all hover:scale-105 border border-orange-500/10 hover:border-orange-500/30">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/50">
                <Dumbbell className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Treino Personalizado</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Planos completos adaptados ao seu objetivo, experiência e equipamentos disponíveis.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 hover:shadow-2xl hover:shadow-orange-500/20 transition-all hover:scale-105 border border-orange-500/10 hover:border-orange-500/30">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/50">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Dieta Inteligente</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Cardápios completos com macros, receitas e lista de compras gerados por IA.
              </p>
            </div>

            {/* Feature 3 - Foto → Calorias (AGORA COM LINK FUNCIONAL) */}
            <Link href="/calorias" className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 hover:shadow-2xl hover:shadow-orange-500/20 transition-all hover:scale-105 border border-orange-500/10 hover:border-orange-500/30 cursor-pointer">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/50">
                <Camera className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Foto → Calorias</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Tire foto do seu prato e descubra instantaneamente as calorias e macros.
              </p>
            </Link>

            {/* Feature 4 */}
            <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 hover:shadow-2xl hover:shadow-orange-500/20 transition-all hover:scale-105 border border-orange-500/10 hover:border-orange-500/30">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/50">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Acompanhamento</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Monitore seu progresso, histórico de treinos e evolução nutricional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Como funciona?
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Simples, rápido e eficiente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-orange-500/50">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Responda o Quiz</h3>
              <p className="text-gray-400">
                Conte sobre seus objetivos, rotina e preferências em um quiz rápido e intuitivo.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-orange-500/50">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Crie Sua Conta</h3>
              <p className="text-gray-400">
                Após o quiz, crie sua conta rapidamente para salvar seus dados e acessar tudo.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-orange-500/50">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Comece a Treinar</h3>
              <p className="text-gray-400">
                Acesse seu plano completo com ilustrações, dicas e acompanhe seu progresso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-500/10 via-orange-600/10 to-orange-500/10 border-y border-orange-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Transforme seu corpo agora
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Pronto para começar sua jornada?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Comece agora e tenha seu personal trainer de IA disponível 24/7
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105"
          >
            Criar Meu Plano Agora
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-black/50 text-center border-t border-gray-800">
        <p className="text-gray-500 text-sm">
          © 2024 Personal IA. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
