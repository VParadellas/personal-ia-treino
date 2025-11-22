'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Força a rota a ser dinâmica (não fazer pre-render)
export const dynamic = 'force-dynamic';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro no callback:', error);
          router.push('/auth/login');
          return;
        }

        if (session) {
          router.push('/quiz');
        } else {
          router.push('/auth/login');
        }
      } catch (err) {
        console.error('Erro ao processar callback:', err);
        router.push('/auth/login');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-400 text-lg">Autenticando...</p>
      </div>
    </div>
  );
}
