'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { authenticateUser } from '@/services/authService';

/**
 * Server Action para autenticação de login
 * 
 * @param prevState - Estado anterior (para useActionState)
 * @param formData - Dados do formulário
 * @returns Objeto com erro ou void (redireciona em caso de sucesso)
 */
export async function loginAction(
    prevState: { error?: string } | void,
    formData: FormData
): Promise<{ error?: string } | void> {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    // Validação de input
    if (!username || !password) {
        return { error: 'Usuário e senha são obrigatórios' };
    }

    // Validar formato do username (alfanumérico e underscore, 3-50 caracteres)
    if (!/^[a-zA-Z0-9_]{3,50}$/.test(username)) {
        return { error: 'Usuário inválido' };
    }

    // Validar tamanho da senha (mínimo 6 caracteres)
    if (password.length < 6 || password.length > 100) {
        return { error: 'Senha inválida' };
    }

    try {
        // Chamar serviço de autenticação (camada interna)
        const data = await authenticateUser({ username, password });

        // Definir cookie HttpOnly com refresh token
        if (data.refreshToken) {
            const cookieStore = await cookies();
            cookieStore.set('refreshToken', data.refreshToken, {
                httpOnly: true,
                sameSite: 'strict',
                path: '/',
                maxAge: 7 * 24 * 60 * 60, // 7 dias
                secure: process.env.NODE_ENV === 'production',
            });
            console.log('[loginAction] refreshToken set (7 days)');
        } else {
            console.warn('[loginAction] warning: refreshToken missing from auth provider');
        }

    } catch (err) {
        console.error('[loginAction] error:', err);
        return { error: 'Erro ao conectar com o servidor' };
    }

    // Redirecionar para dashboard (server-side)
    redirect('/dashboard');
}

