'use client';

import { Exercise } from '@/lib/types';
import { ChevronDown, ChevronUp, Dumbbell, AlertCircle, Lightbulb, Target, Wind, Clock, Zap } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
}

export default function ExerciseCard({ exercise, index }: ExerciseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [ilustracaoUrl, setIlustracaoUrl] = useState<string | null>(null);
  const [loadingIlustracao, setLoadingIlustracao] = useState(false);

  const loadIlustracao = async () => {
    if (ilustracaoUrl || !exercise.ilustracaoPrompt) return;
    
    setLoadingIlustracao(true);
    try {
      const response = await fetch('/api/generate-illustration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseName: exercise.nome,
          prompt: exercise.ilustracaoPrompt,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIlustracaoUrl(data.imageUrl);
      }
    } catch (error) {
      console.error('Erro ao carregar ilustração:', error);
    } finally {
      setLoadingIlustracao(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{exercise.nome}</h3>
            </div>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Target className="w-4 h-4" />
              {exercise.grupoMuscular}
            </p>
          </div>
          
          <button
            onClick={() => {
              setIsExpanded(!isExpanded);
              if (!isExpanded && !ilustracaoUrl) {
                loadIlustracao();
              }
            }}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-6 h-6 text-blue-600" />
            ) : (
              <ChevronDown className="w-6 h-6 text-blue-600" />
            )}
          </button>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{exercise.series}</div>
            <div className="text-xs text-gray-600 mt-1">Séries</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{exercise.repeticoes}</div>
            <div className="text-xs text-gray-600 mt-1">Repetições</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{exercise.descanso}</div>
            <div className="text-xs text-gray-600 mt-1">Descanso</div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Ilustração */}
          {exercise.ilustracaoPrompt && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-blue-600" />
                Ilustração do Exercício
              </h4>
              
              {loadingIlustracao ? (
                <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
                    <p className="text-sm text-gray-600">Gerando ilustração...</p>
                  </div>
                </div>
              ) : ilustracaoUrl ? (
                <div className="relative h-64 sm:h-80 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={ilustracaoUrl}
                    alt={`Ilustração do exercício ${exercise.nome}`}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <button
                  onClick={loadIlustracao}
                  className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Carregar Ilustração
                </button>
              )}
            </div>
          )}

          {/* Descrição */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Descrição</h4>
            <p className="text-gray-700 leading-relaxed">{exercise.descricao}</p>
          </div>

          {/* Instruções Passo a Passo */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Como Executar
            </h4>
            <ol className="space-y-2">
              {exercise.instrucoes.map((instrucao, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700 flex-1">{instrucao}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Detalhes Técnicos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Wind className="w-4 h-4 text-blue-600" />
                Respiração
              </h5>
              <p className="text-sm text-gray-700">{exercise.respiracao}</p>
            </div>

            <div className="bg-blue-50 rounded-xl p-4">
              <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Velocidade
              </h5>
              <p className="text-sm text-gray-700">{exercise.velocidade}</p>
            </div>
          </div>

          {/* Musculatura Alvo */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Músculos Trabalhados
            </h4>
            <div className="flex flex-wrap gap-2">
              {exercise.musculaturaAlvo.map((musculo, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                >
                  {musculo}
                </span>
              ))}
            </div>
          </div>

          {/* Dicas de Ouro */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              Dicas de Ouro
            </h4>
            <ul className="space-y-2">
              {exercise.dicasOuro.map((dica, idx) => (
                <li key={idx} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-yellow-600 font-bold">✓</span>
                  <span>{dica}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Erros Comuns */}
          <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 border border-red-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Erros Comuns a Evitar
            </h4>
            <ul className="space-y-2">
              {exercise.errosComuns.map((erro, idx) => (
                <li key={idx} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-red-600 font-bold">✗</span>
                  <span>{erro}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Exercícios Alternativos */}
          {exercise.exerciciosAlternativos.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Exercícios Alternativos</h4>
              <div className="flex flex-wrap gap-2">
                {exercise.exerciciosAlternativos.map((alt, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {alt}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tempo sob Tensão */}
          {exercise.tempoTensao && (
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <h4 className="font-semibold text-gray-900 mb-2">Tempo sob Tensão</h4>
              <p className="text-sm text-gray-700">{exercise.tempoTensao}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
