'use client';

import Link from 'next/link';
import { Dumbbell, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { auth } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await auth.signOut();
    if (error) {
      toast.error('Erro ao sair');
    } else {
      toast.success('Logout realizado com sucesso');
      router.push('/');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-orange-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/50">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Personal IA
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className="text-gray-300 hover:text-orange-400 transition-colors font-medium"
            >
              Início
            </Link>
            {user && (
              <>
                <Link 
                  href="/quiz" 
                  className="text-gray-300 hover:text-orange-400 transition-colors font-medium"
                >
                  Quiz
                </Link>
                <Link 
                  href="/treino" 
                  className="text-gray-300 hover:text-orange-400 transition-colors font-medium"
                >
                  Meu Treino
                </Link>
                <Link 
                  href="/dieta" 
                  className="text-gray-300 hover:text-orange-400 transition-colors font-medium"
                >
                  Minha Dieta
                </Link>
                <Link 
                  href="/calorias" 
                  className="text-gray-300 hover:text-orange-400 transition-colors font-medium"
                >
                  Análise Foto
                </Link>
              </>
            )}
            
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg border border-orange-500/20">
                      <UserIcon className="w-4 h-4 text-orange-400" />
                      <span className="text-sm text-gray-300">{user.email?.split('@')[0]}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-orange-400 rounded-lg transition-all border border-orange-500/20 hover:border-orange-500/40"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link
                      href="/auth/login"
                      className="px-4 py-2 text-gray-300 hover:text-orange-400 transition-colors font-medium"
                    >
                      Entrar
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-orange-500/30"
                    >
                      Cadastrar
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-300" />
            ) : (
              <Menu className="w-6 h-6 text-gray-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-orange-500/20">
            <Link 
              href="/" 
              className="block px-4 py-2 text-gray-300 hover:bg-gray-800/50 hover:text-orange-400 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Início
            </Link>
            {user && (
              <>
                <Link 
                  href="/quiz" 
                  className="block px-4 py-2 text-gray-300 hover:bg-gray-800/50 hover:text-orange-400 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Quiz
                </Link>
                <Link 
                  href="/treino" 
                  className="block px-4 py-2 text-gray-300 hover:bg-gray-800/50 hover:text-orange-400 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Meu Treino
                </Link>
                <Link 
                  href="/dieta" 
                  className="block px-4 py-2 text-gray-300 hover:bg-gray-800/50 hover:text-orange-400 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Minha Dieta
                </Link>
                <Link 
                  href="/calorias" 
                  className="block px-4 py-2 text-gray-300 hover:bg-gray-800/50 hover:text-orange-400 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Análise Foto
                </Link>
              </>
            )}
            
            {!loading && (
              <>
                {user ? (
                  <div className="px-4 py-2 space-y-2">
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-lg border border-orange-500/20">
                      <UserIcon className="w-4 h-4 text-orange-400" />
                      <span className="text-sm text-gray-300">{user.email}</span>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-orange-400 rounded-lg transition-all border border-orange-500/20"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </div>
                ) : (
                  <div className="px-4 space-y-2">
                    <Link
                      href="/auth/login"
                      className="block px-4 py-2 text-center text-gray-300 hover:bg-gray-800/50 hover:text-orange-400 rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Entrar
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="block px-4 py-2 text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium transition-all"
                      onClick={() => setIsOpen(false)}
                    >
                      Cadastrar
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
