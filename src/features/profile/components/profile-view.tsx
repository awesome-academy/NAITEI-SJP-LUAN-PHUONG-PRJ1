import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Mail, Phone, User, Shield, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { User as U } from '../types/user';
import { StatusBadge } from './user-status-badge';

interface ProfileViewProps {
  profile: U;
  onEdit: () => void;
}

export function ProfileView({ profile, onEdit }: ProfileViewProps) {
  const { t } = useTranslation('profile');

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
          <Avatar className='h-20 w-20'>
            <AvatarImage
              src='https://ca.slack-edge.com/E028JVBUY4F-U06PMNCPVPT-9c2f971890ca-512'
              alt={profile.name}
            />
            <AvatarFallback className='text-lg'>{profile.name}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className='text-2xl font-bold text-foreground'>
              {profile.name}
            </h2>
            <div className='flex items-center gap-2 mt-1 text-sm flex-wrap'>
              <span className='text-muted-foreground'>{profile.email}</span>
              {profile.email_verified_at && (
                <CheckCircle className='w-4 h-4 text-green-500 dark:text-green-400' />
              )}
            </div>
            <div className='flex flex-wrap items-center gap-2 mt-2'>
              <StatusBadge status={profile.status} />
              <Badge variant='outline' className='flex items-center gap-1'>
                <Shield className='w-3 h-3' />
                {profile.role.name}
              </Badge>
            </div>
          </div>
        </div>

        <Button
          onClick={onEdit}
          className='flex items-center gap-2 self-start md:self-auto'
        >
          <Edit className='w-4 h-4' />
          {t('edit_profile')}
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
        <div className='space-y-4'>
          <div>
            <label className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
              <User className='w-4 h-4' />
              {t('fields.name')}
            </label>
            <div className='mt-1 p-3 sm:p-4 bg-muted rounded-md'>
              {profile.name}
            </div>
          </div>

          <div>
            <label className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
              <Mail className='w-4 h-4' />
              {t('fields.email')}
            </label>
            <div className='mt-1 p-3 sm:p-4 bg-muted rounded-md flex items-center justify-between gap-2'>
              <span className='truncate flex-1'>{profile.email}</span>
              {profile.email_verified_at ? (
                <Badge
                  variant='outline'
                  className='shrink-0 text-green-500 dark:text-green-400'
                >
                  {t('verified')}
                </Badge>
              ) : (
                <Badge
                  variant='outline'
                  className='shrink-0 text-yellow-500 dark:text-yellow-400'
                >
                  {t('unverified')}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className='space-y-4'>
          <div>
            <label className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
              <Phone className='w-4 h-4' />
              {t('fields.phone_number')}
            </label>
            <div className='mt-1 p-3 sm:p-4 bg-muted rounded-md'>
              {profile.phone_number}
            </div>
          </div>

          <div>
            <label className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
              <Shield className='w-4 h-4' />
              {t('fields.role')}
            </label>
            <div className='mt-1 p-3 sm:p-4 bg-muted rounded-md'>
              {profile.role.name}
            </div>
          </div>
        </div>
      </div>

      <div className='bg-accent p-3 sm:p-4 rounded-lg'>
        <h3 className='font-medium text-foreground mb-2'>
          {t('account_info')}
        </h3>
        <div className='text-sm text-muted-foreground space-y-1'>
          <p>
            {t('account_id')}: #{profile.id}
          </p>
          <p>
            {t('account_status')}: <StatusBadge status={profile.status} />
          </p>
          {profile.email_verified_at && (
            <p>
              {t('email_verified_at')}:{' '}
              {new Date(profile.email_verified_at).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
