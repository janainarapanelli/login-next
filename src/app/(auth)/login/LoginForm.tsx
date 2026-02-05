'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const username = formData.get('username');
    const password = formData.get('password');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Erro inesperado');
        formRef.current?.reset();
        return;
      }

      // sucesso → navegação client-side
      router.push('/dashboard');
    } catch (err) {
      console.error('[LoginForm]', err);
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          defaultValue="emilys"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          defaultValue="emilyspass"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Entrando…' : 'Login'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </>
  );
}
