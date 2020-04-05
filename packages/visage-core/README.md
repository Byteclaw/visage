# `@byteclaw/visage-core`

![@byteclaw/visage-core version](https://img.shields.io/npm/v/@byteclaw/visage-core.svg?style=flat-square&label=@byteclaw/visage-core)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

CSS-in-js agnostic framework for design system development used by [Visage Design System](https://visage.design).

- [`@byteclaw/visage-core`](#byteclawvisage-core)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Documentation](#documentation)
  - [License](#license)

## Installation

```console
npm install @byteclaw/visage
# or
yarn add @byteclaw/visage
```

## Usage

```tsx
import {
  createComponent,
  createTheme,
  DesignSystem,
  resolveStyleSheets,
} from '@byteclaw/visage-core';

// create component is used to create a system component
const Box = createComponent('div', {
  displayName: 'Box',
  styles: {
    color: 'primary',
  },
});

const theme = createTheme({
  theme: {
    color: {
      primary: 'red',
    },
  },
});

// style generator is responsible for returning props that are used to style a component
// for example this one returns a style prop that is used directly on a component
// @byteclaw/visage uses emotion css-in-js therefore it returns className prop
function styleGenerator(styleSheets, ctx) {
  // stylesheets is an array of stylesheets that should be merged
  // ctx is current design system context, which contains an information about device viewport, theme, etc
  return {
    // deepmerges stylesheets and produces a final styleSheet for a component
    style: resolveStyleSheets(styleSheets, ctx),
  };
}

<DesignSystem theme={theme}>
  <Box />
</DesignSystem>;
```

## Documentation

Please visit [https://visage.design](https://visage.design).

## License

MIT
