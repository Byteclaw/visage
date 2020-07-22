import { renderHook } from '@testing-library/react-hooks';
import { useBreakpointDetection } from '../useBreakpointDetection';

describe('useBreakpointDetection', () => {
  const setBreakpoint = jest.fn();

  beforeEach(() => {
    setBreakpoint.mockReset();
  });

  it('does not detect if disabled', () => {
    const breakpoints = ['1'];
    const result = renderHook(() =>
      useBreakpointDetection(false, breakpoints, setBreakpoint),
    );

    expect(setBreakpoint).not.toHaveBeenCalled();
    result.rerender();
    expect(setBreakpoint).not.toHaveBeenCalled();
  });

  it('detects media query on render, does nothing on rerender, unregisters on unmount', () => {
    const mqList1 = {
      addListener: jest.fn(),
      removeListener: jest.fn(),
      matches: false,
    };
    const mqList2 = {
      addListener: jest.fn(),
      removeListener: jest.fn(),
      matches: true,
    };
    window.matchMedia = jest
      .fn()
      .mockReturnValueOnce(mqList1)
      .mockReturnValueOnce(mqList2);

    const breakpoints = ['1', '2'];
    const result = renderHook(() =>
      useBreakpointDetection(true, breakpoints, setBreakpoint),
    );

    expect(window.matchMedia).toHaveBeenCalledTimes(2);
    expect(mqList1.addListener).toHaveBeenCalledTimes(1);
    expect(mqList2.addListener).toHaveBeenCalledTimes(1);
    expect(setBreakpoint).toHaveBeenCalledTimes(2);

    result.rerender();

    expect(mqList1.addListener).toHaveBeenCalledTimes(1);
    expect(mqList2.addListener).toHaveBeenCalledTimes(1);
    expect(setBreakpoint).toHaveBeenCalledTimes(2);
    expect(mqList1.removeListener).not.toHaveBeenCalled();
    expect(mqList2.removeListener).not.toHaveBeenCalled();

    result.unmount();

    expect(mqList1.addListener).toHaveBeenCalledTimes(1);
    expect(mqList2.addListener).toHaveBeenCalledTimes(1);
    expect(setBreakpoint).toHaveBeenCalledTimes(2);
    expect(mqList1.removeListener).toHaveBeenCalledTimes(1);
    expect(mqList2.removeListener).toHaveBeenCalledTimes(1);
  });

  it('detects media query on render, remounts on change, unregisters on unmount', () => {
    const mqList1 = {
      addListener: jest.fn(),
      removeListener: jest.fn(),
      matches: false,
    };
    const mqList2 = {
      addListener: jest.fn(),
      removeListener: jest.fn(),
      matches: true,
    };
    window.matchMedia = jest
      .fn()
      .mockReturnValueOnce(mqList1)
      .mockReturnValueOnce(mqList2);

    const breakpoints = ['1', '2'];
    const result = renderHook(
      props =>
        useBreakpointDetection(
          props.enabled,
          props.breakpoints,
          props.setBreakpoint,
        ),
      {
        initialProps: {
          enabled: true,
          breakpoints,
          setBreakpoint,
        },
      },
    );

    expect(window.matchMedia).toHaveBeenCalledTimes(2);
    expect(mqList1.addListener).toHaveBeenCalledTimes(1);
    expect(mqList2.addListener).toHaveBeenCalledTimes(1);
    expect(setBreakpoint).toHaveBeenCalledTimes(2);

    result.rerender();

    expect(mqList1.addListener).toHaveBeenCalledTimes(1);
    expect(mqList2.addListener).toHaveBeenCalledTimes(1);
    expect(setBreakpoint).toHaveBeenCalledTimes(2);
    expect(mqList1.removeListener).not.toHaveBeenCalled();
    expect(mqList2.removeListener).not.toHaveBeenCalled();

    result.rerender({ enabled: false, breakpoints, setBreakpoint });

    expect(mqList1.addListener).toHaveBeenCalledTimes(1);
    expect(mqList2.addListener).toHaveBeenCalledTimes(1);
    expect(setBreakpoint).toHaveBeenCalledTimes(2);
    expect(mqList1.removeListener).toHaveBeenCalledTimes(1);
    expect(mqList2.removeListener).toHaveBeenCalledTimes(1);

    const mqList3 = {
      addListener: jest.fn(),
      removeListener: jest.fn(),
      matches: false,
    };
    const mqList4 = {
      addListener: jest.fn(),
      removeListener: jest.fn(),
      matches: true,
    };
    (window.matchMedia as any)
      .mockReturnValueOnce(mqList3)
      .mockReturnValueOnce(mqList4);

    result.rerender({ enabled: true, breakpoints: ['3', '4'], setBreakpoint });

    expect(mqList1.addListener).toHaveBeenCalledTimes(1);
    expect(mqList2.addListener).toHaveBeenCalledTimes(1);
    expect(mqList3.addListener).toHaveBeenCalledTimes(1);
    expect(mqList4.addListener).toHaveBeenCalledTimes(1);
    expect(setBreakpoint).toHaveBeenCalledTimes(4);
    expect(mqList1.removeListener).toHaveBeenCalledTimes(1);
    expect(mqList2.removeListener).toHaveBeenCalledTimes(1);
    expect(mqList3.removeListener).not.toHaveBeenCalled();
    expect(mqList4.removeListener).not.toHaveBeenCalled();

    result.unmount();

    expect(mqList1.addListener).toHaveBeenCalledTimes(1);
    expect(mqList2.addListener).toHaveBeenCalledTimes(1);
    expect(mqList3.addListener).toHaveBeenCalledTimes(1);
    expect(mqList4.addListener).toHaveBeenCalledTimes(1);
    expect(setBreakpoint).toHaveBeenCalledTimes(4);
    expect(mqList1.removeListener).toHaveBeenCalledTimes(1);
    expect(mqList2.removeListener).toHaveBeenCalledTimes(1);
    expect(mqList3.removeListener).toHaveBeenCalledTimes(1);
    expect(mqList4.removeListener).toHaveBeenCalledTimes(1);
  });
});
