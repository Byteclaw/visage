import { act, fireEvent } from '@testing-library/react';
import React from 'react';
import { AutocompleteInput } from '../AutocompleteInput';
import { render } from './render';

describe('AutocompleteInput', () => {
  describe('readOnly', () => {
    it('reacts to mouse interaction', async () => {
      const onLoadOptions = jest.fn();
      const onChange = jest.fn();

      const { getByTestId } = render(
        <AutocompleteInput
          data-testid="input"
          id="root"
          onChange={onChange}
          options={onLoadOptions}
          readOnly
        />,
      );

      // now open focus using click
      fireEvent.click(getByTestId('input'));

      // this input is not interactive
      expect(onLoadOptions).not.toHaveBeenCalled();
      expect(onChange).not.toHaveBeenCalled();
    });

    it('reacts to keyboard interaction', async () => {
      const onLoadOptions = jest.fn();
      const onChange = jest.fn();

      const { getByTestId } = render(
        <AutocompleteInput
          data-testid="input"
          id="root"
          onChange={onChange}
          options={onLoadOptions}
          readOnly
        />,
      );

      // now focus select
      fireEvent.focus(getByTestId('input'));

      // now type something
      fireEvent.change(getByTestId('input'), { target: { value: 'Typed' } });

      expect(getByTestId('input').getAttribute('value')).toBe('');

      // not interactive!
      expect(onLoadOptions).not.toBeCalled();
      expect(onChange).not.toBeCalled();
    });
  });

  describe('interactive', () => {
    it('reacts to mouse interaction', async () => {
      jest.useFakeTimers();
      const onLoadOptions = jest.fn().mockResolvedValue(['a', 'b', 'c']);
      const onChange = jest.fn();

      const { getByTestId } = render(
        <AutocompleteInput
          data-testid="input"
          id="root"
          onInputValueChange={onChange}
          options={onLoadOptions}
        />,
      );

      // now open focus using click
      fireEvent.click(getByTestId('input'));

      // type something
      fireEvent.change(getByTestId('input'), { target: { value: 'Typed' } });

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenLastCalledWith('Typed');

      // debounce change, so it loads options
      act(() => jest.runAllTimers());

      // now expect select to be loading options
      expect(onLoadOptions).toHaveBeenCalledTimes(1);
      expect(onLoadOptions).toHaveBeenLastCalledWith('Typed');

      // resolve loading
      await act(() => Promise.resolve());

      // now we expect menu to be visible
      expect(document.querySelectorAll('[role="option"]').length).toBe(3);

      // we don't expect the option to be selected
      expect(
        getByTestId('input').getAttribute('aria-activedescendant'),
      ).toBeNull();

      // now click on option b
      fireEvent.click(document.querySelector('[role="option"]:nth-child(2)'));

      expect(getByTestId('input').getAttribute('value')).toBe('b');
      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenLastCalledWith('b');

      // we expect popup to close
      expect(document.querySelectorAll('[role="option"]').length).toBe(0);
      expect(onChange).toHaveBeenCalledTimes(2);
    });

    it('reacts to keyboard interaction', async () => {
      jest.useFakeTimers();
      const onLoadOptions = jest.fn().mockResolvedValue(['a', 'b', 'c']);
      const onChange = jest.fn();

      const { getByTestId } = render(
        <AutocompleteInput
          data-testid="input"
          id="root"
          onInputValueChange={onChange}
          options={onLoadOptions}
        />,
      );

      // now focus select
      fireEvent.focus(getByTestId('input'));

      // type something
      fireEvent.change(getByTestId('input'), { target: { value: 'Typed' } });

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenLastCalledWith('Typed');

      // debounce change
      act(() => jest.runAllTimers());

      // now expect select to be loading options
      expect(onLoadOptions).toHaveBeenCalledTimes(1);
      expect(onLoadOptions).toHaveBeenLastCalledWith('Typed');

      // resolve loading
      await act(() => Promise.resolve());

      // now we expect menu to be visible
      expect(document.querySelectorAll('[role="option"]').length).toBe(3);

      // we don't expect the first option to be focused
      expect(
        getByTestId('input').getAttribute('aria-activedescendant'),
      ).toBeNull();

      // now go to first option
      fireEvent.keyDown(getByTestId('input'), { key: 'ArrowDown' });

      expect(getByTestId('input').getAttribute('aria-activedescendant')).toBe(
        'root-listbox-option-0',
      );

      // now select the option using Enter
      fireEvent.keyDown(getByTestId('input'), { key: 'Enter' });

      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenLastCalledWith('a');

      // we expect popup to close
      expect(document.querySelectorAll('[role="option"]').length).toBe(0);

      // type something
      fireEvent.change(getByTestId('input'), {
        target: { value: 'Typed value new' },
      });

      expect(onChange).toHaveBeenCalledTimes(3);
      expect(onChange).toHaveBeenLastCalledWith('Typed value new');

      // debounce change
      act(() => jest.runAllTimers());

      // now expect select to be loading options
      expect(onLoadOptions).toHaveBeenCalledTimes(2);
      expect(onLoadOptions).toHaveBeenLastCalledWith('Typed value new');

      // resolve loading
      await act(() => Promise.resolve());

      // now we expect menu to be visible
      expect(document.querySelectorAll('[role="option"]').length).toBe(3);

      // now close menu with escape
      fireEvent.keyDown(getByTestId('input'), { key: 'Escape' });

      // now we expect menu not to be visible
      expect(document.querySelectorAll('[role="option"]').length).toBe(0);

      // open menu
      fireEvent.keyDown(getByTestId('input'), { key: 'ArrowDown' });

      // now we expect menu to be visible
      expect(document.querySelectorAll('[role="option"]').length).toBe(3);

      expect(onLoadOptions).toHaveBeenCalledTimes(2);
    });
  });

  describe('controlled', () => {
    it('works correctly', async () => {
      jest.useFakeTimers();
      const onLoadOptions = jest.fn().mockResolvedValue(['a', 'b', 'c']);
      const onChange = jest.fn();

      const { getByTestId, rerender } = render(
        <AutocompleteInput
          data-testid="input"
          id="root"
          onInputValueChange={onChange}
          options={onLoadOptions}
          value="b"
        />,
      );

      // now focus select
      fireEvent.focus(getByTestId('input'));

      expect(getByTestId('input').getAttribute('value')).toBe('b');

      expect(onChange).not.toHaveBeenCalled();

      // now start typing
      fireEvent.change(getByTestId('input'), { target: { value: 'new' } });

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenLastCalledWith('new');

      act(() => jest.runAllTimers());

      expect(onLoadOptions).toHaveBeenCalledTimes(1);
      expect(onLoadOptions).toHaveBeenLastCalledWith('new');

      await act(() => Promise.resolve());

      // now we expect menu to be visible
      expect(document.querySelectorAll('[role="option"]').length).toBe(3);

      // we don't expect the first option to be focused
      expect(
        getByTestId('input').getAttribute('aria-activedescendant'),
      ).toBeNull();

      // now click on option b
      fireEvent.click(document.querySelector('[role="option"]:nth-child(1)'));

      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenCalledWith('a');

      expect(getByTestId('input').getAttribute('value')).toBe('a');

      // we expect popup to close
      expect(document.querySelectorAll('[role="option"]').length).toBe(0);

      expect(onChange).toHaveBeenCalledTimes(2);

      rerender(
        <AutocompleteInput
          data-testid="select"
          id="root"
          onChange={onChange}
          options={onLoadOptions}
          value="c"
        />,
      );

      expect(getByTestId('select').getAttribute('value')).toBe('c');

      expect(onChange).toHaveBeenCalledTimes(2);
    });
  });

  describe('expandOnClick', () => {
    it('loads options and expands on click', async () => {
      const onLoadOptions = jest.fn().mockResolvedValue(['a', 'b', 'c']);
      const onChange = jest.fn();

      const { getByTestId } = render(
        <AutocompleteInput
          data-testid="input"
          expandOnClick
          id="root"
          onInputValueChange={onChange}
          options={onLoadOptions}
        />,
      );

      // now open focus using click
      fireEvent.click(getByTestId('input'));

      expect(onLoadOptions).toHaveBeenCalledTimes(1);
      expect(onLoadOptions).toHaveBeenCalledWith('');

      await act(() => Promise.resolve());

      // now we expect menu to be visible
      expect(document.querySelectorAll('[role="option"]').length).toBe(3);

      // we don't expect the first option to be focused
      expect(
        getByTestId('input').getAttribute('aria-activedescendant'),
      ).toBeNull();
    });

    it('does not load options and expands on click if read only', async () => {
      const onLoadOptions = jest.fn().mockResolvedValue(['a', 'b', 'c']);
      const onChange = jest.fn();

      const { getByTestId } = render(
        <AutocompleteInput
          data-testid="input"
          expandOnClick
          id="root"
          onInputValueChange={onChange}
          options={onLoadOptions}
          readOnly
        />,
      );

      // now open focus using click
      fireEvent.click(getByTestId('input'));

      expect(onLoadOptions).not.toHaveBeenCalled();

      // now we expect menu to be visible
      expect(document.querySelectorAll('[role="option"]').length).toBe(0);
    });

    it('does not load options and expands on click if disabled', async () => {
      const onLoadOptions = jest.fn().mockResolvedValue(['a', 'b', 'c']);
      const onChange = jest.fn();

      const { getByTestId } = render(
        <AutocompleteInput
          data-testid="input"
          expandOnClick
          disabled
          id="root"
          onInputValueChange={onChange}
          options={onLoadOptions}
        />,
      );

      // now open focus using click
      fireEvent.click(getByTestId('input'));

      expect(onLoadOptions).not.toHaveBeenCalled();

      // now we expect menu to be visible
      expect(document.querySelectorAll('[role="option"]').length).toBe(0);
    });
  });

  it('supports custom menu', async () => {
    const menu = jest.fn(() => <div data-testid="menu" />);

    const { getByTestId, findByTestId } = render(
      <AutocompleteInput
        data-testid="input"
        expandOnClick
        id="root"
        menu={menu}
        options={['a', 'b', 'c', 'd']}
        value="b"
      />,
    );

    await expect(findByTestId('menu')).resolves.toBeInstanceOf(HTMLElement);

    expect(menu).toHaveBeenCalledTimes(1);
    expect(menu).toHaveBeenCalledWith(
      expect.objectContaining({
        open: false,
      }),
      expect.anything(),
    );

    // now open the menu
    fireEvent.click(getByTestId('input'));

    // resolve loading
    await act(() => Promise.resolve());

    expect(menu).toHaveBeenCalledWith(
      expect.objectContaining({
        open: true,
      }),
      expect.anything(),
    );
  });
});
