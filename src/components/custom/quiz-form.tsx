'use client';

import { useState } from 'react';
import { QuizData } from '@/lib/types';
import { ChevronRight, ChevronLeft, Loader2, X, Mail, Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/supabase';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
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

  const handleQuizComplete = () => {
    // Salvar dados do quiz temporariamente
    localStorage.setItem('pendingQuizData', JSON.stringify(formData));
    // Mostrar modal de cadastro
    setShowSignupModal(true);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (signupData.password.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const { error } = await auth.signUp(signupData.email, signupData.password);
      
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      // Cadastro bem-sucedido, agora gerar o treino
      toast.success('Cadastro realizado! Gerando seu treino...');
      await generateWorkout();
    } catch (error) {
      toast.error('Erro ao criar conta');
      setLoading(false);
    }
  };

  const handleSocialSignup = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    try {
      const { error } = provider === 'google' 
        ? await auth.signInWithGoogle()
        : await auth.signInWithFacebook();
      
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      // Login social bem-sucedido, gerar treino
      toast.success('Login realizado! Gerando seu treino...');
      await generateWorkout();
    } catch (error) {
      toast.error(`Erro ao cadastrar com ${provider === 'google' ? 'Google' : 'Facebook'}`);
      setLoading(false);
    }
  };

  const generateWorkout = async () => {
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
      
      // Limpar dados pendentes
      localStorage.removeItem('pendingQuizData');
      
      // Redirecionar para página de treino
      router.push('/treino');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao gerar seu treino. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleQuizComplete();
    }
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
    <>
      <div className="w-full max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-400">
              Etapa {step} de {totalSteps}
            </span>
            <span className="text-sm font-medium text-orange-400">
              {Math.round((step / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500 ease-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-6 sm:p-8 mb-6">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Dados Pessoais</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={formData.nome || ''}
                  onChange={(e) => updateField('nome', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-gray-500"
                  placeholder="Seu nome"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Idade
                  </label>
                  <input
                    type="number"
                    value={formData.idade || ''}
                    onChange={(e) => updateField('idade', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-gray-500"
                    placeholder="25"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gênero
                  </label>
                  <select
                    value={formData.genero || ''}
                    onChange={(e) => updateField('genero', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.peso || ''}
                    onChange={(e) => updateField('peso', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-gray-500"
                    placeholder="70"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    value={formData.altura || ''}
                    onChange={(e) => updateField('altura', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-gray-500"
                    placeholder="175"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Qual seu objetivo?</h2>
              
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
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-gray-700 hover:border-orange-500/50'
                    }`}
                  >
                    <span className="text-2xl mr-3">{option.emoji}</span>
                    <span className="font-medium text-white">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Experiência e Rotina</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
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
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-gray-700 hover:border-orange-500/50'
                      }`}
                    >
                      <div className="font-medium text-white">{option.label}</div>
                      <div className="text-sm text-gray-400">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Dias disponíveis por semana
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={formData.diasDisponiveis || ''}
                    onChange={(e) => updateField('diasDisponiveis', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-gray-500"
                    placeholder="4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tempo por treino (minutos)
                  </label>
                  <input
                    type="number"
                    value={formData.tempoTreino || ''}
                    onChange={(e) => updateField('tempoTreino', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-gray-500"
                    placeholder="60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Período preferido para treinar
                </label>
                <select
                  value={formData.periodoTreino || ''}
                  onChange={(e) => updateField('periodoTreino', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
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
              <h2 className="text-2xl font-bold text-white">Local e Equipamentos</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
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
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-gray-700 hover:border-orange-500/50'
                      }`}
                    >
                      <span className="text-2xl mr-3">{option.emoji}</span>
                      <span className="font-medium text-white">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Só mostra seleção de equipamentos se NÃO for academia */}
              {formData.localTreino && formData.localTreino !== 'academia' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Equipamentos disponíveis (selecione todos que tiver)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {EQUIPAMENTOS_OPTIONS.map((equip) => (
                      <button
                        key={equip}
                        onClick={() => toggleArrayItem('equipamentos', equip)}
                        className={`p-3 rounded-xl border-2 transition-all text-sm ${
                          formData.equipamentos?.includes(equip)
                            ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                            : 'border-gray-700 hover:border-orange-500/50 text-gray-300'
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
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                  <p className="text-sm text-orange-400">
                    ✅ <strong>Perfeito!</strong> Como você treina em academia, consideraremos que todos os equipamentos estão disponíveis.
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Limitações e Restrições</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Possui alguma lesão ou limitação física?
                </label>
                <textarea
                  value={formData.lesoes?.join(', ') || ''}
                  onChange={(e) => updateField('lesoes', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-gray-500"
                  rows={3}
                  placeholder="Ex: dor no joelho direito, tendinite no ombro (deixe em branco se não tiver)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Outras restrições ou observações
                </label>
                <textarea
                  value={formData.restricoes?.join(', ') || ''}
                  onChange={(e) => updateField('restricoes', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-gray-500"
                  rows={3}
                  placeholder="Ex: não gosto de correr, prefiro treinos curtos (opcional)"
                />
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Preferências Alimentares</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Preferências alimentares (opcional)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {PREFERENCIAS_ALIMENTARES.map((pref) => (
                    <button
                      key={pref}
                      onClick={() => toggleArrayItem('preferenciasAlimentares', pref)}
                      className={`p-3 rounded-xl border-2 transition-all text-sm ${
                        formData.preferenciasAlimentares?.includes(pref)
                          ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                          : 'border-gray-700 hover:border-orange-500/50 text-gray-300'
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Alimentos que você evita ou não gosta
                </label>
                <textarea
                  value={formData.alimentosEvitar?.join(', ') || ''}
                  onChange={(e) => updateField('alimentosEvitar', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-gray-500"
                  rows={3}
                  placeholder="Ex: brócolis, peixe, leite (opcional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Quantas refeições por dia você prefere?
                </label>
                <input
                  type="number"
                  min="3"
                  max="6"
                  value={formData.refeicoesPreferidas || 4}
                  onChange={(e) => updateField('refeicoesPreferidas', parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-gray-500"
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
              className="flex-1 px-6 py-4 border-2 border-gray-700 text-gray-300 rounded-xl font-medium hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Voltar
            </button>
          )}
          
          <button
            onClick={nextStep}
            disabled={!canProceed() || loading}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30"
          >
            {step === totalSteps ? (
              'Finalizar Quiz'
            ) : (
              <>
                Próximo
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal de Cadastro */}
      {showSignupModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-orange-500/20 rounded-3xl p-8 max-w-md w-full shadow-2xl shadow-orange-500/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Quase lá! 🎉</h2>
              <button
                onClick={() => setShowSignupModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-400 mb-6">
              Crie sua conta para salvar seu treino personalizado e acessar todas as funcionalidades.
            </p>

            {/* Social Signup */}
            <div className="space-y-3 mb-6">
              <Button
                onClick={() => handleSocialSignup('google')}
                disabled={loading}
                className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-6 rounded-xl transition-all"
              >
                <Mail className="w-5 h-5 mr-2" />
                Continuar com Google
              </Button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900 text-gray-400">ou cadastre-se com email</span>
              </div>
            </div>

            {/* Email Signup Form */}
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label htmlFor="modal-name" className="text-gray-300 mb-2 block">
                  Nome completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="modal-name"
                    type="text"
                    placeholder="Seu nome"
                    value={signupData.name}
                    onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                    required
                    className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl py-6"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="modal-email" className="text-gray-300 mb-2 block">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="modal-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={signupData.email}
                    onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                    required
                    className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl py-6"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="modal-password" className="text-gray-300 mb-2 block">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="modal-password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={signupData.password}
                    onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                    required
                    className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl py-6"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="modal-confirm-password" className="text-gray-300 mb-2 block">
                  Confirmar senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="modal-confirm-password"
                    type="password"
                    placeholder="Digite a senha novamente"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                    required
                    className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl py-6"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-6 rounded-xl transition-all shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  'Criar conta e gerar treino'
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
