import { isObjectRecord } from './object';

describe('isObjectRecord', () => {
  it('plain object·배열·Date·Map에 대해 true를 반환한다', () => {
    expect(isObjectRecord({ a: 1 })).toBe(true);
    expect(isObjectRecord([1, 2, 3])).toBe(true);
    expect(isObjectRecord(new Date())).toBe(true);
    expect(isObjectRecord(new Map())).toBe(true);
  });

  it('null·string·number·undefined·boolean에 대해 false를 반환한다', () => {
    expect(isObjectRecord(null)).toBe(false);
    expect(isObjectRecord('string')).toBe(false);
    expect(isObjectRecord(42)).toBe(false);
    expect(isObjectRecord(undefined)).toBe(false);
    expect(isObjectRecord(true)).toBe(false);
  });
});
