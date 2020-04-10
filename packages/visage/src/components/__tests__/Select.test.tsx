import { act, fireEvent } from '@testing-library/react';
import React from 'react';
import { Select } from '../Select';
import { render } from './render';

describe('Select', () => {
  describe('readOnly', () => {
    it('reacts to mouse interaction', async () => {
      const onLoadOptions = jest.fn().mockResolvedValue(['a', 'b', 'c']);
      const onChange = jest.fn();

      const { getByTestId } = render(
        <Select
          data-testid="select"
          id="root"
          onChange={onChange}
          options={onLoadOptions}
        />,
      );

      // now open focus using click
      fireEvent.click(document.querySelector('input'));

      // now expect select to be loading options
      expect(onLoadOptions).toHaveBeenCalledTimes(1);

      // resolve loading
      await act(() => Promise.resolve());

      // now we expect menu to be visible
      expect(document.querySelectorAll('[role="option"]').length).toBe(3);

      // we expect the first option to be focused
      expect(getByTestId('select').getAttribute('aria-activedescendant')).toBe(
        'root-listbox-option-0',
      );

      // now click on option b
      fireEvent.click(document.querySelector('[role="option"]:nth-child(2)'));

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('b');

      expect(getByTestId('select').getAttribute('value')).toBe('b');

      // we expect popup to close
      expect(document.querySelectorAll('[role="option"]').length).toBe(0);

      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('reacts to keyboard interaction', async () => {
      const onLoadOptions = jest.fn().mockResolvedValue(['a', 'b', 'c']);
      const onChange = jest.fn();

      const { getByTestId } = render(
        <Select
          data-testid="select"
          id="root"
          onChange={onChange}
          options={onLoadOptions}
        />,
      );

      // now focus select
      fireEvent.focus(getByTestId('select'));

      // now open focus using ArrowDown
      fireEvent.keyDown(document.querySelector('input'), { key: 'ArrowDown' });

      // now expect select to be loading options
      expect(onLoadOptions).toHaveBeenCalledTimes(1);

      // resolve loading
      await act(() => Promise.resolve());

      // now we expect menu to be visible
      expect(document.querySelectorAll('[role="option"]').length).toBe(3);

      // we expect the first option to be focused
      expect(getByTestId('select').getAttribute('aria-activedescendant')).toBe(
        'root-listbox-option-0',
      );

      // now select the option using Enter
      fireEvent.keyDown(getByTestId('select'), { key: 'Enter' });

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenLastCalledWith('a');

      // we expect popup to close
      expect(document.querySelectorAll('[role="option"]').length).toBe(0);

      expect(getByTestId('select').getAttribute('value')).toBe('a');

      // open popup again
      fireEvent.keyDown(getByTestId('select'), { key: 'ArrowUp' });

      expect(document.querySelectorAll('[role="option"]').length).toBe(3);

      // one value should be focused
      expect(document.querySelectorAll('[aria-selected="true"]').length).toBe(
        1,
      );

      // we expect the last option to be focused
      expect(getByTestId('select').getAttribute('aria-activedescendant')).toBe(
        'root-listbox-option-2',
      );

      // now select the option using Space
      fireEvent.keyDown(getByTestId('select'), { key: ' ' });

      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenLastCalledWith('c');

      // we expect popup to close
      expect(document.querySelectorAll('[role="option"]').length).toBe(0);

      expect(getByTestId('select').getAttribute('value')).toBe('c');

      // open popup again
      fireEvent.keyDown(getByTestId('select'), { key: 'ArrowUp' });

      expect(document.querySelectorAll('[role="option"]').length).toBe(3);

      // focus the first using Home
      fireEvent.keyDown(getByTestId('select'), { key: 'Home' });

      // we expect the first option to be focused
      expect(getByTestId('select').getAttribute('aria-activedescendant')).toBe(
        'root-listbox-option-0',
      );

      // focus the last using End
      fireEvent.keyDown(getByTestId('select'), { key: 'End' });

      // we expect the last option to be focused
      expect(getByTestId('select').getAttribute('aria-activedescendant')).toBe(
        'root-listbox-option-2',
      );

      // cycle through list downward
      fireEvent.keyDown(getByTestId('select'), { key: 'ArrowDown' });

      expect(getByTestId('select').getAttribute('aria-activedescendant')).toBe(
        'root-listbox-option-0',
      );

      fireEvent.keyDown(getByTestId('select'), { key: 'ArrowDown' });

      expect(getByTestId('select').getAttribute('aria-activedescendant')).toBe(
        'root-listbox-option-1',
      );

      fireEvent.keyDown(getByTestId('select'), { key: 'ArrowDown' });

      expect(getByTestId('select').getAttribute('aria-activedescendant')).toBe(
        'root-listbox-option-2',
      );

      fireEvent.keyDown(getByTestId('select'), { key: 'Home' });

      expect(getByTestId('select').getAttribute('aria-activedescendant')).toBe(
        'root-listbox-option-0',
      );

      // cycle through list upward
      fireEvent.keyDown(getByTestId('select'), { key: 'ArrowUp' });

      expect(getByTestId('select').getAttribute('aria-activedescendant')).toBe(
        'root-listbox-option-2',
      );

      fireEvent.keyDown(getByTestId('select'), { key: 'ArrowUp' });

      expect(getByTestId('select').getAttribute('aria-activedescendant')).toBe(
        'root-listbox-option-1',
      );

      fireEvent.keyDown(getByTestId('select'), { key: 'ArrowUp' });

      expect(getByTestId('select').getAttribute('aria-activedescendant')).toBe(
        'root-listbox-option-0',
      );

      // now close popup using escape
      fireEvent.keyDown(getByTestId('select'), { key: 'Escape' });

      expect(getByTestId('select').getAttribute('aria-activedescendant')).toBe(
        null,
      );

      expect(onChange).toHaveBeenCalledTimes(2);
    });
  });

  describe('searchable', () => {
    it('resets select to value on blur if searchValue is not same as value', async () => {
      jest.useFakeTimers();
      const onLoadOptions = jest.fn().mockResolvedValue(['a', 'b', 'c']);

      const { getByTestId } = render(
        <Select
          data-testid="select"
          id="root"
          options={onLoadOptions}
          searchable
        />,
      );

      // focus element
      fireEvent.focus(getByTestId('select'));

      // searchable input can be expanded by clicking on toggler of with arrow down/up
      fireEvent.keyDown(getByTestId('select'), { key: 'ArrowDown' });

      // now expect select to be loading options
      expect(onLoadOptions).toHaveBeenCalledTimes(1);
      expect(onLoadOptions).toHaveBeenCalledWith('');

      // resolve loading
      await act(() => Promise.resolve());

      // now we expect menu to be visible
      expect(document.querySelectorAll('[role="option"]').length).toBe(3);

      // now select an option
      fireEvent.click(document.querySelector('[role="option"]:first-of-type'));

      expect(getByTestId('select').getAttribute('value')).toBe('a');

      // now type something to input
      fireEvent.change(getByTestId('select'), { target: { value: 'abcd' } });

      // resolve change debounce
      act(() => jest.runAllTimers());

      expect(onLoadOptions).toHaveBeenCalledTimes(2);
      expect(onLoadOptions).toHaveBeenLastCalledWith('abcd');

      expect(getByTestId('select').getAttribute('value')).toBe('abcd');

      // wait for options to resolve
      await act(() => Promise.resolve());

      // now blur
      fireEvent.blur(getByTestId('select'));

      // now expect the value of input to be selected value
      fireEvent.change(getByTestId('select'), { target: { value: 'a' } });
    });

    it('resets options if filterable and blurred without value selection', async () => {
      jest.useFakeTimers();
      const onLoadOptions = jest.fn((val: string) =>
        Promise.resolve(['aa', 'ab', 'cc'].filter(v => v.startsWith(val))),
      );

      const { getByTestId } = render(
        <Select
          data-testid="select"
          id="root"
          options={onLoadOptions}
          searchable
        />,
      );

      // focus element
      fireEvent.focus(getByTestId('select'));

      // searchable input can be expanded by clicking on toggler of with arrow down/up
      fireEvent.keyDown(getByTestId('select'), { key: 'ArrowDown' });

      // now expect select to be loading options
      expect(onLoadOptions).toHaveBeenCalledTimes(1);
      expect(onLoadOptions).toHaveBeenCalledWith('');

      // resolve loading
      await act(() => Promise.resolve());

      // now we expect menu to be visible
      expect(document.querySelectorAll('[role="option"]').length).toBe(3);

      // now type a
      fireEvent.change(getByTestId('select'), { target: { value: 'a' } });
      // resolve change debounce
      act(() => jest.runAllTimers());

      // wait for options to resolve
      await act(() => Promise.resolve());

      // we should see only 2 options
      expect(document.querySelectorAll('[role="option"]').length).toBe(2);

      expect(onLoadOptions).toHaveBeenCalledTimes(2);
      expect(onLoadOptions).toHaveBeenCalledWith('a');

      // now blur the input which will reset it's value
      fireEvent.blur(getByTestId('select'));
      expect(getByTestId('select')).toHaveAttribute('value', '');

      // now open select again, and see that options are loaded without filter
      fireEvent.click(getByTestId('select'));

      // now expect select to be loading options
      expect(onLoadOptions).toHaveBeenCalledTimes(3);
      expect(onLoadOptions).toHaveBeenCalledWith('');

      // wait for options to resolve
      await act(() => Promise.resolve());

      // now we expect menu to be visible
      expect(document.querySelectorAll('[role="option"]').length).toBe(3);

      // now select an option
      /* fireEvent.click(document.querySelector('[role="option"]:first-of-type'));

      expect(getByTestId('select').getAttribute('value')).toBe('a');

      // now type something to input
      fireEvent.change(getByTestId('select'), { target: { value: 'abcd' } });

      // resolve change debounce
      act(() => jest.runAllTimers());

      expect(onLoadOptions).toHaveBeenCalledTimes(2);
      expect(onLoadOptions).toHaveBeenLastCalledWith('abcd');

      expect(getByTestId('select').getAttribute('value')).toBe('abcd');

      // wait for options to resolve
      await act(() => Promise.resolve());

      // now blur
      fireEvent.blur(getByTestId('select'));

      // now expect the value of input to be selected value
      fireEvent.change(getByTestId('select'), { target: { value: 'a' } }); */
    });
  });

  describe('controlled', () => {
    it('works correctly', async () => {
      const onLoadOptions = jest.fn().mockResolvedValue(['a', 'b', 'c']);
      const onChange = jest.fn();

      const { getByTestId, rerender } = render(
        <Select
          data-testid="select"
          id="root"
          onChange={onChange}
          options={onLoadOptions}
          value="b"
        />,
      );

      // now focus select
      fireEvent.focus(getByTestId('select'));

      // now open focus using ArrowDown
      fireEvent.click(document.querySelector('input'));

      expect(getByTestId('select').getAttribute('value')).toBe('b');

      // now expect select to be loading options
      expect(onLoadOptions).toHaveBeenCalledTimes(1);

      // resolve loading
      await act(() => Promise.resolve());

      // now we expect menu to be visible
      expect(document.querySelectorAll('[role="option"]').length).toBe(3);

      expect(onChange).not.toHaveBeenCalled();

      // we expect the first option to be focused
      expect(getByTestId('select').getAttribute('aria-activedescendant')).toBe(
        'root-listbox-option-0',
      );

      // now click on option b
      fireEvent.click(document.querySelector('[role="option"]:nth-child(1)'));

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('a');

      expect(getByTestId('select').getAttribute('value')).toBe('a');

      // we expect popup to close
      expect(document.querySelectorAll('[role="option"]').length).toBe(0);

      expect(onChange).toHaveBeenCalledTimes(1);

      rerender(
        <Select
          data-testid="select"
          id="root"
          onChange={onChange}
          options={onLoadOptions}
          value="c"
        />,
      );

      expect(getByTestId('select').getAttribute('value')).toBe('c');

      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });
});
