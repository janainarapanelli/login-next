import { cookies } from 'next/headers';
import { env } from '@/lib/env';

// Refresh handler para obter um novo token de acesso usando o refresh token
export async function POST() {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get('refreshToken')?.value;
  console.log('[refresh] incoming refreshToken=', refreshToken ? 'FOUND' : 'MISSING');
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
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 dias
    secure: process.env.NODE_ENV === 'production',
  });

  console.log('[refresh] refreshToken updated (7 days)');

  return Response.json({ accessToken: data.accessToken });
}
