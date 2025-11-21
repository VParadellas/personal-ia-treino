'use client';

import { useEffect, useState } from 'react';
import { WorkoutPlan } from '@/lib/types';
import Navbar from '@/components/custom/navbar';
import ExerciseCard from '@/components/custom/exercise-card';
import { Calendar, Clock, Target, TrendingUp, Dumbbell, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function TreinoPage() {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    const savedPlan = localStorage.getItem('workoutPlan');
    if (savedPlan) {
      setWorkoutPlan(JSON.parse(savedPlan));
    }
  }, []);

  if (!workoutPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
        <Navbar />
        <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12">
              <Dumbbell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Você ainda não tem um treino
              </h2>
              <p className="text-gray-600 mb-6">
                Complete o quiz para gerar seu plano de treino personalizado
              </p>
              <Link
                href="/quiz"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
              >
                Fazer Quiz Agora
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentDay = workoutPlan.dias[selectedDay];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-2xl p-6 sm:p-8 mb-8 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                  {workoutPlan.titulo}
                </h1>
                <p className="text-blue-100 text-lg">
                  {workoutPlan.descricao}
                </p>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <div className="text-sm text-blue-100">Objetivo</div>
                <div className="text-lg font-bold">{workoutPlan.objetivo}</div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <Calendar className="w-5 h-5 mb-2 text-blue-200" />
                <div className="text-sm text-blue-100">Duração</div>
                <div className="font-bold">{workoutPlan.duracao}</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <Clock className="w-5 h-5 mb-2 text-blue-200" />
                <div className="text-sm text-blue-100">Frequência</div>
                <div className="font-bold">{workoutPlan.frequencia}</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <Target className="w-5 h-5 mb-2 text-blue-200" />
                <div className="text-sm text-blue-100">Dias</div>
                <div className="font-bold">{workoutPlan.dias.length} treinos</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <TrendingUp className="w-5 h-5 mb-2 text-blue-200" />
                <div className="text-sm text-blue-100">Nível</div>
                <div className="font-bold">Personalizado</div>
              </div>
            </div>
          </div>

          {/* Day Selector */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Selecione o dia</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {workoutPlan.dias.map((dia, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDay(index)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedDay === index
                      ? 'border-blue-600 bg-blue-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    selectedDay === index ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {dia.dia}
                  </div>
                  <div className={`font-bold ${
                    selectedDay === index ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {dia.foco}
                  </div>
                  <div className={`text-xs mt-1 ${
                    selectedDay === index ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {dia.exercicios.length} exercícios
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Current Day Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{currentDay.dia}</h2>
                <p className="text-gray-600">Foco: {currentDay.foco}</p>
              </div>
              <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-semibold">
                {currentDay.exercicios.length} exercícios
              </div>
            </div>

            {currentDay.observacoes.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Observações Importantes</h3>
                    <ul className="space-y-1">
                      {currentDay.observacoes.map((obs, idx) => (
                        <li key={idx} className="text-sm text-gray-700">• {obs}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Exercises */}
          <div className="space-y-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Exercícios</h2>
            {currentDay.exercicios.map((exercise, index) => (
              <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
            ))}
          </div>

          {/* General Tips */}
          {workoutPlan.dicasGerais.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 mb-8 border border-green-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-green-600" />
                Dicas Gerais do Programa
              </h2>
              <ul className="space-y-3">
                {workoutPlan.dicasGerais.map((dica, idx) => (
                  <li key={idx} className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                    <span>{dica}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Progression */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 border border-purple-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              Progressão
            </h2>
            <p className="text-gray-700 leading-relaxed">{workoutPlan.progressao}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
