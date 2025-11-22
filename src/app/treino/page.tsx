'use client';

import Navbar from '@/components/custom/navbar';
import { Dumbbell, Clock, Target, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Exercicio {
  nome: string;
  series: number;
  repeticoes: string;
  descanso: string;
  dicas: string;
}

interface Treino {
  dia: string;
  foco: string;
  duracao: number;
  aquecimento: string;
  exercicios: Exercicio[];
  alongamento: string;
}

interface WorkoutPlan {
  titulo: string;
  descricao: string;
  semanas: number;
  treinos: Treino[];
  observacoes: string;
}

export default function TreinoPage() {
  const router = useRouter();
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(0);

  useEffect(() => {
    const savedPlan = localStorage.getItem('workoutPlan');
    if (!savedPlan) {
      toast.error('Nenhum treino encontrado. Complete o quiz primeiro.');
      router.push('/quiz');
      return;
    }

    try {
      const plan = JSON.parse(savedPlan);
      setWorkoutPlan(plan);
    } catch (error) {
      console.error('Erro ao carregar treino:', error);
      toast.error('Erro ao carregar treino. Tente novamente.');
      router.push('/quiz');
    }
  }, [router]);

  if (!workoutPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Dumbbell className="w-12 h-12 text-orange-400 animate-pulse mx-auto mb-4" />
          <p className="text-gray-400">Carregando seu treino...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Navbar />
      
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full text-sm font-medium mb-6">
              <Target className="w-4 h-4" />
              Plano Personalizado
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              {workoutPlan.titulo}
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-6">
              {workoutPlan.descricao}
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4 text-orange-400" />
                <span>{workoutPlan.semanas} semanas</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Dumbbell className="w-4 h-4 text-orange-400" />
                <span>{workoutPlan.treinos.length} treinos/semana</span>
              </div>
            </div>
          </div>

          {/* Treinos */}
          <div className="space-y-4 mb-8">
            {workoutPlan.treinos.map((treino, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-orange-500/20 overflow-hidden"
              >
                {/* Header do Treino */}
                <button
                  onClick={() => setExpandedDay(expandedDay === index ? null : index)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-800/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-12 h-12 rounded-xl flex items-center justify-center">
                      <Dumbbell className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-white">{treino.dia}</h3>
                      <p className="text-sm text-gray-400">{treino.foco}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{treino.duracao} min</span>
                    </div>
                    {expandedDay === index ? (
                      <ChevronUp className="w-6 h-6 text-orange-400" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Conteúdo Expandido */}
                {expandedDay === index && (
                  <div className="px-6 pb-6 space-y-6">
                    {/* Aquecimento */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                      <h4 className="font-semibold text-blue-400 mb-2">🔥 Aquecimento</h4>
                      <p className="text-gray-300 text-sm">{treino.aquecimento}</p>
                    </div>

                    {/* Exercícios */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-white">Exercícios</h4>
                      {treino.exercicios.map((exercicio, exIndex) => (
                        <div
                          key={exIndex}
                          className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h5 className="font-semibold text-white">{exercicio.nome}</h5>
                            <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded">
                              #{exIndex + 1}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-gray-400 mb-1">Séries</p>
                              <p className="font-semibold text-white">{exercicio.series}x</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 mb-1">Repetições</p>
                              <p className="font-semibold text-white">{exercicio.repeticoes}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 mb-1">Descanso</p>
                              <p className="font-semibold text-white">{exercicio.descanso}</p>
                            </div>
                          </div>
                          <div className="bg-gray-800/50 rounded-lg p-3">
                            <p className="text-xs text-gray-400 mb-1">💡 Dica</p>
                            <p className="text-sm text-gray-300">{exercicio.dicas}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Alongamento */}
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                      <h4 className="font-semibold text-green-400 mb-2">🧘 Alongamento</h4>
                      <p className="text-gray-300 text-sm">{treino.alongamento}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Observações */}
          {workoutPlan.observacoes && (
            <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-2xl p-6">
              <h3 className="font-semibold text-orange-400 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Observações Importantes
              </h3>
              <p className="text-gray-300 leading-relaxed">{workoutPlan.observacoes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
