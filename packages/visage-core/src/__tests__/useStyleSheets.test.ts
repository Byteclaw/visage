import { renderHook } from '@testing-library/react-hooks';
import { useStyleSheets } from '../useStyleSheets';

describe('useStyleSheets', () => {
  it('invalidates on face change (strict equal)', () => {
    const initialProps = {
      faceName: 'a',
      localStyles: {},
      parentStyles: [],
      styles: {},
    };
    const { result, rerender } = renderHook(
      ({ faceName, localStyles, parentStyles, styles, ...restProps }) =>
        useStyleSheets(faceName, localStyles, parentStyles, styles, restProps),
      {
        initialProps,
      },
    );

    expect(result.current).toStrictEqual([{}, { face: 'a' }, {}]);

    const result1 = result.current;

    // rerender
    rerender();

    // memoizes
    expect(result.current).toBe(result1);

    // change faceName
    rerender({
      faceName: 'b',
      localStyles: initialProps.localStyles,
      parentStyles: initialProps.parentStyles,
      styles: initialProps.styles,
    } as any);

    expect(result.current).toStrictEqual([{}, { face: 'b' }, {}]);

    const result2 = result.current;

    rerender();

    expect(result.current).toBe(result2);
  });

  it('invalidates on local styles change (strict equality)', () => {
    const initialProps = {
      faceName: 'a',
      localStyles: {},
      parentStyles: [],
      styles: {},
    };
    const { result, rerender } = renderHook(
      ({ faceName, localStyles, parentStyles, styles, ...restProps }) =>
        useStyleSheets(faceName, localStyles, parentStyles, styles, restProps),
      {
        initialProps,
      },
    );

    expect(result.current).toStrictEqual([{}, { face: 'a' }, {}]);

    const result1 = result.current;

    rerender();

    // memoizes
    expect(result.current).toBe(result1);

    // change faceName
    // local styles are not deep compared
    rerender({
      faceName: 'b',
      localStyles: {},
      parentStyles: initialProps.parentStyles,
      styles: initialProps.styles,
    } as any);

    expect(result.current).toStrictEqual([{}, { face: 'b' }, {}]);

    const result2 = result.current;

    // change faceName
    rerender();

    expect(result.current).toBe(result2);
  });

  it('invalidates if local styles function changes or props (deep equal)', () => {
    const initialProps = {
      faceName: 'a',
      localStyles() {
        return {};
      },
      parentStyles: [],
      styles: {},
    };
    const { result, rerender } = renderHook(
      ({ faceName, localStyles, parentStyles, styles, ...restProps }) =>
        useStyleSheets(faceName, localStyles, parentStyles, styles, restProps),
      {
        initialProps,
      },
    );

    expect(result.current).toStrictEqual([{}, { face: 'a' }, {}]);

    const result1 = result.current;

    rerender();

    // memoizes
    expect(result.current).toBe(result1);

    // change localStyles
    initialProps.localStyles = () => ({});

    rerender({
      faceName: 'a',
      localStyles: initialProps.localStyles,
      parentStyles: initialProps.parentStyles,
      styles: initialProps.styles,
    } as any);

    expect(result.current).toStrictEqual([{}, { face: 'a' }, {}]);

    const result2 = result.current;

    // change faceName
    rerender();

    expect(result.current).toBe(result2);

    // change props
    rerender({
      faceName: 'a',
      localStyles: initialProps.localStyles,
      parentStyles: initialProps.parentStyles,
      styles: initialProps.styles,
      extraProp: 1,
    } as any);

    expect(result.current).not.toBe(result2);

    const result3 = result.current;

    rerender({
      faceName: 'a',
      localStyles: initialProps.localStyles,
      parentStyles: initialProps.parentStyles,
      styles: initialProps.styles,
      extraProp: 1,
    } as any);

    expect(result.current).toBe(result3);
  });

  it('invalidates on parent styles change (strict equal)', () => {
    const initialProps = {
      faceName: 'a',
      localStyles: {},
      parentStyles: [],
      styles: {},
    };
    const { result, rerender } = renderHook(
      ({ faceName, localStyles, parentStyles, styles, ...restProps }) =>
        useStyleSheets(faceName, localStyles, parentStyles, styles, restProps),
      {
        initialProps,
      },
    );

    expect(result.current).toStrictEqual([{}, { face: 'a' }, {}]);

    const result1 = result.current;

    rerender();

    // memoizes
    expect(result.current).toBe(result1);

    // change parent styles
    initialProps.parentStyles = [];

    rerender({
      faceName: 'a',
      localStyles: initialProps.localStyles,
      parentStyles: initialProps.parentStyles,
      styles: initialProps.styles,
    } as any);

    expect(result.current).toStrictEqual([{}, { face: 'a' }, {}]);
    expect(result.current).not.toBe(result1);
  });

  it('invalidates on styles change (deep equal)', () => {
    const initialProps = {
      faceName: 'a',
      localStyles: {},
      parentStyles: [],
      styles: {},
    };
    const { result, rerender } = renderHook(
      ({ faceName, localStyles, parentStyles, styles, ...restProps }) =>
        useStyleSheets(faceName, localStyles, parentStyles, styles, restProps),
      {
        initialProps,
      },
    );

    expect(result.current).toStrictEqual([{}, { face: 'a' }, {}]);

    const result1 = result.current;

    rerender();

    // memoizes
    expect(result.current).toBe(result1);

    // change parent styles
    initialProps.styles = { test: 1 };

    rerender({
      faceName: 'a',
      localStyles: initialProps.localStyles,
      parentStyles: initialProps.parentStyles,
      styles: initialProps.styles,
    } as any);

    expect(result.current).toStrictEqual([{}, { face: 'a' }, { test: 1 }]);
    expect(result.current).not.toBe(result1);
  });
});
