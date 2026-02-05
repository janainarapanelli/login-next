'use client';

export default function Header() {
  const handleLogout = async () => {
    try {
      // Chamar API de logout para remover cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error('[Header] logout error:', err);
    } finally {
      // Redirecionar para login
      window.location.href = '/login';
    }
  };

  return (
    <header>
      <h2>Header</h2>
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
}
