import { Global } from '@emotion/core';
import { Button, useDesignSystem } from '@byteclaw/visage';
import React, { Fragment, useState } from 'react';

export function GridDebugTogglerButton() {
  const [showGrid, shouldShowGrid] = useState(true);
  const { theme } = useDesignSystem();
  const baselineGridHeight = theme.resolve('margin', 1);

  return (
    <Fragment>
      {showGrid ? (
        <Global
          styles={{
            body: {
              backgroundImage: `linear-gradient(to bottom,rgba(0,170,255,.3) 1px,transparent 1px,transparent ${baselineGridHeight}px,rgba(0,170,255,.2) ${baselineGridHeight}px,transparent ${baselineGridHeight +
                1}px,transparent ${baselineGridHeight * 2}px),
                linear-gradient(90deg,rgba(0,170,255,.3) 1px,transparent 1px,transparent ${baselineGridHeight}px,rgba(0,170,255,.2) ${baselineGridHeight}px,transparent ${baselineGridHeight +
                1}px,transparent ${baselineGridHeight * 2}px)`,
              backgroundPosition: 'left top',
              backgroundRepeat: 'repeat',
              backgroundSize: `${baselineGridHeight *
                2}px ${baselineGridHeight * 2}px`,
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
