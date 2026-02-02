import { cookies } from 'next/headers';

// Logout handler que remove o refresh token do cookie
export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('refreshToken');

  return new Response(null, { status: 204 });
}
