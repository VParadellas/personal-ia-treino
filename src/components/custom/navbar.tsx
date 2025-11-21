'use client';

import Link from 'next/link';
import { Dumbbell, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl group-hover:scale-110 transition-transform">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Personal IA
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Início
            </Link>
            <Link 
              href="/quiz" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Quiz
            </Link>
            <Link 
              href="/treino" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Meu Treino
            </Link>
            <Link 
              href="/dieta" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Minha Dieta
            </Link>
            <Link 
              href="/calorias" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Análise Foto
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-gray-200">
            <Link 
              href="/" 
              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Início
            </Link>
            <Link 
              href="/quiz" 
              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Quiz
            </Link>
            <Link 
              href="/treino" 
              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Meu Treino
            </Link>
            <Link 
              href="/dieta" 
              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Minha Dieta
            </Link>
            <Link 
              href="/calorias" 
              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Análise Foto
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
