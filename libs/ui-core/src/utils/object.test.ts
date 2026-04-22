import { isObjectRecord, isPlainObject } from './object';

describe('isObjectRecord', () => {
  it('plain object에 대해 true를 반환한다', () => {
    expect(isObjectRecord({ a: 1 })).toBe(true);
  });

  it('배열에 대해 true를 반환한다', () => {
    expect(isObjectRecord([1, 2, 3])).toBe(true);
  });

  it('Date에 대해 true를 반환한다', () => {
    expect(isObjectRecord(new Date())).toBe(true);
  });

  it('Map에 대해 true를 반환한다', () => {
    expect(isObjectRecord(new Map())).toBe(true);
  });

  it('null에 대해 false를 반환한다', () => {
    expect(isObjectRecord(null)).toBe(false);
  });

  it('string에 대해 false를 반환한다', () => {
    expect(isObjectRecord('string')).toBe(false);
  });

  it('number에 대해 false를 반환한다', () => {
    expect(isObjectRecord(42)).toBe(false);
  });

  it('undefined에 대해 false를 반환한다', () => {
    expect(isObjectRecord(undefined)).toBe(false);
  });

  it('boolean에 대해 false를 반환한다', () => {
    expect(isObjectRecord(true)).toBe(false);
  });
});

describe('isPlainObject', () => {
  it('object literal에 대해 true를 반환한다', () => {
    expect(isPlainObject({ a: 1 })).toBe(true);
  });

  it('빈 객체에 대해 true를 반환한다', () => {
    expect(isPlainObject({})).toBe(true);
  });

  it('null prototype 객체에 대해 true를 반환한다', () => {
    expect(isPlainObject(Object.create(null))).toBe(true);
  });

  it('배열에 대해 false를 반환한다', () => {
    expect(isPlainObject([1, 2, 3])).toBe(false);
  });

  it('null에 대해 false를 반환한다', () => {
    expect(isPlainObject(null)).toBe(false);
  });

  it('class 인스턴스에 대해 false를 반환한다', () => {
    class Foo {}
    expect(isPlainObject(new Foo())).toBe(false);
  });

  it('Date에 대해 false를 반환한다', () => {
    expect(isPlainObject(new Date())).toBe(false);
  });

  it('string에 대해 false를 반환한다', () => {
    expect(isPlainObject('string')).toBe(false);
  });

  it('number에 대해 false를 반환한다', () => {
    expect(isPlainObject(42)).toBe(false);
  });
});
