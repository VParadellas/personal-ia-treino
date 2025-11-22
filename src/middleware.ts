import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Verificar se tem token de autenticação nos cookies
  const token = req.cookies.get('sb-access-token') || req.cookies.get('sb-localhost-auth-token');
  
  // Rotas protegidas que requerem autenticação
  const protectedRoutes = ['/treino', '/dieta', '/calorias'];
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  // Se está tentando acessar rota protegida sem token
  if (isProtectedRoute && !token) {
    const redirectUrl = new URL('/auth/login', req.url);
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Se tem token e está tentando acessar páginas de auth, redireciona para home
  const authRoutes = ['/auth/login', '/auth/signup'];
  const isAuthRoute = authRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - lasy-bridge.js (E2B specific)
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|lasy-bridge.js).*)',
  ],
};
