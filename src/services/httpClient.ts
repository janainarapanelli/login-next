/**
 * HTTP Client simplificado para autenticação 100% server-side
 * 
 * - Não armazena tokens em memória ou localStorage
 * - Envia cookies automaticamente via credentials: 'include'
 * - Redireciona para login se sessão expirada (401)
 */

export async function httpClient(
  input: RequestInfo,
  init?: RequestInit
) {
  const response = await fetch(input, {
    ...init,
    credentials: 'include', // Envia cookies automaticamente
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  // Se 401, sessão expirada - redirecionar para login
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      console.warn('[httpClient] Session expired, redirecting to login');
      window.location.href = '/login';
    }
    throw new Error('Session expired');
  }

  return response;
}
