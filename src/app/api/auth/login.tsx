import { env } from '@/lib/env';

// Login handler recebe credenciais e chama a API externa de autenticação
export async function POST(req: Request) {
  const body = await req.json();

  const response = await fetch(`${env.AUTH_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Tenant': env.KEY_INHIRE,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    return new Response('Invalid credentials', { status: 401 });
  }

  const data = await response.json();

  const headers = new Headers();

// Refresh token protegido contra ataques XSS nao pode ser acessado via JavaScript
  headers.append(
    'Set-Cookie',
    `refreshToken=${data.refreshToken}; HttpOnly; Path=/; SameSite=Strict`
  );

  // Retorna o token de acesso para o frontend
  return new Response(JSON.stringify({ accessToken: data.accessToken }), {
    headers,
  });
}
