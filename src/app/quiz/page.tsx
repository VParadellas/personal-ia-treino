import Navbar from '@/components/custom/navbar';
import QuizForm from '@/components/custom/quiz-form';
import { Brain } from 'lucide-react';

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              <Brain className="w-4 h-4" />
              Quiz Personalizado
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Vamos conhecer você melhor
            </h1>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Responda algumas perguntas para que possamos criar o treino e dieta perfeitos para seus objetivos
            </p>
          </div>

          {/* Quiz Form */}
          <QuizForm />
        </div>
      </div>
    </div>
  );
}
