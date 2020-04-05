# babel-plugin-visage

![@byteclaw/babel-plugin-visage version](https://img.shields.io/npm/v/@byteclaw/babel-plugin-visage.svg?style=flat-square&label=@byteclaw/babel-plugin-visage)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

Babel plugin that improves Visage performance by hoisting `styles` prop to a root scope of a Component's file.

- [babel-plugin-visage](#babel-plugin-visage)
  - [Example](#example)
    - [In](#in)
    - [Out](#out)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Via `.babelrc` (Recommended)](#via-babelrc-recommended)
  - [License](#license)

## Example

### In

```tsx
import { Box } from '@byteclaw/visage';
import React from 'react';

export function Test() {
  return <>
    <Box styles={{ color: 'red' }}>
    <Box styles={{ color: 'blue' }}>
    <Box styles={{ color: 'green' }}>
  </>
}
```

### Out

```tsx
import { Box } from '@byteclaw/visage';
import React from 'react';

var _ref = Object.freeze({ color: 'red' });
var _ref2 = Object.freeze({ color: 'blue' });
var _ref3 = Object.freeze({ color: 'green' });

export function Test() {
  return <>
    <Box styles={_ref}>
    <Box styles={_ref2}>
    <Box styles={_ref3}>
  </>
}
```

## Installation

```
yarn add --dev babel-plugin-visage
```

or if you prefer npm

```
npm install --save-dev babel-plugin-visage
```

## Usage

### Via `.babelrc` (Recommended)

```json
{
  "plugins": ["@byteclaw/visage"]
}
```

## License

MIT
