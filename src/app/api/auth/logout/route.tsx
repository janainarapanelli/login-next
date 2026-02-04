import { cookies } from 'next/headers';

// Logout handler que remove o refresh token do cookie
export async function POST() {
  const cookieStore = await cookies();
  // garantir que o cookie com path '/' seja removido
  // assinatura aceita: delete({ name: string, ...options })
  cookieStore.delete({ name: 'refreshToken', path: '/' });

  console.log('[logout] refreshToken deleted');

  return new Response(null, { status: 204 });
}
