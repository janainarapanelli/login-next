import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware de autenticação 100% server-side
 * 
 * - Verifica presença de refreshToken cookie
 * - Valida expiração do JWT
 * - Protege rotas do dashboard
 * - Redireciona usuários não autenticados
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

    // Validar se token está expirado (decodificar JWT)
    try {
      // Decodificar JWT sem verificar assinatura (apenas ler payload)
      const base64Payload = refreshToken.split('.')[1];
      if (!base64Payload) {
        console.log('[middleware] Invalid token format, redirecting to login');
        return NextResponse.redirect(new URL('/login', req.url));
      }

      const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString());

      // Verificar expiração
      if (payload.exp && payload.exp < Date.now() / 1000) {
        console.log('[middleware] Token expired, redirecting to login');
        return NextResponse.redirect(new URL('/login', req.url));
      }
    } catch (err) {
      console.error('[middleware] Error decoding token:', err);
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

