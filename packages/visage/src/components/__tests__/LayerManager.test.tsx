import { render } from '@testing-library/react';
import React, { useContext } from 'react';
import { LayerManager, LayerManagerContext } from '../LayerManager';

function CurentZIndex() {
  const zIndex = useContext(LayerManagerContext);

  return <span>{zIndex}</span>;
}

describe('LayerManager', () => {
  it('increments zindex correctly', () => {
    const { asFragment } = render(
      <LayerManager>
        <LayerManager>
          <LayerManager>
            <CurentZIndex />
          </LayerManager>
        </LayerManager>
      </LayerManager>,
    );

    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <span>
          3
        </span>
      </DocumentFragment>
    `);
  });
});
