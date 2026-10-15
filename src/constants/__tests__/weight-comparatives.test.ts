import { getVolumeComparison } from '@/constants/weight-comparatives';

describe('getVolumeComparison', () => {
  it('returns null below the lightest object', () => {
    expect(getVolumeComparison(0)).toBeNull();
    expect(getVolumeComparison(4.9)).toBeNull();
  });

  it('uses the heaviest object the volume covers at least once', () => {
    expect(getVolumeComparison(5)).toMatchObject({ count: 1, comparative: { key: 'comparative_watermelon' } });
    expect(getVolumeComparison(150)).toMatchObject({ count: 1.5, comparative: { key: 'comparative_panda' } });
    expect(getVolumeComparison(1000)).toMatchObject({ count: 1, comparative: { key: 'comparative_car' } });
  });

  it('rounds the multiple to one decimal', () => {
    expect(getVolumeComparison(8450)?.count).toBe(8.5);
    expect(getVolumeComparison(1234)?.count).toBe(1.2);
  });
});
