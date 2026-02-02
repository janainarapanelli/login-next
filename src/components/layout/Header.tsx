'use client';
import { useAuth } from '@/features/auth/auth.hooks';
import { setAccessToken } from '@/services/httpClient';

export default function Header() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      // limpa token local e in-memory e redireciona
      localStorage.removeItem('token');
      setAccessToken('');
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
