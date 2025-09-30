import { User } from '@/types';

export const mockUser: User = {
  id: 10,
  name: 'Nguyen Van A',
  email: 'a@example.com',
  phone_number: '0909123456',
  email_verified_at: '2025-01-01T00:00:00Z',
  status: 'active',
  role: { id: 1, name: 'customer' },
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
};
