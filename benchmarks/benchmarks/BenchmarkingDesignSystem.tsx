import {
  DesignSystem,
  resolveStyleSheets,
  StyleGenerator,
} from '@byteclaw/visage-core';
import { createDocsTheme } from '@byteclaw/visage-themes';
import React, { ReactNode } from 'react';

const generateStyle: StyleGenerator = (styleSheets, ctx) => {
  return {
    style: resolveStyleSheets(styleSheets, ctx),
  };
};
const theme = createDocsTheme();

interface Props {
  children: ReactNode;
}

export function BenchmarkingDesignSystem({ children }: Props) {
  return (
    <DesignSystem styleGenerator={generateStyle} theme={theme}>
      {children}
    </DesignSystem>
  );
}
