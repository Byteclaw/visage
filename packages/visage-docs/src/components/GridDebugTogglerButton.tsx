import { Global } from '@emotion/core';
import { Button, useDesignSystem } from '@byteclaw/visage';
import React, { Fragment, useState } from 'react';

export function GridDebugTogglerButton() {
  const [showGrid, shouldShowGrid] = useState(true);
  const { theme } = useDesignSystem();
  const baseLineHeight = Number(
    theme.resolve('lineHeight', 0).replace('px', ''),
  );
  const halfLineHeight = baseLineHeight / 2;

  return (
    <Fragment>
      {showGrid ? (
        <Global
          styles={{
            body: {
              backgroundImage: `linear-gradient(to bottom,rgba(0,170,255,.3) 1px,transparent 1px,transparent ${halfLineHeight}px,rgba(0,170,255,.2) ${halfLineHeight}px,transparent ${halfLineHeight +
                1}px,transparent ${baseLineHeight}px)`,
              backgroundPosition: 'left top',
              backgroundRepeat: 'repeat',
              backgroundSize: `100% ${theme.resolve('lineHeight', 0)}`,
            },
          }}
        />
      ) : null}
      <Button onClick={() => shouldShowGrid(!showGrid)} type="button">
        Toggle debug grid
      </Button>
    </Fragment>
  );
}
