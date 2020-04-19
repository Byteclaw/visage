import { act, renderHook } from '@testing-library/react-hooks';
import { useSelector } from '../useSelector';

describe('useSelector', () => {
  it('can not be interacted with if busy', () => {
    const onChange = jest.fn();
    const onInputValueChange = jest.fn();
    const onStateChange = jest.fn();
    const { result } = renderHook(() =>
      useSelector({ onChange, onInputValueChange, onStateChange }),
    );

    let [state, dispatch] = result.current;

    // set as busy
    act(() => dispatch({ type: 'SetBusy', isBusy: true, forInputValue: null }));
    // set some test options
    act(() =>
      dispatch({
        type: 'SetOptions',
        options: ['a', 'b'],
        forInputValue: null,
      }),
    );

    [state, dispatch] = result.current;

    expect(state.isBusy).toBe(true);

    // try to change input
    act(() => dispatch({ type: 'InputChange', value: 'a' }));

    expect(onChange).not.toHaveBeenCalled();

    // now open menu
    act(() => dispatch({ type: 'MenuOpen' }));

    [state, dispatch] = result.current;

    expect(state.isOpen).toBe(true);

    // now try to select an option
    act(() => dispatch({ type: 'SetOptionFocusByIndex', index: 0 }));
    act(() => dispatch({ type: 'SetCurrentFocusedOption' }));

    [state, dispatch] = result.current;

    // no option is focused nor selected
    expect(state).toMatchObject({
      focusedIndex: -1,
      value: null,
    });
  });

  it('calls onChange, onStateChange, onInputValueChange accordingly', () => {
    const onChange = jest.fn();
    const onInputValueChange = jest.fn();
    const onStateChange = jest.fn();
    const { result } = renderHook(() =>
      useSelector({ onChange, onInputValueChange, onStateChange }),
    );

    expect(result.current).toHaveLength(2);
    expect(onChange).not.toHaveBeenCalled();
    expect(onInputValueChange).not.toHaveBeenCalled();
    expect(onStateChange).not.toHaveBeenCalled();

    let [state, dispatch] = result.current;

    // change the value of selection with SetValue
    act(() => dispatch({ type: 'SetValue', value: 'a' }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith('a');
    expect(onInputValueChange).toHaveBeenCalledTimes(1);
    expect(onInputValueChange).toHaveBeenLastCalledWith('a');
    expect(onStateChange).toHaveBeenCalledTimes(1);
    expect(onStateChange).toHaveBeenLastCalledWith(
      state,
      expect.any(Object),
      dispatch,
    );

    [state, dispatch] = result.current;

    // now change the value using InputChange event
    act(() => dispatch({ type: 'InputChange', value: 'ab' }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith('a');
    expect(onInputValueChange).toHaveBeenCalledTimes(2);
    expect(onInputValueChange).toHaveBeenLastCalledWith('ab');
    expect(onStateChange).toHaveBeenCalledTimes(2);
    expect(onStateChange).toHaveBeenLastCalledWith(
      state,
      expect.any(Object),
      dispatch,
    );
  });

  it('reacts to focus / blur accordingly', () => {
    const onChange = jest.fn();
    const onInputValueChange = jest.fn();
    const onStateChange = jest.fn();
    const { result } = renderHook(() =>
      useSelector({ onChange, onInputValueChange, onStateChange }),
    );

    expect(result.current).toHaveLength(2);
    expect(onChange).not.toHaveBeenCalled();
    expect(onInputValueChange).not.toHaveBeenCalled();
    expect(onStateChange).not.toHaveBeenCalled();

    let [state, dispatch] = result.current;

    expect(state.isFocused).toBe(false);

    act(() => dispatch({ type: 'Focus' }));

    [state, dispatch] = result.current;

    expect(state.isFocused).toBe(true);

    act(() => dispatch({ type: 'Blur' }));

    [state, dispatch] = result.current;

    expect(state.isFocused).toBe(false);
  });
});
