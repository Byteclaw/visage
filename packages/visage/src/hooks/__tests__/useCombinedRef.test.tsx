import { render } from '@testing-library/react';
import React, { createRef } from 'react';
import { useCombinedRef } from '../useCombinedRef';

describe('useCombinedRef', () => {
  it('passes internal ref to outside ref', () => {
    const ref = createRef<any>();
    const ref2 = createRef<any>();

    function Comp() {
      const innerRef = useCombinedRef(ref, ref2);

      return <div ref={innerRef} />;
    }

    render(<Comp />);

    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref2.current).toBeInstanceOf(HTMLElement);
    expect(ref.current).toBe(ref2.current);
  });
});
