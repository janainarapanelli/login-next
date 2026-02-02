import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Verifique se existe session antes de acessar rotas protegidas
export function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get('refreshToken')?.value;

  // debug: log para ajudar a identificar porque o cookie nao chega
  console.log('[middleware] path=', req.nextUrl.pathname, 'refreshToken=', refreshToken ? 'FOUND' : 'MISSING');

  // Se usuário acessa /login e já tem refresh token, redireciona para dashboard
  if (req.nextUrl.pathname.startsWith('/login')) {
    if (refreshToken) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return NextResponse.next();
  }

  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    // token presente – prossegue com a requisição
    return NextResponse.next();
  }

  return NextResponse.next();
}
