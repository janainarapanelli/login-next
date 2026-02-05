import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import LoginForm from './LoginForm';

// Server Action para login
async function loginAction(prevState: { error?: string } | void, formData: FormData) {
  'use server';

  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  // Validação de input
  if (!username || !password) {
    return { error: 'Usuário e senha são obrigatórios' };
  }

  // Validar formato do username (alfanumérico e underscore, 3-50 caracteres)
  if (!/^[a-zA-Z0-9_]{3,50}$/.test(username)) {
    return { error: 'Usuário inválido' };
  }

  // Validar tamanho da senha (mínimo 6 caracteres)
  if (password.length < 6 || password.length > 100) {
    return { error: 'Senha inválida' };
  }

  try {
    // Chamar API externa de autenticação
    const response = await fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      return { error: 'Usuário ou senha inválidos' };
    }

    const data = await response.json();

    // Definir cookie HttpOnly com refresh token
    if (data.refreshToken) {
      const cookieStore = await cookies();
      cookieStore.set('refreshToken', data.refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 dias
        secure: process.env.NODE_ENV === 'production',
      });
      console.log('[loginAction] refreshToken set (7 days)');
    } else {
      console.warn('[loginAction] warning: refreshToken missing from auth provider');
    }

  } catch (err) {
    console.error('[loginAction] error:', err);
    return { error: 'Erro ao conectar com o servidor' };
  }

  // Redirecionar para dashboard (server-side)
  redirect('/dashboard');
}

export default function LoginPage() {
  return (
    <main>
      <h1>Login</h1>
      <LoginForm loginAction={loginAction} />
    </main>
  );
}
