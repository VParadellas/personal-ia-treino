'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/custom/navbar';
import { Calendar, Clock, Target, TrendingUp, Dumbbell, AlertCircle, Utensils, ChevronDown, ChevronUp, Apple, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

interface Exercicio {
  nome: string;
  series: string;
  repeticoes: string;
  descanso: string;
  observacoes: string;
}

interface Treino {
  dia: string;
  foco: string;
  duracao: string;
  aquecimento: string;
  exercicios: Exercicio[];
  alongamento: string;
}

interface PlanoTreino {
  titulo: string;
  resumo: string;
  observacoes: string[];
  treinos: Treino[];
}

interface Alimento {
  item: string;
  quantidade: string;
  calorias: string;
}

interface Refeicao {
  nome: string;
  horario: string;
  calorias: string;
  alimentos: Alimento[];
  preparo: string;
  substituicoes: string[];
}

interface PlanoDieta {
  titulo: string;
  resumo: string;
  metasCalorias: {
    total: string;
    proteinas: string;
    carboidratos: string;
    gorduras: string;
  };
  observacoes: string[];
  refeicoes: Refeicao[];
  listaCompras: {
    proteinas: string[];
    carboidratos: string[];
    vegetais: string[];
    frutas: string[];
    outros: string[];
  };
  dicasGerais: string[];
}

interface PlanoCompleto {
  success: boolean;
  dados: {
    nome: string;
    imc: string;
    tmb: string;
    caloriasAlvo: string;
  };
  treino: PlanoTreino;
  dieta: PlanoDieta;
}

export default function TreinoPage() {
  const [planoCompleto, setPlanoCompleto] = useState<PlanoCompleto | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [activeTab, setActiveTab] = useState<'treino' | 'dieta'>('treino');
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);
  const [expandedRefeicao, setExpandedRefeicao] = useState<number | null>(null);

  useEffect(() => {
    const savedPlan = localStorage.getItem('workoutPlan');
    if (savedPlan) {
      setPlanoCompleto(JSON.parse(savedPlan));
    }
  }, []);

  if (!planoCompleto) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <Navbar />
        <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-orange-500/20 rounded-2xl shadow-2xl p-8 sm:p-12">
              <Dumbbell className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">
                Você ainda não tem um plano personalizado
              </h2>
              <p className="text-gray-400 mb-6">
                Complete o quiz para gerar seu plano de treino e alimentação personalizado
              </p>
              <Link
                href="/quiz"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30"
              >
                Fazer Quiz Agora
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { treino, dieta, dados } = planoCompleto;
  const currentDay = treino.treinos[selectedDay];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header com dados do usuário */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-2xl p-6 sm:p-8 mb-8 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                  Olá, {dados.nome}! 👋
                </h1>
                <p className="text-orange-100 text-lg">
                  Seu plano personalizado está pronto
                </p>
              </div>
            </div>

            {/* Stats do usuário */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-sm text-orange-100">IMC</div>
                <div className="font-bold text-xl">{dados.imc}</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-sm text-orange-100">TMB</div>
                <div className="font-bold text-xl">{dados.tmb} kcal</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-sm text-orange-100">Meta Diária</div>
                <div className="font-bold text-xl">{dados.caloriasAlvo} kcal</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-sm text-orange-100">Treinos</div>
                <div className="font-bold text-xl">{treino.treinos.length}x/semana</div>
              </div>
            </div>
          </div>

          {/* Tabs Treino/Dieta */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab('treino')}
              className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'treino'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
              }`}
            >
              <Dumbbell className="w-5 h-5" />
              Plano de Treino
            </button>
            <button
              onClick={() => setActiveTab('dieta')}
              className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'dieta'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
              }`}
            >
              <Utensils className="w-5 h-5" />
              Plano Alimentar
            </button>
          </div>

          {/* Conteúdo do Treino */}
          {activeTab === 'treino' && (
            <>
              {/* Info do Plano */}
              <div className="bg-gray-900/50 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-3">{treino.titulo}</h2>
                <p className="text-gray-400 mb-4">{treino.resumo}</p>
                {treino.observacoes.length > 0 && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                    <h3 className="font-semibold text-orange-400 mb-2">⚡ Observações Importantes</h3>
                    <ul className="space-y-1">
                      {treino.observacoes.map((obs, idx) => (
                        <li key={idx} className="text-sm text-gray-300">• {obs}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Seletor de Dias */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Selecione o dia</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {treino.treinos.map((dia, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDay(index)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        selectedDay === index
                          ? 'border-orange-500 bg-orange-500/10 shadow-lg'
                          : 'border-gray-700 bg-gray-800/50 hover:border-orange-500/50'
                      }`}
                    >
                      <div className={`text-sm font-medium mb-1 ${
                        selectedDay === index ? 'text-orange-400' : 'text-gray-400'
                      }`}>
                        {dia.dia}
                      </div>
                      <div className={`font-bold ${
                        selectedDay === index ? 'text-white' : 'text-gray-300'
                      }`}>
                        {dia.foco}
                      </div>
                      <div className={`text-xs mt-1 ${
                        selectedDay === index ? 'text-orange-400' : 'text-gray-500'
                      }`}>
                        {dia.exercicios.length} exercícios
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Detalhes do Dia */}
              <div className="bg-gray-900/50 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{currentDay.dia}</h2>
                    <p className="text-gray-400">Foco: {currentDay.foco}</p>
                  </div>
                  <div className="bg-orange-500/10 text-orange-400 px-4 py-2 rounded-xl font-semibold border border-orange-500/20">
                    {currentDay.duracao}
                  </div>
                </div>

                {/* Aquecimento */}
                <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
                  <h3 className="font-semibold text-orange-400 mb-2">🔥 Aquecimento</h3>
                  <p className="text-gray-300 text-sm">{currentDay.aquecimento}</p>
                </div>

                {/* Exercícios */}
                <div className="space-y-3 mb-4">
                  <h3 className="font-semibold text-white text-lg">💪 Exercícios</h3>
                  {currentDay.exercicios.map((ex, idx) => (
                    <div key={idx} className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700">
                      <button
                        onClick={() => setExpandedExercise(expandedExercise === idx ? null : idx)}
                        className="w-full p-4 flex items-center justify-between hover:bg-gray-800/70 transition-all"
                      >
                        <div className="text-left">
                          <div className="font-semibold text-white">{idx + 1}. {ex.nome}</div>
                          <div className="text-sm text-gray-400">
                            {ex.series} séries × {ex.repeticoes} reps • {ex.descanso} descanso
                          </div>
                        </div>
                        {expandedExercise === idx ? (
                          <ChevronUp className="w-5 h-5 text-orange-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      {expandedExercise === idx && (
                        <div className="px-4 pb-4 border-t border-gray-700 pt-3">
                          <p className="text-sm text-gray-300">{ex.observacoes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Alongamento */}
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <h3 className="font-semibold text-orange-400 mb-2">🧘 Alongamento</h3>
                  <p className="text-gray-300 text-sm">{currentDay.alongamento}</p>
                </div>
              </div>
            </>
          )}

          {/* Conteúdo da Dieta */}
          {activeTab === 'dieta' && (
            <>
              {/* Info do Plano Alimentar */}
              <div className="bg-gray-900/50 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-3">{dieta.titulo}</h2>
                <p className="text-gray-400 mb-4">{dieta.resumo}</p>

                {/* Metas de Macros */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                    <div className="text-sm text-orange-400">Calorias</div>
                    <div className="font-bold text-white text-xl">{dieta.metasCalorias.total}</div>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                    <div className="text-sm text-orange-400">Proteínas</div>
                    <div className="font-bold text-white text-xl">{dieta.metasCalorias.proteinas}g</div>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                    <div className="text-sm text-orange-400">Carboidratos</div>
                    <div className="font-bold text-white text-xl">{dieta.metasCalorias.carboidratos}g</div>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                    <div className="text-sm text-orange-400">Gorduras</div>
                    <div className="font-bold text-white text-xl">{dieta.metasCalorias.gorduras}g</div>
                  </div>
                </div>

                {dieta.observacoes.length > 0 && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                    <h3 className="font-semibold text-orange-400 mb-2">⚡ Observações Importantes</h3>
                    <ul className="space-y-1">
                      {dieta.observacoes.map((obs, idx) => (
                        <li key={idx} className="text-sm text-gray-300">• {obs}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Refeições */}
              <div className="space-y-4 mb-8">
                <h2 className="text-xl font-bold text-white">🍽️ Suas Refeições</h2>
                {dieta.refeicoes.map((refeicao, idx) => (
                  <div key={idx} className="bg-gray-900/50 backdrop-blur-xl border border-orange-500/20 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setExpandedRefeicao(expandedRefeicao === idx ? null : idx)}
                      className="w-full p-6 flex items-center justify-between hover:bg-gray-800/50 transition-all"
                    >
                      <div className="text-left">
                        <div className="font-bold text-white text-lg">{refeicao.nome}</div>
                        <div className="text-sm text-gray-400">{refeicao.horario} • {refeicao.calorias}</div>
                      </div>
                      {expandedRefeicao === idx ? (
                        <ChevronUp className="w-6 h-6 text-orange-400" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-400" />
                      )}
                    </button>
                    {expandedRefeicao === idx && (
                      <div className="px-6 pb-6 border-t border-gray-700 pt-4">
                        {/* Alimentos */}
                        <div className="mb-4">
                          <h4 className="font-semibold text-orange-400 mb-2">Alimentos:</h4>
                          <div className="space-y-2">
                            {refeicao.alimentos.map((alimento, aIdx) => (
                              <div key={aIdx} className="flex justify-between text-sm bg-gray-800/50 p-3 rounded-lg">
                                <span className="text-gray-300">{alimento.item}</span>
                                <span className="text-gray-400">{alimento.quantidade} • {alimento.calorias}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Preparo */}
                        <div className="mb-4">
                          <h4 className="font-semibold text-orange-400 mb-2">Preparo:</h4>
                          <p className="text-sm text-gray-300">{refeicao.preparo}</p>
                        </div>

                        {/* Substituições */}
                        {refeicao.substituicoes.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-orange-400 mb-2">Substituições:</h4>
                            <ul className="space-y-1">
                              {refeicao.substituicoes.map((sub, sIdx) => (
                                <li key={sIdx} className="text-sm text-gray-300">• {sub}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Lista de Compras */}
              <div className="bg-gray-900/50 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-6 mb-8">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6 text-orange-400" />
                  Lista de Compras
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(dieta.listaCompras).map(([categoria, itens]) => (
                    <div key={categoria} className="bg-gray-800/50 rounded-xl p-4">
                      <h3 className="font-semibold text-orange-400 mb-2 capitalize">{categoria}</h3>
                      <ul className="space-y-1">
                        {itens.map((item, idx) => (
                          <li key={idx} className="text-sm text-gray-300">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dicas Gerais */}
              {dieta.dicasGerais.length > 0 && (
                <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Apple className="w-6 h-6 text-orange-400" />
                    Dicas Gerais
                  </h2>
                  <ul className="space-y-2">
                    {dieta.dicasGerais.map((dica, idx) => (
                      <li key={idx} className="flex gap-3 text-gray-300">
                        <span className="text-orange-400 font-bold flex-shrink-0">✓</span>
                        <span>{dica}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
