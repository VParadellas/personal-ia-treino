'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dumbbell, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await auth.signIn(email, password);
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Login realizado com sucesso!');
        
        // Redirecionar para a página que o usuário estava tentando acessar
        const redirectTo = searchParams.get('redirect') || '/';
        router.push(redirectTo);
      }
    } catch (error) {
      toast.error('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-2xl group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/50">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Personal IA
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-orange-500/20 rounded-3xl p-8 shadow-2xl shadow-orange-500/10">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            Bem-vindo de volta
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Entre para continuar seu treino
          </p>

          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-300 mb-2 block">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl py-6"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-300 mb-2 block">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <Link
              href="/auth/reset-password"
              className="text-sm text-orange-400 hover:text-orange-300 transition-colors block"
            >
              Esqueceu sua senha?
            </Link>
            <p className="text-sm text-gray-400">
              Não tem uma conta?{' '}
              <Link href="/auth/signup" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
