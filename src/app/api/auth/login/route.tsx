import { NextResponse } from 'next/server';
import { authenticateUser } from '@/services/authService';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Validações
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Usuário e senha são obrigatórios' },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_]{3,50}$/.test(username)) {
      return NextResponse.json(
        { error: 'Usuário inválido' },
        { status: 400 }
      );
    }

    if (password.length < 6 || password.length > 100) {
      return NextResponse.json(
        { error: 'Senha inválida' },
        { status: 400 }
      );
    }

    // Serviço interno
    const data = await authenticateUser({ username, password });

    const response = NextResponse.json({ success: true });

    if (data.refreshToken) {
      response.cookies.set('refreshToken', data.refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
        secure: process.env.NODE_ENV === 'production',
      });
    }

    return response;
  } catch (error) {
    console.error('[api/login]', error);

    return NextResponse.json(
      { error: 'Erro ao conectar com o servidor' },
      { status: 500 }
    );
  }
}
