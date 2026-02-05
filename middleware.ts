import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware de autenticação 100% server-side
 * 
 * - Verifica presença de refreshToken cookie
 * - Protege rotas do dashboard
 * - Redireciona usuários não autenticados
 * - TODO: Adicionar validação de expiração JWT
 */
export function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get('refreshToken')?.value;
  const path = req.nextUrl.pathname;

  console.log('[middleware]', {
    path,
    hasToken: !!refreshToken,
    timestamp: new Date().toISOString(),
  });

  // Se usuário acessa /login e já tem refresh token, redireciona para dashboard
  if (path.startsWith('/login')) {
    if (refreshToken) {
      console.log('[middleware] User already authenticated, redirecting to dashboard');
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return NextResponse.next();
  }

  // Protege rotas do dashboard
  if (path.startsWith('/dashboard')) {
    if (!refreshToken) {
      console.log('[middleware] No token found, redirecting to login');
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // TODO: Validar se token está expirado (decodificar JWT)
    // Se expirado, redirecionar para login

    return NextResponse.next();
  }

  return NextResponse.next();
}

