import React from 'react';
import { useLayerManager, LayerManager } from '../LayerManager';
import { render } from './render';

function CurrentZIndex() {
  const { level, zIndex } = useLayerManager();

  return <span data-level={level}>{zIndex}</span>;
}

describe('LayerManager', () => {
  it('increments zindex correctly', () => {
    const ui = (num: number) => (
      <React.Fragment>
        {/* data-level 1 - 100 */}
        <CurrentZIndex key={num} />
        <LayerManager>
          {/* data-level 2 - 200 */}
          <CurrentZIndex key={num} />
          <LayerManager>
            {/* data-level 3 - 300 */}
            <CurrentZIndex key={num} />
            <LayerManager>
              {/* data-level 4 - 400 */}
              <CurrentZIndex data-num={num} />
              <LayerManager>
                {/* data-level 5 - 500 */}
                <CurrentZIndex />
                <LayerManager>
                  {/* data-level 6 - 600 */}
                  <CurrentZIndex />
                </LayerManager>
              </LayerManager>
              <LayerManager>
                {/* data-level 5 - 500 */}
                <CurrentZIndex />
              </LayerManager>
            </LayerManager>
            <LayerManager>
              {/* data-level 4 - 400 */}
              <CurrentZIndex />
            </LayerManager>
          </LayerManager>
          <LayerManager>
            {/* data-level 3 - 300 */}
            <CurrentZIndex />
          </LayerManager>
        </LayerManager>
        <LayerManager>
          {/* data-level 2 - 200 */}
          <CurrentZIndex />
        </LayerManager>
      </React.Fragment>
    );

    const { asFragment, rerender } = render(ui(10));

    const fragmentA = asFragment();

    expect(fragmentA).toMatchInlineSnapshot(`
      <DocumentFragment>
        .emotion-0 {
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        -ms-flex-pack: center;
        justify-content: center;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 600;
      }

      <div
          aria-live="polite"
          class="emotion-0"
          data-toastmanager="true"
        />
        <span
          data-level="1"
        >
          100
        </span>
        <span
          data-level="2"
        >
          200
        </span>
        <span
          data-level="3"
        >
          300
        </span>
        <span
          data-level="4"
        >
          400
        </span>
        <span
          data-level="5"
        >
          500
        </span>
        <span
          data-level="6"
        >
          600
        </span>
        <span
          data-level="5"
        >
          500
        </span>
        <span
          data-level="4"
        >
          400
        </span>
        <span
          data-level="3"
        >
          300
        </span>
        <span
          data-level="2"
        >
          200
        </span>
      </DocumentFragment>
    `);

    rerender(ui(20));

    expect(asFragment()).toEqual(fragmentA);
  });
});
