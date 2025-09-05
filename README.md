# @emaddehnavi/iban-tools

A tiny TypeScript library for working with IBANs.

## Features

- **Strict IBAN validation** following ISO 13616
  - Enforces correct length per country
  - Only accepts uppercase A–Z and digits 0–9 (no spaces, no hidden Unicode)
  - Validates check digits (mod-97 == 1)

- Lightweight, zero dependencies

## Installation

```bash
npm install @emaddehnavi/iban-tools
```

## Usage


### Strict IBAN validation

```ts
import { isValidIbanStrict } from "@emaddehnavi/iban-tools";

// Valid German IBAN
console.log(isValidIbanStrict("DE89370400440532013000")); // true

// Invalid (contains spaces)
console.log(isValidIbanStrict("DE89 3704 0044 0532 0130 00")); // false

// Invalid (lowercase)
console.log(isValidIbanStrict("de89370400440532013000")); // false

// Invalid (wrong check digits)
console.log(isValidIbanStrict("DE00370400440532013000")); // false
```

## License

MIT
