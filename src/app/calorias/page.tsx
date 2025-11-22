'use client';

import Navbar from '@/components/custom/navbar';
import { Camera, Upload, Loader2, Apple, Flame, Beef, Wheat, Droplet } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/components/providers/auth-provider';
import { useRouter } from 'next/navigation';

interface Alimento {
  nome: string;
  porcao: string;
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
}

interface AnalysisResult {
  alimentos: Alimento[];
  total: {
    calorias: number;
    proteinas: number;
    carboidratos: number;
    gorduras: number;
  };
  observacoes?: string;
}

export default function CaloriasPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { user, loading } = useAuth();
  const router = useRouter();

  // Verificar autenticação
  useEffect(() => {
    if (!loading && !user) {
      toast.error('Você precisa estar logado para acessar esta página');
      router.push('/auth/login?redirect=/calorias');
    }
  }, [user, loading, router]);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, não renderizar nada (será redirecionado)
  if (!user) {
    return null;
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida');
      return;
    }

    // Validar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem muito grande. Máximo 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: selectedImage }),
      });

      if (!response.ok) {
        throw new Error('Erro ao analisar imagem');
      }

      const data = await response.json();
      setResult(data);
      toast.success('Análise concluída!');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao analisar imagem. Tente novamente.');
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Navbar />
      
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full text-sm font-medium mb-6">
              <Camera className="w-4 h-4" />
              Análise por IA
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Análise de Calorias por Foto
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Tire uma foto do seu prato e descubra instantaneamente as calorias e macros
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Upload className="w-6 h-6 text-orange-400" />
                Enviar Foto
              </h2>

              {!selectedImage ? (
                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-orange-500/30 rounded-xl p-12 text-center hover:border-orange-500/50 transition-all hover:bg-gray-800/30">
                    <Camera className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                    <p className="text-white font-semibold mb-2">
                      Clique para selecionar uma foto
                    </p>
                    <p className="text-gray-400 text-sm">
                      PNG, JPG ou JPEG (máx. 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden">
                    <img
                      src={selectedImage}
                      alt="Foto selecionada"
                      className="w-full h-auto"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={analyzeImage}
                      disabled={analyzing}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {analyzing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Analisando...
                        </>
                      ) : (
                        <>
                          <Camera className="w-5 h-5" />
                          Analisar Foto
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={resetAnalysis}
                      disabled={analyzing}
                      className="px-6 py-3 bg-gray-700/50 text-gray-300 rounded-xl font-semibold hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Nova Foto
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Results Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Apple className="w-6 h-6 text-orange-400" />
                Resultados
              </h2>

              {!result ? (
                <div className="text-center py-12">
                  <div className="bg-gray-700/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-10 h-10 text-gray-500" />
                  </div>
                  <p className="text-gray-400">
                    Envie uma foto para ver os resultados
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Total Summary */}
                  <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl p-6 border border-orange-500/30">
                    <h3 className="text-lg font-semibold text-white mb-4">Total da Refeição</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Flame className="w-5 h-5 text-orange-400" />
                          <span className="text-gray-400 text-sm">Calorias</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{result.total.calorias}</p>
                        <p className="text-xs text-gray-500">kcal</p>
                      </div>
                      <div className="bg-black/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Beef className="w-5 h-5 text-red-400" />
                          <span className="text-gray-400 text-sm">Proteínas</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{result.total.proteinas}g</p>
                      </div>
                      <div className="bg-black/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Wheat className="w-5 h-5 text-yellow-400" />
                          <span className="text-gray-400 text-sm">Carboidratos</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{result.total.carboidratos}g</p>
                      </div>
                      <div className="bg-black/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Droplet className="w-5 h-5 text-blue-400" />
                          <span className="text-gray-400 text-sm">Gorduras</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{result.total.gorduras}g</p>
                      </div>
                    </div>
                  </div>

                  {/* Food Items */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Alimentos Identificados</h3>
                    <div className="space-y-3">
                      {result.alimentos.map((alimento, index) => (
                        <div key={index} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-white">{alimento.nome}</h4>
                              <p className="text-sm text-gray-400">{alimento.porcao}</p>
                            </div>
                            <span className="text-orange-400 font-bold">{alimento.calorias} kcal</span>
                          </div>
                          <div className="flex gap-4 text-xs text-gray-400">
                            <span>P: {alimento.proteinas}g</span>
                            <span>C: {alimento.carboidratos}g</span>
                            <span>G: {alimento.gorduras}g</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Observations */}
                  {result.observacoes && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <p className="text-sm text-gray-300">
                        <span className="font-semibold text-blue-400">Observação:</span> {result.observacoes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-orange-500/10">
              <div className="bg-orange-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Reconhecimento IA</h3>
              <p className="text-sm text-gray-400">
                Tecnologia avançada de visão computacional para identificar alimentos
              </p>
            </div>
            
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-orange-500/10">
              <div className="bg-orange-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Flame className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Cálculo Preciso</h3>
              <p className="text-sm text-gray-400">
                Estimativa inteligente de porções e valores nutricionais
              </p>
            </div>
            
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-orange-500/10">
              <div className="bg-orange-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Apple className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Detalhamento Completo</h3>
              <p className="text-sm text-gray-400">
                Macros detalhados: proteínas, carboidratos e gorduras
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
