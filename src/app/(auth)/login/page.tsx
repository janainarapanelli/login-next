import LoginForm from './LoginForm';
import { loginAction } from './actions';

export default function LoginPage() {
  return (
    <main>
      <h1>Login</h1>
      <LoginForm loginAction={loginAction} />
    </main>
  );
}
