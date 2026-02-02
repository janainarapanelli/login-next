'use client';
import { useState } from "react";

interface LoginResponse {
  accessToken: string;
  userId?: number;
}

export default function LoginPage() {
const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Usuário ou senha inválidos");
      }

      const data: LoginResponse = await response.json();
      console.log("Login bem-sucedido!", data);

      localStorage.setItem("token", data.accessToken);
      // redireciona imediatamente para o dashboard após login
      window.location.href = '/dashboard';
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro desconhecido");
      }
    }
  };

  return (
    <main>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </main>
  );
}
