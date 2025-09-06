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

/** Strict validation */
export function isValidIban(iban: string): boolean {
  if (typeof iban !== "string" || iban.length === 0) return false;
  if (!ASCII_ALNUM.test(iban)) return false;           // no spaces or hidden Unicode
  if (iban !== iban.toUpperCase()) return false;       // must already be uppercase
  if (!BASIC_SHAPE.test(iban)) return false;           // CC + 2 digits + rest

  const country = iban.slice(0, 2) as keyof typeof IBAN_LENGTHS;
  const expectedLen = IBAN_LENGTHS[country];
  if (!expectedLen || iban.length !== expectedLen) return false;

  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let remainder = 0, buffer = "";

  for (let i = 0; i < rearranged.length; i++) {
    const code = rearranged.charCodeAt(i);
    if (code >= 48 && code <= 57) buffer += rearranged[i]; // digit
    else buffer += String(code - 55);                      // A..Z -> 10..35

    if (buffer.length > 9) { remainder = mod97WithCarry(remainder, buffer); buffer = ""; }
  }
  if (buffer) remainder = mod97WithCarry(remainder, buffer);
  return remainder === 1;
}

function mod97WithCarry(carry: number, chunk: string): number {
  const s = String(carry) + chunk;
  let r = 0;
  for (let i = 0; i < s.length; i++) r = (r * 10 + (s.charCodeAt(i) - 48)) % 97;
  return r;
}

/* ----------------------- New utilities ----------------------- */

/** Normalize user input to canonical A–Z0–9 (uppercase, no spaces, tolerant of Unicode digits). */
export function normalizeIban(input: string): string {
  if (typeof input !== "string") return "";
  const s = input.normalize("NFKD");
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i);

    // ASCII digits
    if (code >= 48 && code <= 57) { out += s[i]; continue; }
    // Arabic-Indic digits U+0660–0669
    if (code >= 0x0660 && code <= 0x0669) { out += String(code - 0x0660); continue; }
    // Eastern Arabic-Indic digits U+06F0–06F9
    if (code >= 0x06F0 && code <= 0x06F9) { out += String(code - 0x06F0); continue; }
    // ASCII letters → uppercase
    if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
      out += s[i].toUpperCase(); continue;
    }
    // else: skip whitespace, hyphens, underscores, and other separators
  }
  return out.replace(/[^A-Z0-9]/g, "");
}

/** Validate *after* normalization (tolerant UX-friendly validator). */
export function isValidIbanTolerant(iban: string): boolean {
  return isValidIban(normalizeIban(iban));
}

/** Pretty print canonical IBAN in groups (default 4). Validates by default. */
export function formatIban(
  iban: string,
  options: { groupSize?: number; validate?: boolean } = {}
): string {
  const { groupSize = 4, validate = true } = options;
  const canonical = normalizeIban(iban);
  if (validate && !isValidIban(canonical)) throw new Error("Invalid IBAN: cannot format");
  return canonical.replace(new RegExp(`(.{1,${groupSize}})`, "g"), "$1 ").trim();
}

/** Return the 2-letter country code if shape/length match after normalization; otherwise null. */
export function getIbanCountry(iban: string): string | null {
  const canonical = normalizeIban(iban);
  if (canonical.length < 4) return null;
  const cc = canonical.slice(0, 2);
  const expected = IBAN_LENGTHS[cc as keyof typeof IBAN_LENGTHS];
  if (!expected || canonical.length !== expected) return null;
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(canonical)) return null;
  return cc;
}
