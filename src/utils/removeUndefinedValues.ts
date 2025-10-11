type RemoveUndefined<T> = {
  [K in keyof T as T[K] extends undefined ? never : K]: T[K];
};

export function removeUndefinedFields<T extends Record<string, unknown>>(
  obj: T
): RemoveUndefined<T> {
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result as RemoveUndefined<T>;
}
