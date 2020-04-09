import { renderHook } from '@testing-library/react-hooks';
import { useStaticMemo } from '../useStaticMemo';

describe('useStaticMemo', () => {
  it('calls static memo function with provided args', () => {
    const memo = jest.fn((a: number, b: number) => a + b);

    const { rerender, result } = renderHook(
      props => useStaticMemo(memo, [props.a, props.b]),
      { initialProps: { a: 1, b: 2 } },
    );

    expect(result.current).toBe(3);
    expect(memo).toHaveBeenCalledTimes(1);
    expect(memo).toHaveBeenCalledWith(1, 2);

    // now it memoizes a result
    rerender({ a: 1, b: 2 });

    expect(result.current).toBe(3);
    expect(memo).toHaveBeenCalledTimes(1);

    // now it recalculates
    rerender({ a: 2, b: 2 });

    expect(result.current).toBe(4);
    expect(memo).toHaveBeenCalledTimes(2);
    expect(memo).toHaveBeenCalledWith(2, 2);
  });
});
