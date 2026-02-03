// guarda variavel de token de acesso em memória

let accessToken: string | null = null;

export const setAccessToken = (token: string) => {
  accessToken = token;
};

//atualiza o token depois do login ou refresh
export async function httpClient(
  input: RequestInfo,
  init?: RequestInit
) {
  const headers = {
    ...(init?.headers || {}),
    Authorization: accessToken ? `Bearer ${accessToken}` : '',
  };

  const response = await fetch(input, {
    ...init,
    headers,
  });

  //acesso token expirado faz o refresh token automatico
  if (response.status === 401) {
    const refreshResponse = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (!refreshResponse.ok) {
      // refresh falhou -> limpar estado de auth e redirecionar para login
      setAccessToken('');
      try { localStorage.removeItem('token'); } catch {}
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Session expired');
    }

    const { accessToken: newToken } = await refreshResponse.json();
    setAccessToken(newToken);

    return fetch(input, {
      ...init,
      headers: {
        ...headers,
        Authorization: `Bearer ${newToken}`,
      },
    });
  }

  return response;
}
