import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas que realmente precisam de login
const protectedRoutes = ['/treino', '/dieta', '/calorias'];

export function middleware(req: NextRequest) {

  const url = req.nextUrl.clone();

  // O Supabase usa esse cookie — MAS no middleware ele nem sempre está disponível
  const hasSession =
    req.cookies.get('sb-qmcpeuzjckvtobjgrnwf-auth-token') ||
    req.cookies.get('sb-qmcpeuzjckvtobjgrnwf-auth-token#expires');

  const isLoggedIn = !!hasSession;

  const pathname = req.nextUrl.pathname;

  // 1. Se a rota é protegida e não está logado → manda pro login
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !isLoggedIn) {
    url.pathname = '/auth/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // 2. Se rota é /auth/* e está logado → manda para /treino
  if (pathname.startsWith('/auth') && isLoggedIn) {
    url.pathname = '/treino';
    return NextResponse.redirect(url);
  }

  // 3. NÃO interferir na rota /quiz — o app decide sozinho quando mostrar
  return NextResponse.next();
}

export const config = {
  matcher: ['/treino/:path*', '/dieta/:path*', '/calorias/:path*', '/auth/:path*'],
};
