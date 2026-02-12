const encodeHex = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

const hashPassword = async (password: string, pepper: string): Promise<string> => {
  const data = new TextEncoder().encode(`${password}${pepper}`);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return encodeHex(hash);
};

export { encodeHex, hashPassword };
