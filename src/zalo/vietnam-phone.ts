/** Digits 0-9, optional leading +84 / 84 / 0, spaces allowed; normalize to 0xxxxxxxxx (10 digits). */
export function normalizeVietnamPhone(input: string): string {
  let s = input.replace(/[\s.\-()]/g, '').trim();
  if (s.startsWith('+84')) {
    s = '0' + s.slice(3);
  } else if (s.startsWith('84') && s.length >= 10) {
    s = '0' + s.slice(2);
  }
  return s;
}

/** 10-digit mobile starting with 03, 05, 07, 08, 09 (common VN). */
export function isValidVietnamPhoneForPublicTarget(s: string): boolean {
  const n = normalizeVietnamPhone(s);
  if (!/^0[35789]/.test(n) || n.length !== 10) {
    return false;
  }
  return /^0[0-9]{9}$/.test(n);
}
