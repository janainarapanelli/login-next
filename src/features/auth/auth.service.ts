import { LoginPayload, AuthResponse } from './auth.types';
import { setAccessToken } from '@/services/httpClient';


//realiza o login chamando a api de auth interna permite cookies HTTOnly
export async function login(payload: LoginPayload) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('Login failed');

// armazena o token de acesso em memória e refresh token nunca vai para o frontend
  const data: AuthResponse = await res.json();
  setAccessToken(data.accessToken);
  return data;
}


//realiza o logout chamando a api de auth interna que limpa o cookie
export async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' });
}
