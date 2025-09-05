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

- Lightweight, zero dependencies

## Installation

```bash
npm install @emaddehnavi/iban-tools
```

## Usage


### Strict IBAN validation

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

## License

MIT
