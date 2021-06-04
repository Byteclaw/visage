import { useDesignSystem, Theme } from '@byteclaw/visage-core';
import { Global } from '@emotion/core';
import React, { useMemo } from 'react';

interface GlobalStylesProps {
  styles?: { [selector: string]: VisageStyleSheet };
}

/**
 * Allows to apply visage style sheet to global styles
 */
export function GlobalStyles({
  styles = {},
}: GlobalStylesProps): React.ReactElement {
  const ctx = useDesignSystem<Theme>();
  const globalStyles = useMemo(
    () => ctx.resolveStyleSheets([styles]),
    [ctx, styles],
  );

  return <Global styles={globalStyles} />;
}
