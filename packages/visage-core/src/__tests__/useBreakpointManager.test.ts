import { act, renderHook } from '@testing-library/react-hooks';
import { useDesignSystem } from '../useDesignSystem';
import { useBreakpoint, useBreakpointManager } from '../useBreakpointManager';

jest.mock('../useDesignSystem', () => ({ useDesignSystem: jest.fn() }));

describe('useBreakpointManager', () => {
  it('tracks current breakpoint and always selects the biggest breakpoint matched', () => {
    const { result } = renderHook(() =>
      useBreakpointManager(0, ['a', 'b', 'c']),
    );

    expect(result.current[0]).toBe(0);

    // now match 1
    act(() => result.current[1](1, true));

    expect(result.current[0]).toBe(1);

    // now unmatch 0
    act(() => result.current[1](0, false));

    expect(result.current[0]).toBe(1);
  });

  it('keeps previous value as breakpoint if the first unmatched and second matched after a while', () => {
    const { result } = renderHook(() =>
      useBreakpointManager(0, ['a', 'b', 'c']),
    );

    expect(result.current[0]).toBe(0);

    // now unmatch 0
    act(() => result.current[1](0, false));

    expect(result.current[0]).toBe(0);

    // now match 1
    act(() => result.current[1](1, true));

    expect(result.current[0]).toBe(1);

    // now unmatch 1
    act(() => result.current[1](1, false));

    // keeps 1 until next breakpoint is selected
    expect(result.current[0]).toBe(1);
  });
});

describe('useBreakpoint', () => {
  let useDesignSystemMock: jest.Mock;

  beforeEach(() => {
    (useDesignSystem as jest.Mock).mockReset();

    useDesignSystemMock = useDesignSystem as jest.Mock;
  });

  describe('gte', () => {
    it('matches if breakpoint is equal or greater than provided value', () => {
      useDesignSystemMock.mockReturnValueOnce({ breakpoint: 1 });

      const { rerender, result } = renderHook(() => useBreakpoint({ gte: 1 }));

      expect(result.current).toBe(true);

      useDesignSystemMock.mockReturnValueOnce({ breakpoint: 2 });

      rerender();

      expect(result.current).toBe(true);

      useDesignSystemMock.mockReturnValueOnce({ breakpoint: 0 });

      rerender();

      expect(result.current).toBe(false);
    });
  });

  describe('is', () => {
    it('matches if breakpoint is equal to the provided value', () => {
      useDesignSystemMock.mockReturnValueOnce({ breakpoint: 1 });

      const { rerender, result } = renderHook(() => useBreakpoint({ is: 1 }));

      expect(result.current).toBe(true);

      useDesignSystemMock.mockReturnValueOnce({ breakpoint: 2 });

      rerender();

      expect(result.current).toBe(false);
    });

    it('matches if breakpoint is in the provided array', () => {
      useDesignSystemMock.mockReturnValueOnce({ breakpoint: 0 });

      const { rerender, result } = renderHook(() =>
        useBreakpoint({ is: [0, 2] }),
      );

      expect(result.current).toBe(true);

      useDesignSystemMock.mockReturnValueOnce({ breakpoint: 2 });

      rerender();

      expect(result.current).toBe(true);

      useDesignSystemMock.mockReturnValueOnce({ breakpoint: 1 });

      rerender();

      expect(result.current).toBe(false);
    });
  });

  describe('lte', () => {
    it('matches if breakpoint is equal or less than provided value', () => {
      useDesignSystemMock.mockReturnValueOnce({ breakpoint: 2 });

      const { rerender, result } = renderHook(() => useBreakpoint({ lte: 2 }));

      expect(result.current).toBe(true);

      useDesignSystemMock.mockReturnValueOnce({ breakpoint: 1 });

      rerender();

      expect(result.current).toBe(true);

      useDesignSystemMock.mockReturnValueOnce({ breakpoint: 3 });

      rerender();

      expect(result.current).toBe(false);
    });
  });

  describe('not', () => {
    it('matches if breakpoint is not equal to the provided value', () => {
      useDesignSystemMock.mockReturnValueOnce({ breakpoint: 1 });

      const { rerender, result } = renderHook(() => useBreakpoint({ not: 2 }));

      expect(result.current).toBe(true);

      useDesignSystemMock.mockReturnValueOnce({ breakpoint: 2 });

      rerender();

      expect(result.current).toBe(false);
    });

    it('matches if breakpoint is not in the provided array', () => {
      useDesignSystemMock.mockReturnValueOnce({ breakpoint: 1 });

      const { rerender, result } = renderHook(() =>
        useBreakpoint({ not: [0, 2] }),
      );

      expect(result.current).toBe(true);

      useDesignSystemMock.mockReturnValueOnce({ breakpoint: 2 });

      rerender();

      expect(result.current).toBe(false);
    });
  });
});
