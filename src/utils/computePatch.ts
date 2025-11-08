// Deep diff helper: returns an object with only the keys that differ between
// `initial` and `current`. Handles nested objects and arrays. For arrays we
// compare by JSON.stringify (simple but reasonable for typical form payloads).
export default function computePatch<T extends Record<string, any>>(initial: T, current: T): Partial<T> {
  const isObject = (v: any) => v && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date);

  const result: Partial<T> = {};

  const keys = new Set<string>([...Object.keys(initial || {}), ...Object.keys(current || {})]);

  keys.forEach((k) => {
    const a = (initial as any)[k];
    const b = (current as any)[k];

    // equal for arrays: stringify
    if (Array.isArray(a) || Array.isArray(b)) {
      const sa = Array.isArray(a) ? JSON.stringify(a) : undefined;
      const sb = Array.isArray(b) ? JSON.stringify(b) : undefined;
      if (sa !== sb) (result as any)[k] = b;
      return;
    }

    // nested object: recurse
    if (isObject(a) && isObject(b)) {
      const nested = computePatch(a, b);
      if (Object.keys(nested).length > 0) (result as any)[k] = nested;
      return;
    }

    // Date comparison
    if (a instanceof Date || b instanceof Date) {
      const da = a instanceof Date ? a.toISOString() : String(a ?? '');
      const db = b instanceof Date ? b.toISOString() : String(b ?? '');
      if (da !== db) (result as any)[k] = b;
      return;
    }

    // primitives/undefined/null/strings/booleans/numbers
    // For booleans compare strictly. For others, compare string representations
    const equal = (typeof a === 'boolean' || typeof b === 'boolean') ? a === b : String(a ?? '') === String(b ?? '');
    if (!equal) (result as any)[k] = b;
  });

  return result;
}
