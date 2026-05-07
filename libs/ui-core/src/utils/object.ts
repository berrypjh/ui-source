/** 값이 null이 아닌 객체인지 판별. 배열·Date·Map 등 모든 object 형도 포함. */
export const isObjectRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};
