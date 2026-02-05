/**
 * Serviço de autenticação - Camada de abstração para API externa
 * 
 * Centraliza todas as chamadas à API externa de autenticação,
 * permitindo fácil troca de provider no futuro
 */

const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || 'https://dummyjson.com/auth';

interface LoginCredentials {
    username: string;
    password: string;
}

interface AuthResponse {
    refreshToken: string;
    accessToken: string;
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    image: string;
}

interface RefreshTokenRequest {
    refreshToken: string;
}

/**
 * Autentica usuário com credenciais
 */
export async function authenticateUser(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${AUTH_API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Authentication failed: ${error}`);
    }

    return response.json();
}

/**
 * Renova tokens usando refresh token
 */
export async function refreshAuthToken(refreshToken: string): Promise<AuthResponse> {
    const response = await fetch(`${AUTH_API_URL}/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Token refresh failed: ${error}`);
    }

    return response.json();
}

/**
 * Obtém informações do usuário autenticado
 */
export async function getCurrentUser(token: string): Promise<AuthResponse> {
    const response = await fetch(`${AUTH_API_URL}/me`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to get user: ${error}`);
    }

    return response.json();
}
