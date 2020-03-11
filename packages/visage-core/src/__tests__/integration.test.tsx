import React from 'react';
import { createComponent, render } from './designSystem';

describe('integration', () => {
  describe.each([createComponent])('basic usage', create => {
    it('works correctly without default styles', () => {
      const Link = create('a');

      const { asFragment } = render(
        <Link href="a" styles={{ background: '#ccc' }} />,
      );

      expect(asFragment()).toMatchInlineSnapshot(`
                                                <DocumentFragment>
                                                  <a
                                                    href="a"
                                                    style="background: rgb(204, 204, 204);"
                                                  />
                                                </DocumentFragment>
                                    `);
    });

    it('works correctly with default styles', () => {
      const Link = create('a', {
        defaultStyles: {
          background: '#ccc',
        },
      });

      const { asFragment } = render(<Link href="a" />);

      expect(asFragment()).toMatchInlineSnapshot(`
                                                <DocumentFragment>
                                                  <a
                                                    href="a"
                                                    style="background: rgb(204, 204, 204);"
                                                  />
                                                </DocumentFragment>
                                    `);
    });

    it('works correctly with default styles as a function', () => {
      const Link = create('a', {
        defaultStyles() {
          return {
            color: 'tomato',
          };
        },
      });

      const { asFragment } = render(<Link href="a" />);

      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <a
            href="a"
            style="color: tomato;"
          />
        </DocumentFragment>
      `);
    });

    it('works correctly with default props', () => {
      const Link = create('a', {
        defaultStyles: {
          background: '#ccc',
        },
        defaultProps: { href: '/test', id: 'id' },
      });

      const { asFragment } = render(<Link href="a" />);

      expect(asFragment()).toMatchInlineSnapshot(`
                <DocumentFragment>
                  <a
                    href="a"
                    id="id"
                    style="background: rgb(204, 204, 204);"
                  />
                </DocumentFragment>
            `);
    });
  });

  describe('extending', () => {
    const A = createComponent('a', {
      defaultStyles: {
        background: '#ccc',
        color: 'red',
      },
    });
    const B = createComponent('a', {
      defaultStyles: {
        color: 'black',
        margin: 1,
      },
    });
    const C = createComponent(B, {
      defaultStyles: {
        color: 'pink',
        padding: 1,
      },
    });

    it('extends default styles', () => {
      const { asFragment } = render(<A href="a" styles={{ color: '#eee' }} />);

      expect(asFragment()).toMatchInlineSnapshot(`
                                                <DocumentFragment>
                                                  <a
                                                    href="a"
                                                    style="background: rgb(204, 204, 204); color: rgb(238, 238, 238);"
                                                  />
                                                </DocumentFragment>
                                    `);
    });

    it('extends styles of overriden component', () => {
      const { asFragment } = render(<A as={B} href="a" />);

      expect(asFragment()).toMatchInlineSnapshot(`
                                                <DocumentFragment>
                                                  <a
                                                    href="a"
                                                    style="color: red; margin: 1px; background: rgb(204, 204, 204);"
                                                  />
                                                </DocumentFragment>
                                    `);
    });

    it('extends visage component', () => {
      const { asFragment } = render(<C />);

      expect(asFragment()).toMatchInlineSnapshot(`
                        <DocumentFragment>
                          <a
                            style="color: pink; margin: 1px; padding: 1px;"
                          />
                        </DocumentFragment>
                  `);
    });

    it('extends default props of visage component', () => {
      const RedButton = createComponent('button', {
        defaultProps: {
          children: <span>trolo</span>,
          type: 'button',
        },
        defaultStyles: {
          color: 'red',
        },
      });
      const BlueButton = createComponent(RedButton, {
        defaultProps: {
          disabled: true,
        },
        defaultStyles: {
          color: 'blue',
        },
      });

      const blueButtonResult = render(<BlueButton />);

      expect(blueButtonResult.asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <button
            disabled=""
            style="color: blue;"
            type="button"
          >
            <span>
              trolo
            </span>
          </button>
        </DocumentFragment>
      `);

      const BlueButtonWithCustomChildren = createComponent(BlueButton, {
        defaultProps: {
          children: <span>not trololo</span>,
        },
      });

      const blueButtonWithCustomChildrenResult = render(
        <BlueButtonWithCustomChildren />,
      );

      expect(blueButtonWithCustomChildrenResult.asFragment())
        .toMatchInlineSnapshot(`
        <DocumentFragment>
          <button
            disabled=""
            style="color: blue;"
            type="button"
          >
            <span>
              not trololo
            </span>
          </button>
        </DocumentFragment>
      `);

      blueButtonWithCustomChildrenResult.rerender(
        <BlueButtonWithCustomChildren>
          Custom children
        </BlueButtonWithCustomChildren>,
      );

      expect(blueButtonWithCustomChildrenResult.asFragment())
        .toMatchInlineSnapshot(`
        <DocumentFragment>
          <button
            disabled=""
            style="color: blue;"
            type="button"
          >
            Custom children
          </button>
        </DocumentFragment>
      `);
    });
  });
});
