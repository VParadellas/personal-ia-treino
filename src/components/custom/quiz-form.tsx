'use client';

import { useState } from 'react';
import { QuizData } from '@/lib/types';
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const EQUIPAMENTOS_OPTIONS = [
  'Peso corporal',
  'Halteres',
  'Barra',
  'Banco',
  'Elásticos',
  'Kettlebell',
  'Máquinas',
  'TRX',
  'Corda',
  'Step'
];

const PREFERENCIAS_ALIMENTARES = [
  'Sem restrições',
  'Vegetariano',
  'Vegano',
  'Sem lactose',
  'Sem glúten',
  'Low carb',
  'Cetogênica'
];

export default function QuizForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<QuizData>>({
    equipamentos: [],
    lesoes: [],
    restricoes: [],
    preferenciasAlimentares: [],
    alimentosEvitar: [],
  });

  const totalSteps = 6;

  const updateField = (field: keyof QuizData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof QuizData, item: string) => {
    setFormData(prev => {
      const currentArray = (prev[field] as string[]) || [];
      const newArray = currentArray.includes(item)
        ? currentArray.filter(i => i !== item)
        : [...currentArray, item];
      return { ...prev, [field]: newArray };
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-treino', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Erro ao gerar treino');

      const workoutPlan = await response.json();
      
      // Salvar no localStorage
      localStorage.setItem('workoutPlan', JSON.stringify(workoutPlan));
      localStorage.setItem('quizData', JSON.stringify(formData));
      
      // Redirecionar para página de treino
      router.push('/treino');
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao gerar seu treino. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
    else handleSubmit();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.nome && formData.idade && formData.peso && formData.altura && formData.genero;
      case 2:
        return formData.objetivo;
      case 3:
        return formData.experiencia && formData.diasDisponiveis && formData.tempoTreino && formData.periodoTreino;
      case 4:
        // Se academia, não precisa selecionar equipamentos
        if (formData.localTreino === 'academia') return true;
        return formData.localTreino && formData.equipamentos && formData.equipamentos.length > 0;
      case 5:
        return true; // Lesões são opcionais
      case 6:
        return true; // Preferências são opcionais
      default:
        return false;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Etapa {step} de {totalSteps}
          </span>
          <span className="text-sm font-medium text-blue-600">
            {Math.round((step / totalSteps) * 100)}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-blue-700 transition-all duration-500 ease-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Dados Pessoais</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome completo
              </label>
              <input
                type="text"
                value={formData.nome || ''}
                onChange={(e) => updateField('nome', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Seu nome"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idade
                </label>
                <input
                  type="number"
                  value={formData.idade || ''}
                  onChange={(e) => updateField('idade', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="25"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gênero
                </label>
                <select
                  value={formData.genero || ''}
                  onChange={(e) => updateField('genero', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Selecione</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  value={formData.peso || ''}
                  onChange={(e) => updateField('peso', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="70"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Altura (cm)
                </label>
                <input
                  type="number"
                  value={formData.altura || ''}
                  onChange={(e) => updateField('altura', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="175"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Qual seu objetivo?</h2>
            
            <div className="grid grid-cols-1 gap-3">
              {[
                { value: 'perder_peso', label: 'Perder peso', emoji: '🔥' },
                { value: 'ganhar_massa', label: 'Ganhar massa muscular', emoji: '💪' },
                { value: 'definir', label: 'Definir/tonificar', emoji: '⚡' },
                { value: 'manter', label: 'Manter forma', emoji: '✨' },
                { value: 'performance', label: 'Melhorar performance', emoji: '🚀' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateField('objetivo', option.value)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    formData.objetivo === option.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span className="text-2xl mr-3">{option.emoji}</span>
                  <span className="font-medium text-gray-900">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Experiência e Rotina</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nível de experiência
              </label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { value: 'iniciante', label: 'Iniciante', desc: 'Pouca ou nenhuma experiência' },
                  { value: 'intermediario', label: 'Intermediário', desc: '6 meses a 2 anos de treino' },
                  { value: 'avancado', label: 'Avançado', desc: 'Mais de 2 anos de treino' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateField('experiencia', option.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.experiencia === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dias disponíveis por semana
                </label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={formData.diasDisponiveis || ''}
                  onChange={(e) => updateField('diasDisponiveis', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tempo por treino (minutos)
                </label>
                <input
                  type="number"
                  value={formData.tempoTreino || ''}
                  onChange={(e) => updateField('tempoTreino', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="60"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período preferido para treinar
              </label>
              <select
                value={formData.periodoTreino || ''}
                onChange={(e) => updateField('periodoTreino', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Selecione</option>
                <option value="manha">Manhã</option>
                <option value="tarde">Tarde</option>
                <option value="noite">Noite</option>
              </select>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Local e Equipamentos</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Onde você vai treinar?
              </label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { value: 'academia', label: 'Academia', emoji: '🏋️' },
                  { value: 'casa', label: 'Em casa', emoji: '🏠' },
                  { value: 'parque', label: 'Parque/Ar livre', emoji: '🌳' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      updateField('localTreino', option.value);
                      // Se academia, define todos os equipamentos automaticamente
                      if (option.value === 'academia') {
                        updateField('equipamentos', EQUIPAMENTOS_OPTIONS);
                      } else {
                        // Limpa equipamentos se mudar de academia para outro local
                        updateField('equipamentos', []);
                      }
                    }}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.localTreino === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <span className="text-2xl mr-3">{option.emoji}</span>
                    <span className="font-medium text-gray-900">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Só mostra seleção de equipamentos se NÃO for academia */}
            {formData.localTreino && formData.localTreino !== 'academia' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Equipamentos disponíveis (selecione todos que tiver)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {EQUIPAMENTOS_OPTIONS.map((equip) => (
                    <button
                      key={equip}
                      onClick={() => toggleArrayItem('equipamentos', equip)}
                      className={`p-3 rounded-xl border-2 transition-all text-sm ${
                        formData.equipamentos?.includes(equip)
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-blue-300 text-gray-700'
                      }`}
                    >
                      {equip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mensagem informativa quando academia está selecionada */}
            {formData.localTreino === 'academia' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  ✅ <strong>Perfeito!</strong> Como você treina em academia, consideraremos que todos os equipamentos estão disponíveis.
                </p>
              </div>
            )}
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Limitações e Restrições</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Possui alguma lesão ou limitação física?
              </label>
              <textarea
                value={formData.lesoes?.join(', ') || ''}
                onChange={(e) => updateField('lesoes', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows={3}
                placeholder="Ex: dor no joelho direito, tendinite no ombro (deixe em branco se não tiver)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Outras restrições ou observações
              </label>
              <textarea
                value={formData.restricoes?.join(', ') || ''}
                onChange={(e) => updateField('restricoes', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows={3}
                placeholder="Ex: não gosto de correr, prefiro treinos curtos (opcional)"
              />
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Preferências Alimentares</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Preferências alimentares (opcional)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {PREFERENCIAS_ALIMENTARES.map((pref) => (
                  <button
                    key={pref}
                    onClick={() => toggleArrayItem('preferenciasAlimentares', pref)}
                    className={`p-3 rounded-xl border-2 transition-all text-sm ${
                      formData.preferenciasAlimentares?.includes(pref)
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-blue-300 text-gray-700'
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alimentos que você evita ou não gosta
              </label>
              <textarea
                value={formData.alimentosEvitar?.join(', ') || ''}
                onChange={(e) => updateField('alimentosEvitar', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows={3}
                placeholder="Ex: brócolis, peixe, leite (opcional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantas refeições por dia você prefere?
              </label>
              <input
                type="number"
                min="3"
                max="6"
                value={formData.refeicoesPreferidas || 4}
                onChange={(e) => updateField('refeicoesPreferidas', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="4"
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        {step > 1 && (
          <button
            onClick={prevStep}
            disabled={loading}
            className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Voltar
          </button>
        )}
        
        <button
          onClick={nextStep}
          disabled={!canProceed() || loading}
          className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Gerando seu treino...
            </>
          ) : step === totalSteps ? (
            'Gerar Meu Treino'
          ) : (
            <>
              Próximo
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
