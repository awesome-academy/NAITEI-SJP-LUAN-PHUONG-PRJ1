import { isLoginAtom } from '@/features/auth';
import { useAtomValue } from 'jotai';
import { Navigate, Outlet } from 'react-router';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';

export function MainLayout() {
  const isLogin = useAtomValue(isLoginAtom);

  if (!isLogin) {
    return <Navigate to='/sign-in' />;
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-1 p-4 lg:p-8 container mx-auto'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
