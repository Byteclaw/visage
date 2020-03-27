import { renderHook } from '@testing-library/react-hooks';
import { useOnRenderEffect } from '../useOnRenderEffect';

describe('useOnRenderEffect', () => {
  it('calls effect on component render and cleans it up on every rerender', () => {
    const cleanupEffect = jest.fn();
    const effect = jest.fn().mockImplementation(() => cleanupEffect);

    const result = renderHook(() => useOnRenderEffect(effect));

    expect(effect).toHaveBeenCalledTimes(1);
    expect(cleanupEffect).not.toHaveBeenCalled();

    result.rerender();

    expect(effect).toHaveBeenCalledTimes(2);
    // because effect always returns the same function so useEffect does not do anything
    expect(cleanupEffect).toHaveBeenCalledTimes(0);

    result.unmount();

    expect(effect).toHaveBeenCalledTimes(2);
    expect(cleanupEffect).toHaveBeenCalledTimes(1);
  });

  it('calls effect on component render and cleans it up on prop change', () => {
    const cleanupEffect = jest.fn();
    const effect = jest.fn().mockImplementation(() => cleanupEffect);

    const result = renderHook(props => useOnRenderEffect(effect, [props.a]), {
      initialProps: { a: 10 },
    });

    expect(effect).toHaveBeenCalledTimes(1);
    expect(cleanupEffect).not.toHaveBeenCalled();

    result.rerender();

    expect(effect).toHaveBeenCalledTimes(1);
    expect(cleanupEffect).not.toHaveBeenCalled();

    result.rerender({ a: 20 });

    expect(effect).toHaveBeenCalledTimes(2);
    // is not called because unregister is always the same in our case
    expect(cleanupEffect).toHaveBeenCalledTimes(0);

    result.rerender({ a: 20 });

    expect(effect).toHaveBeenCalledTimes(2);
    // is not called because unregister is always the same in our case
    expect(cleanupEffect).toHaveBeenCalledTimes(0);

    result.unmount();

    expect(effect).toHaveBeenCalledTimes(2);
    expect(cleanupEffect).toHaveBeenCalledTimes(1);
  });
});
