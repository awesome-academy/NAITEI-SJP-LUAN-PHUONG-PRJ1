import { Ward } from '@/types';
import { mockProvince } from './province';

export const mockWard: Ward = {
  id: 101,
  code: 'W01',
  province_id: 1,
  name: 'Phường Bách Khoa',
  name_en: 'Bach Khoa Ward',
  full_name: 'Phường Bách Khoa, Hai Bà Trưng, Hà Nội',
  full_name_en: 'Bach Khoa Ward, Hai Ba Trung, Ha Noi',
  province: mockProvince,
};
