import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Rotas protegidas que requerem autenticação (REMOVIDO /quiz)
  const protectedRoutes = ['/treino', '/dieta', '/calorias'];
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  // Verificar se tem token de sessão nos cookies do Supabase
  const supabaseAccessToken = req.cookies.get('sb-qmcpeuzjckvtobjgrnwf-auth-token');
  const hasSession = !!supabaseAccessToken;

  // Se está tentando acessar rota protegida sem estar logado
  if (isProtectedRoute && !hasSession) {
    const redirectUrl = new URL('/auth/login', req.url);
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Se está logado e tentando acessar páginas de auth, redireciona para quiz
  const authRoutes = ['/auth/login', '/auth/signup'];
  const isAuthRoute = authRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL('/quiz', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/quiz/:path*', '/treino/:path*', '/dieta/:path*', '/calorias/:path*', '/auth/:path*'],
};
