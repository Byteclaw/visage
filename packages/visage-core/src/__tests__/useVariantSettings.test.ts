import { renderHook } from '@testing-library/react-hooks';
import { useVariantSettings } from '../useVariantSettings';

describe('useVariantSettings', () => {
  it('returns an empty array on empty settings', () => {
    const { result } = renderHook(() => useVariantSettings([], []));

    expect(result.current).toEqual([]);
  });

  it('removes duplicate variant settings and makes parent settings to take precedence', () => {
    const { result } = renderHook(() =>
      useVariantSettings(
        [
          { name: 'test', prop: 'test', stripProp: true },
          { name: 'test2', prop: 'test2', stripProp: true },
        ],
        [
          {
            name: 'test',
            prop: 'test',
            stripProp: false,
          },
        ],
      ),
    );

    expect(result.current).toEqual([
      { name: 'test2', prop: 'test2', stripProp: true },
      {
        name: 'test',
        prop: 'test',
        stripProp: false,
      },
    ]);
  });

  it('keeps variant settings for same input name but different output names', () => {
    const { result } = renderHook(() =>
      useVariantSettings(
        [
          { name: 'test', prop: 'test', stripProp: true },
          { name: 'test2', prop: 'test', stripProp: true },
          { name: 'test3', prop: 'test', stripProp: true },
        ],
        [
          {
            name: 'test',
            prop: 'test',
            stripProp: false,
          },
        ],
      ),
    );

    expect(result.current).toEqual([
      { name: 'test2', prop: 'test', stripProp: true },
      { name: 'test3', prop: 'test', stripProp: true },
      {
        name: 'test',
        prop: 'test',
        stripProp: false,
      },
    ]);
  });

  it('does not recalculate settings if variant did not change', () => {
    const local = [{ name: 'test', prop: 'test', stripProp: true }];
    const parent = [
      {
        name: 'test',
        prop: 'test',
        stripProp: false,
      },
    ];
    const { rerender, result } = renderHook(
      props => useVariantSettings(props.local, props.parent),
      {
        initialProps: { local, parent, test: 0 },
      },
    );

    const res = result.current;

    rerender({
      local,
      parent,
      test: 1,
    });

    expect(result.current).toBe(res);
  });
});
