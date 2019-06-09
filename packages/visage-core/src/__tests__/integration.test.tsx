import React from 'react';
import { render } from 'react-testing-library';
import { createComponent, DesignSystem } from './designSystem';

describe('integration', () => {
  describe('basic usage', () => {
    it('works correctly without default props', () => {
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

    it('works correctly with default props', () => {
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
  });
});
