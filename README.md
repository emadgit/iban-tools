# iban-tools

![iban-tools Banner](https://github.com/emadgit/iban-tools/blob/main/pics/iban-tools.png)

A tiny TypeScript library for working with IBANs.

[![npm version](https://img.shields.io/npm/v/@emaddehnavi/iban-tools.svg)](https://www.npmjs.com/package/@emaddehnavi/iban-tools)
[![npm downloads](https://img.shields.io/npm/dm/@emaddehnavi/iban-tools.svg)](https://www.npmjs.com/package/@emaddehnavi/iban-tools)

## Features

- **Strict IBAN validation** following ISO 13616
  - Enforces correct length per country
  - Only accepts uppercase A–Z and digits 0–9 (no spaces, no hidden Unicode)
  - Validates check digits (mod-97 == 1)
- **Tolerant workflow helpers**
  - `normalizeIban` to canonicalize user input (strip spaces, normalize digits, uppercase)
  - `isValidIbanTolerant` to validate *after* normalization
  - `formatIban` to pretty-print in groups (default 4)
  - `getIbanCountry` to read the ISO country code safely
- Lightweight, zero dependencies

## Installation

```bash
npm install @emaddehnavi/iban-tools
```

## Usage

### 1) Strict IBAN validation (no spaces, uppercase only)
```ts
import { isValidIban } from "@emaddehnavi/iban-tools";

// Valid German IBAN
console.log(isValidIban("DE89370400440532013000")); // true

// Invalid (contains spaces)
console.log(isValidIban("DE89 3704 0044 0532 0130 00")); // false

// Invalid (lowercase)
console.log(isValidIban("de89370400440532013000")); // false

// Invalid (wrong check digits)
console.log(isValidIban("DE00370400440532013000")); // false
```

### 2) Tolerant validation (normalize first)
```ts
import { isValidIbanTolerant } from "@emaddehnavi/iban-tools";

// Accepts spaces, hyphens, and non-ASCII digits; validates the canonical IBAN
console.log(isValidIbanTolerant("de89 3704-0044\u00A0 0532 0130 00")); // true
```

### 3) Normalize user input
```ts
import { normalizeIban } from "@emaddehnavi/iban-tools";

console.log(normalizeIban("de89 3704-0044\u00A0 0532 0130 00"));
// -> "DE89370400440532013000"
```

### 4) Pretty-print an IBAN (validates by default)
```ts
import { formatIban } from "@emaddehnavi/iban-tools";

console.log(formatIban("DE89370400440532013000"));
// -> "DE89 3704 0044 0532 0130 00"

console.log(formatIban("DE89370400440532013000", { groupSize: 3 }));
// -> "DE8 937 040 044 053 201 300 0"
```

### 5) Country detection
```ts
import { getIbanCountry } from "@emaddehnavi/iban-tools";

console.log(getIbanCountry("DE89 3704 0044 0532 0130 00")); // "DE"
console.log(getIbanCountry("XX12 3456")); // null
```

## API

- `isValidIban(iban: string): boolean` — strict validator (ASCII uppercase, exact length, mod-97).
- `isValidIbanTolerant(iban: string): boolean` — normalize then validate.
- `normalizeIban(input: string): string` — canonicalize to `A–Z0–9`.
- `formatIban(iban: string, opts?: { groupSize?: number; validate?: boolean }): string` — pretty print; validates by default.
- `getIbanCountry(iban: string): string | null` — two-letter country code if length & shape match.

## License

MIT
