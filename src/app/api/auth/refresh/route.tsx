import { cookies } from 'next/headers';
import { env } from '@/lib/env';

// Refresh handler para obter um novo token de acesso usando o refresh token
export async function POST() {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get('refreshToken')?.value;
  if (!refreshToken) {
    return new Response('Unauthorized', { status: 401 });
  }

  const response = await fetch(`https://dummyjson.com/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Tenant': env.KEY_INHIRE,
    },
    body: JSON.stringify({ refreshToken }),
    credentials: 'include' 
  });

  if (!response.ok) {
    return new Response('Forbidden', { status: 403 });
  }

  const data = await response.json();

  cookieStore.set('refreshToken', data.refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
  });

  return Response.json({ accessToken: data.accessToken });
}
