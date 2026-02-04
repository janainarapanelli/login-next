import { env } from '@/lib/env';
import { cookies } from 'next/headers';

// Login handler recebe credenciais e chama a API externa de autenticação
export async function POST(req: Request) {
  const body = await req.json();


  const response = await fetch(`https://dummyjson.com/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
     credentials: 'include' 
  });

  console.log('Response status:', response)

  if (!response.ok) {
    return new Response('Invalid credentials', { status: 401 });
  }

  const data = await response.json();

  // Se provedor nao retornar refreshToken, continuar mas logar (compatibilidade)
  if (!data.refreshToken) {
    console.log('[login] warning: refreshToken missing from auth provider, proceeding without cookie', data);
  } else {
    const cookieStore = await cookies();
    cookieStore.set('refreshToken', data.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      secure: process.env.NODE_ENV === 'production',
    });
    console.log('[login] refreshToken set (7 days)');
  }

  // Retorna o token de acesso para o frontend
  return new Response(JSON.stringify({ accessToken: data.accessToken }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
