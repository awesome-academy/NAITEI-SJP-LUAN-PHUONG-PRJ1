import { NavLink } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/features/theme/components/theme-toggle';
import { LangSelector } from '@/features/locale/components/lang-selector';
import { useTranslation } from 'react-i18next';
import { isLoginAtom } from '@/features/auth';
import { useAtomValue } from 'jotai';

export function Header() {
  const isLoggedIn = useAtomValue(isLoginAtom);
  const { t } = useTranslation('common');

  const menuItems = [
    { to: '/', label: t('menu.home') },
    { to: '/venue', label: t('menu.venue') },
    { to: '/about', label: t('menu.about') },
    { to: '/contact', label: t('menu.contact') },
  ];

  return (
    <header className='sticky top-0 z-50 w-full shadow-md px-8 py-4 flex items-center justify-between'>
      <div className='flex items-center gap-8'>
        <NavLink to='/' className='flex items-center gap-2'>
          <img
            src='/logo.png'
            alt='Logo'
            className='h-10 w-10 rounded-md shadow-md'
          />
          <span className='text-indigo-600 text-xl font-bold tracking-wide'>
            {t('logo')}
          </span>
        </NavLink>

        <NavigationMenu>
          <NavigationMenuList className='flex gap-6'>
            {menuItems.map((item) => (
              <NavigationMenuItem key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `pb-2 transition-all border-b-2 ${
                      isActive
                        ? 'border-yellow-400 text-indigo-600 font-semibold'
                        : 'border-transparent text-gray-700 hover:border-yellow-300 hover:text-indigo-600'
                    }`
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
        <ThemeToggle />
        <LangSelector />

        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className='cursor-pointer ring-2 ring-indigo-200'>
                <AvatarImage
                  src='https://ca.slack-edge.com/E028JVBUY4F-U06PMNCPVPT-9c2f971890ca-512'
                  alt='User'
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem>
                <NavLink to='/profile'>{t('auth.profile')}</NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <NavLink to='/bookings'>{t('header.booking-history')}</NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>
                {t('auth.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
