/**
 * Returns the current version of the application.
 * Examples:
 *   version() -> "version 1.0.0"
 */
export function version(): string {
    return "version 1.0.0";
}

/**
 * Strict IBAN validator (ISO 13616).
 * - Only accepts uppercase A–Z and digits 0–9 (ASCII).
 * - No spaces, separators, or hidden Unicode allowed.
 * - Enforces exact length per country.
 * - Validates check digits via mod-97 == 1.
 */
const IBAN_LENGTHS: Record<string, number> = {
  // Source: ISO 13616
  AD: 24, AE: 23, AL: 28, AT: 20, AZ: 28,
  BA: 20, BE: 16, BG: 22, BH: 22, BR: 29, BY: 28,
  CH: 21, CR: 22, CY: 28, CZ: 24,
  DE: 22, DK: 18, DO: 28,
  EE: 20, EG: 29, ES: 24,
  FI: 18, FO: 18, FR: 27,
  GB: 22, GE: 22, GI: 23, GL: 18, GR: 27, GT: 28,
  HR: 21, HU: 28,
  IE: 22, IL: 23, IQ: 23, IS: 26, IT: 27,
  JO: 30,
  KW: 30, KZ: 20,
  LB: 28, LC: 32, LI: 21, LT: 20, LU: 20,
  MC: 27, MD: 24, ME: 22, MK: 19, MR: 27, MT: 31, MU: 30,
  NL: 18, NO: 15,
  PK: 24, PL: 28, PS: 29, PT: 25,
  QA: 29,
  RO: 24, RS: 22,
  SA: 24, SC: 31, SE: 24, SI: 19, SK: 24, SM: 27, ST: 25, SV: 28,
  TL: 23, TN: 24, TR: 26,
  UA: 29,
  VG: 24, XK: 20,
};

const ASCII_ALNUM = /^[A-Z0-9]+$/;
const BASIC_SHAPE = /^[A-Z]{2}\d{2}[A-Z0-9]+$/;

/**
 * Validate an IBAN with strict rules.
 * Returns true only if fully valid; otherwise false.
 */
export function isValidIban(iban: string): boolean {
  if (typeof iban !== "string" || iban.length === 0) return false;


  if (!ASCII_ALNUM.test(iban)) return false;

  if (iban !== iban.toUpperCase()) return false;

  if (!BASIC_SHAPE.test(iban)) return false;

  const country = iban.slice(0, 2) as keyof typeof IBAN_LENGTHS;
  const expectedLen = IBAN_LENGTHS[country];
  if (!expectedLen || iban.length !== expectedLen) return false;

  const rearranged = iban.slice(4) + iban.slice(0, 4);

  let remainder = 0;
  let buffer = "";

  for (let i = 0; i < rearranged.length; i++) {
    const ch = rearranged[i];
    const code = ch.charCodeAt(0);
    if (code >= 48 && code <= 57) {
      buffer += ch;
    } else {
      const val = code - 55;
      buffer += String(val);
    }

    // Consume buffer in chunks to keep numbers manageable.
    if (buffer.length > 9) {
      remainder = mod97WithCarry(remainder, buffer);
      buffer = "";
    }
  }
  if (buffer.length > 0) {
    remainder = mod97WithCarry(remainder, buffer);
  }

  return remainder === 1;
}


function mod97WithCarry(carry: number, chunk: string): number {
  const s = String(carry) + chunk;
  let r = 0;
  for (let i = 0; i < s.length; i++) {
    r = (r * 10 + (s.charCodeAt(i) - 48)) % 97;
  }
  return r;
}
