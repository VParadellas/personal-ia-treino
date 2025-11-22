import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Criar cliente Supabase para middleware
  const supabase = createMiddlewareClient({ req, res });

  // Verificar sessão do usuário
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Rotas protegidas que requerem autenticação
  const protectedRoutes = ['/treino', '/dieta', '/calorias'];
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  // Se está tentando acessar rota protegida sem estar logado
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth/login', req.url);
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Se está logado e tentando acessar páginas de auth, redireciona para quiz
  const authRoutes = ['/auth/login', '/auth/signup'];
  const isAuthRoute = authRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/quiz', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/quiz/:path*', '/treino/:path*', '/dieta/:path*', '/calorias/:path*', '/auth/:path*'],
};
