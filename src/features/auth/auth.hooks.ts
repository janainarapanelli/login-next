import { login, logout } from './auth.service';

//hook personalizado para usar as funcoes de auth
export function useAuth() {
  return {
    login,
    logout,
  };
}
