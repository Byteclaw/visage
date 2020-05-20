import { OmitPropsSetting } from '@byteclaw/visage-utils';
import React from 'react';
import { createComponent, render } from './designSystem';

describe('integration', () => {
  describe('basic usage', () => {
    it('works correctly without default styles', () => {
      const Link = createComponent('a');

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
      const Link = createComponent('a', {
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
      const Link = createComponent('a', {
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
            style="color: rgb(255, 99, 71);"
          />
        </DocumentFragment>
      `);
    });

    it('works correctly with styles', () => {
      const Link = createComponent('a', {
        styles: {
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

    it('works correctly with styles as function', () => {
      const Link = createComponent('a', {
        styles: () => ({
          background: '#ccc',
        }),
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

    it('styles takes precedence over default styles', () => {
      const Link = createComponent('a', {
        defaultStyles: {
          background: 'blue',
        },
        styles: () => ({
          background: 'red',
        }),
      });

      const { asFragment } = render(<Link href="a" />);

      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <a
            href="a"
            style="background: red;"
          />
        </DocumentFragment>
      `);
    });

    it('works correctly with default props', () => {
      const Link = createComponent('a', {
        styles: {
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

    it('allows to pass custom className', () => {
      const Link = createComponent('a', {
        styles: {
          background: '#ccc',
        },
        defaultProps: { href: '/test', id: 'id' },
      });

      const { asFragment } = render(
        <Link className="test-class-name" href="a" />,
      );

      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <a
            class="test-class-name"
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
      styles: {
        background: '#ccc',
        color: 'red',
      },
    });
    const B = createComponent('a', {
      styles: {
        color: 'black',
        margin: 1,
      },
    });
    const C = createComponent(B, {
      styles: {
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
            style="color: rgb(255, 0, 0); margin: 1px; background: rgb(204, 204, 204);"
          />
        </DocumentFragment>
      `);
    });

    it('extends visage component', () => {
      const { asFragment } = render(<C />);

      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <a
            style="color: rgb(255, 192, 203); margin: 1px; padding: 1px;"
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
        styles: {
          color: 'red',
        },
      });
      const BlueButton = createComponent(RedButton, {
        defaultProps: {
          disabled: true,
        },
        styles: {
          color: 'blue',
        },
      });

      const blueButtonResult = render(<BlueButton />);

      expect(blueButtonResult.asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <button
            disabled=""
            style="color: rgb(0, 0, 255);"
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
            style="color: rgb(0, 0, 255);"
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
            style="color: rgb(0, 0, 255);"
            type="button"
          >
            Custom children
          </button>
        </DocumentFragment>
      `);
    });

    it('extends extended Visage component with styles prop', () => {
      const { asFragment } = render(<C styles={{ color: 'blue' }} />);

      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <a
            style="color: rgb(0, 0, 255); margin: 1px; padding: 1px;"
          />
        </DocumentFragment>
      `);
    });

    it('extends overridden Visage component with styles prop', () => {
      const { asFragment } = render(
        <A as={B} styles={{ background: 'black', color: 'blue' }} />,
      );

      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <a
            style="color: rgb(0, 0, 255); margin: 1px; background: black;"
          />
        </DocumentFragment>
      `);
    });
  });

  describe('variants', () => {
    const variantSettings: OmitPropsSetting = {
      name: 'variant',
      prop: 'variant',
      defaultValue: 'default',
      stripProp: true,
    };
    const A = createComponent('a', {
      styles: ({ variant }) => ({
        background: '#ccc',
        color: 'red',
        ...(variant !== 'primary'
          ? {}
          : {
              fontWeight: 'bold',
              textDecoration: 'underline',
            }),
      }),
      // there is any because variant we need just simple object to define props
      // in typescript, but that's just syntactic sugar for typescript, underneath
      // real settings are used
      variants: [variantSettings as any],
    });

    it('allows to define variants on a component', () => {
      const { asFragment, rerender } = render(<A />);

      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <a
            data-variant="default"
            style="background: rgb(204, 204, 204); color: rgb(255, 0, 0);"
          />
        </DocumentFragment>
      `);

      rerender(<A variant="primary" />);

      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <a
            data-variant="primary"
            style="background: rgb(204, 204, 204); color: rgb(255, 0, 0); font-weight: bold; text-decoration: underline;"
          />
        </DocumentFragment>
      `);
    });

    it('allows to extend variants on a component using composition', () => {
      const B = createComponent(A, {
        styles: ({ variant }) =>
          variant === 'primary'
            ? {
                fontWeight: 'normal',
                alignSelf: 'center',
              }
            : {},
      });

      const { asFragment, rerender } = render(<B />);

      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <a
            data-variant="default"
            style="background: rgb(204, 204, 204); color: rgb(255, 0, 0);"
          />
        </DocumentFragment>
      `);

      rerender(<B variant="primary" />);

      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <a
            data-variant="primary"
            style="background: rgb(204, 204, 204); color: rgb(255, 0, 0); font-weight: normal; text-decoration: underline; align-self: center;"
          />
        </DocumentFragment>
      `);
    });

    it('allows to extend variants on a component using style overrides', () => {
      const { asFragment, rerender } = render(
        <A styles={{ textDecoration: 'underline' }} />,
      );

      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <a
            data-variant="default"
            style="background: rgb(204, 204, 204); color: rgb(255, 0, 0); text-decoration: underline;"
          />
        </DocumentFragment>
      `);

      rerender(<A variant="primary" />);

      // variants should be applied with overriden styles from styles prop
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <a
            data-variant="primary"
            style="background: rgb(204, 204, 204); color: rgb(255, 0, 0); text-decoration: underline; font-weight: bold;"
          />
        </DocumentFragment>
      `);
    });

    it('allows to extend variants on a component using as prop', () => {
      const B = createComponent('span', {
        styles: ({ variant }) =>
          variant === 'primary'
            ? {
                fontWeight: 'normal',
                alignSelf: 'center',
              }
            : {},
        // now redefine variant and see if underlying variant from A is picked up too
        variants: [variantSettings as any],
      });

      const { asFragment, rerender } = render(<A as={B} />);

      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span
            data-variant="default"
            style="background: rgb(204, 204, 204); color: rgb(255, 0, 0);"
          />
        </DocumentFragment>
      `);

      rerender(<A as={B} variant="primary" />);

      // variants from A should be applied as well
      // but A is merged to B because we want to B to look as A but behave as B
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <span
            data-variant="primary"
            style="background: rgb(204, 204, 204); color: rgb(255, 0, 0); font-weight: bold; align-self: center; text-decoration: underline;"
          />
        </DocumentFragment>
      `);
    });

    it('allows to redefine variants using composition', () => {
      const redefinedVariantSettings: OmitPropsSetting = {
        name: 'variant',
        prop: 'variant',
        defaultValue: 'default',
        stripProp: false, // keep variant prop on element
      };
      const B = createComponent(A, {
        styles: ({ variant }) =>
          variant === 'primary'
            ? {
                fontWeight: 'normal',
                alignSelf: 'center',
              }
            : {},
        // now redefine variant and see if underlying variant from A is picked up too
        variants: [redefinedVariantSettings as any],
      });

      const { asFragment, rerender } = render(<B />);

      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <a
            data-variant="default"
            style="background: rgb(204, 204, 204); color: rgb(255, 0, 0);"
          />
        </DocumentFragment>
      `);

      rerender(<B variant="primary" />);

      // primary styles from A should be applied too
      // but B is merged to A because we want A to look like B
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <a
            data-variant="primary"
            style="background: rgb(204, 204, 204); color: rgb(255, 0, 0); font-weight: normal; text-decoration: underline; align-self: center;"
            variant="primary"
          />
        </DocumentFragment>
      `);
    });
  });
});
