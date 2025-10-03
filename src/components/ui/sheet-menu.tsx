import { MenuIcon } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MenuItem {
  to: string;
  label: string;
}

interface SheetMenuProps {
  items: MenuItem[];
  logo: string;
  logoText: string;
}

export function SheetMenu({ items, logo, logoText }: SheetMenuProps) {
  return (
    <Sheet>
      <SheetTrigger className='lg:hidden' asChild>
        <Button className='h-8' variant='outline' size='icon'>
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='w-64 sm:w-80'>
        <SheetHeader>
          <NavLink to='/' className='flex items-center gap-2'>
            <img
              src={logo}
              alt='Logo'
              className='h-8 w-8 rounded-md shadow-md'
            />
            <span className='text-indigo-500 text-xl font-bold tracking-wide'>
              {logoText}
            </span>
          </NavLink>
        </SheetHeader>
        <div className='flex flex-col gap-4 pl-2'>
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn('pb-2 transition-all border-b-2', {
                  'border-yellow-400 text-indigo-600 font-semibold': isActive,
                  'border-transparent text-gray-700 hover:border-yellow-300 hover:text-indigo-600':
                    !isActive,
                })
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
