import { renderHook } from '@testing-library/react-hooks';
import { render } from '@testing-library/react';
import React, { createRef } from 'react';
import { useCombinedRef } from '../useCombinedRef';

describe('useCombinedRef', () => {
  it('keeps internal ref if outside ref is null', () => {
    const { rerender, result } = renderHook(() => useCombinedRef(null));

    expect(result.current.current).toBeNull();

    result.current.current = 'test';

    expect(result.current.current).toBe('test');

    rerender();

    expect(result.current.current).toBe('test');
  });

  it('passes internal ref to outside ref', () => {
    const ref = createRef<any>();

    function Comp() {
      const innerRef = useCombinedRef(ref);

      return <div ref={innerRef} />;
    }

    render(<Comp />);

    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});
