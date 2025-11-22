'use client';

import Navbar from '@/components/custom/navbar';
import QuizForm from '@/components/custom/quiz-form';

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Navbar />
      
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Crie Seu Plano Personalizado
            </h1>
            <p className="text-lg text-gray-400">
              Responda algumas perguntas para gerar seu treino e dieta com IA
            </p>
          </div>

          <QuizForm />
        </div>
      </div>
    </div>
  );
}
