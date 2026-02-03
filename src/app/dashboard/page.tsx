import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Header from '@/components/layout/Header'
import DashboardComponents from './components'

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;
  if (!refreshToken) {
    // redireciona do servidor quando nao ha refresh token
    redirect('/login');
  }

  return (
    <main>
      <Header />
      <h1>Dashboard</h1>
      <DashboardComponents />
    </main>
  )
}
