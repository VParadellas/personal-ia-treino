import Navbar from '@/components/custom/navbar';
import { Utensils, Clock } from 'lucide-react';

export default function DietaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-gray-50">
      <Navbar />
      
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Utensils className="w-10 h-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Plano Alimentar
            </h1>
            
            <p className="text-gray-600 mb-6">
              Esta funcionalidade será implementada no Módulo 2
            </p>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                Em breve você terá acesso a:
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Cardápio completo personalizado</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Cálculo de macros (proteínas, carboidratos, gorduras)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Receitas detalhadas</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Lista de compras automática</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Opções de substituição de alimentos</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
