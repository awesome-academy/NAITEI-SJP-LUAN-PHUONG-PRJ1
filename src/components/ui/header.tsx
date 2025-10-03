import { NavLink } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { UserMenu } from '@/components/ui/user-menu';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/features/theme';
import { LangSelector } from '@/features/locale';
import { useTranslation } from 'react-i18next';
import { isLoginAtom } from '@/features/auth';
import { useGetProfile } from '@/features/auth';
import { useAtomValue } from 'jotai';
import { Notification } from '@/features/notification';
import { SheetMenu } from '@/components/ui/sheet-menu';
import { cn } from '@/lib/utils';

export function Header() {
  const isLoggedIn = useAtomValue(isLoginAtom);
  const { data: user } = useGetProfile();
  const { t } = useTranslation('common');

  const menuItems = [
    { to: '/', label: t('menu.home') },
    { to: '/venue', label: t('menu.venue') },
    { to: '/about', label: t('menu.about') },
    { to: '/contact', label: t('menu.contact') },
  ];

  return (
    <header className='lg:sticky top-0 z-50 w-full shadow-md px-8 py-4 flex items-center justify-between bg-background'>
      <div className='flex items-center gap-8'>
        <NavLink to='/' className='flex items-center gap-2 hidden lg:flex'>
          <img
            src='/logo.png'
            alt='Logo'
            className='h-10 w-10 rounded-md shadow-md'
          />
          <span className='text-indigo-600 text-xl font-bold tracking-wide'>
            {t('logo')}
          </span>
        </NavLink>

        <div className='lg:hidden'>
          <SheetMenu items={menuItems} logo='/logo.png' logoText={t('logo')} />
        </div>

        <NavigationMenu className='hidden lg:block'>
          <NavigationMenuList className='flex gap-6'>
            {menuItems.map((item) => (
              <NavigationMenuItem key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn('pb-2 transition-all border-b-2', {
                      'border-yellow-400 text-indigo-600 font-semibold':
                        isActive,
                      'border-transparent text-gray-700 hover:border-yellow-300 hover:text-indigo-600':
                        !isActive,
                    })
                  }
                >
                  {item.label}
                </NavLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className='flex items-center gap-4'>
        <Notification />
        <LangSelector />
        <ThemeToggle />

        {isLoggedIn ? (
          <UserMenu user={user} />
        ) : (
          <div className='flex gap-2'>
            <Button variant='outline'>{t('auth.register')}</Button>
            <Button className='bg-indigo-600 hover:bg-indigo-700 text-white'>
              {t('auth.login')}
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
