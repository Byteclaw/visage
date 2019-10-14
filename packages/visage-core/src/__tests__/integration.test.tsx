import React from 'react';
import { render } from '@testing-library/react';
import { createComponent, DesignSystem } from './designSystem';

describe('integration', () => {
  describe('basic usage', () => {
    it('works correctly without default styles', () => {
      const Link = createComponent('a');

      const { asFragment } = render(
        <DesignSystem>
          <Link href="a" styles={{ background: '#ccc' }} />
        </DesignSystem>,
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
      const Link = createComponent('a', {
        defaultStyles: {
          background: '#ccc',
        },
      });

      const { asFragment } = render(
        <DesignSystem>
          <Link href="a" />
        </DesignSystem>,
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

    it('works correctly with default props', () => {
      const Link = createComponent('a', {
        defaultStyles: {
          background: '#ccc',
        },
        defaultProps: { href: '/test', id: 'id' },
      });

      const { asFragment } = render(
        <DesignSystem>
          <Link href="a" />
        </DesignSystem>,
      );

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

    it('extends default props', () => {
      const { asFragment } = render(
        <DesignSystem>
          <A href="a" styles={{ color: '#eee' }} />
        </DesignSystem>,
      );

      expect(asFragment()).toMatchInlineSnapshot(`
                                        <DocumentFragment>
                                          <a
                                            href="a"
                                            style="background: rgb(204, 204, 204); color: rgb(238, 238, 238);"
                                          />
                                        </DocumentFragment>
                              `);
    });

    it('extends props of overriden component', () => {
      const { asFragment } = render(
        <DesignSystem>
          <A as={B} href="a" />
        </DesignSystem>,
      );

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
      const { asFragment } = render(
        <DesignSystem>
          <C />
        </DesignSystem>,
      );

      expect(asFragment()).toMatchInlineSnapshot(`
                <DocumentFragment>
                  <a
                    style="color: pink; margin: 1px; padding: 1px;"
                  />
                </DocumentFragment>
            `);
    });
  });
});
