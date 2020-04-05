# `@byteclaw/visage`

![@byteclaw/visage version](https://img.shields.io/npm/v/@byteclaw/visage.svg?style=flat-square&label=@byteclaw/visage)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

Visage is a design system based set of UI components for React applications. It's goal is to provide you building blocks for rapid UI development and bridge the gap between designer and developer by establishing a common language.

- [`@byteclaw/visage`](#byteclawvisage)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Documentation](#documentation)
  - [License](#license)

## Installation

```console
npm install @byteclaw/visage @byteclaw/visage-themes
# or
yarn add @byteclaw/visage @byteclaw/visage-themes
```

## Usage

```tsx
import { DesignSystem, Text } from '@byteclaw/visage';
import { createDocsTheme } from '@byteclaw/visage-themes';
import React from 'react';

const theme = createDocsTheme();

<DesignSystem theme={theme}>
  <YourApp />
</DesignSystem>;
```

## Documentation

Please visit [https://visage.design](https://visage.design).

## License

MIT
