import React from 'react';
import { render } from './render';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('renders correctly', () => {
    const { asFragment } = render(
      <Badge content="1">
        <div style={{ width: '24px', height: '24px' }} />
      </Badge>,
    );

    expect(asFragment()).toMatchInlineSnapshot(`
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
        .emotion-1 {
        display: -webkit-inline-box;
        display: -webkit-inline-flex;
        display: -ms-inline-flexbox;
        display: inline-flex;
        position: relative;
        -webkit-flex-shrink: 0;
        -ms-flex-negative: 0;
        flex-shrink: 0;
        vertical-align: middle;
      }

      .emotion-0 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        border-radius: 10px;
        font-family: heading-font;
        font-weight: 600;
        padding-top: 0px;
        padding-bottom: 0px;
        padding-left: 4px;
        padding-right: 4px;
        background-color: light-blue;
        position: absolute;
        -webkit-flex-wrap: wrap;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        font-size: 10px;
        height: 20px;
        min-width: 20px;
        -webkit-transition: all 250ms ease-in;
        transition: all 250ms ease-in;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-align-content: center;
        -ms-flex-line-pack: center;
        align-content: center;
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        -ms-flex-pack: center;
        justify-content: center;
        color: rgb(255,255,255);
        top: 0;
        right: 0;
        -webkit-transform: translate(50%,-50%);
        -ms-transform: translate(50%,-50%);
        transform: translate(50%,-50%);
        -webkit-transform-origin: 100% 0%;
        -ms-transform-origin: 100% 0%;
        transform-origin: 100% 0%;
      }

      <span
          class="emotion-1"
        >
          <span
            class="emotion-0"
          >
            1
          </span>
          <div
            style="width: 24px; height: 24px;"
          />
        </span>
      </DocumentFragment>
    `);
  });
});
