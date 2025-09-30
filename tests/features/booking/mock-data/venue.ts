import { Venue } from '@/types';
import { mockUser } from './user';
import { mockWard } from './ward';

export const mockVenue: Venue = {
  id: 1,
  owner_id: mockUser.id,
  name: 'G2B Coworking Space',
  avatar: '/images/venue.jpg',
  address: 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội',
  ward_id: mockWard.id,
  lat: '21.006',
  lng: '105.842',
  description: 'Không gian làm việc chuyên nghiệp.',
  status: 'active',
  ward: mockWard,
  spaces: [],
  owner: mockUser,
  managers: [mockUser],
};
