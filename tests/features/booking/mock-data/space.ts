import { Space } from '@/types';
import { mockPriceType } from './price-type';
import { mockSpaceType } from './space-type';
import { mockVenue } from './venue';

export const mockSpace: Space = {
  id: 5,
  venue: mockVenue,
  name: 'Phòng họp G2B-01',
  space_type_id: 2,
  capacity: 10,
  price_type_id: 1,
  price: '500000',
  description: 'Phòng họp sang trọng',
  status: 'available',
  images: ['/images/space.jpg'],
  space_type: mockSpaceType,
  price_type: mockPriceType,
  amenities: [],
  type: { id: 2, name: 'meeting' },
};
