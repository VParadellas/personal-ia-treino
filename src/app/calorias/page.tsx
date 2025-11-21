import Navbar from '@/components/custom/navbar';
import { Camera, Clock } from 'lucide-react';

export default function CaloriasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50">
      <Navbar />
      
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12">
            <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Camera className="w-10 h-10 text-purple-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Análise de Calorias por Foto
            </h1>
            
            <p className="text-gray-600 mb-6">
              Esta funcionalidade será implementada no Módulo 2
            </p>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                Em breve você terá acesso a:
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex gap-2">
                  <span className="text-purple-600">✓</span>
                  <span>Reconhecimento automático de alimentos por foto</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-600">✓</span>
                  <span>Estimativa inteligente de porções</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-600">✓</span>
                  <span>Cálculo instantâneo de calorias totais</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-600">✓</span>
                  <span>Detalhamento de macros (proteínas, carboidratos, gorduras)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-600">✓</span>
                  <span>Edição manual de valores</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-600">✓</span>
                  <span>Histórico diário de refeições</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
