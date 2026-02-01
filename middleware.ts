import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Verifique se existe session antes de acessar rotas protegidas
export function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get('refreshToken');

  if (!refreshToken && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}
