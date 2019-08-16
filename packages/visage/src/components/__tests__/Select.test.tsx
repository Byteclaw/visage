import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { TestDesignSystem } from './DesignSystem';
import { Select } from '../Select';

describe('Select', () => {
  describe('readOnly', () => {
    it('reacts to mouse interaction', async () => {
      const onLoadOptions = jest.fn().mockResolvedValue(['a', 'b', 'c']);
      const onChange = jest.fn();

      const { getByTestId } = render(
        <TestDesignSystem>
          <Select
            data-testid="select"
            id="root"
            onChange={onChange}
            options={onLoadOptions}
          />
        </TestDesignSystem>,
      );

      // now open focus using click
      fireEvent.click(document.querySelector('input'));

      // now expect select to be loading options
      expect(onLoadOptions).toHaveBeenCalledTimes(1);

      // resolve loading
      await Promise.resolve();

      // now we expect menu to be visible
      expect(document.querySelectorAll('[role="option"]').length).toBe(3);

      // we expect the first option to be focused
      expect(getByTestId('select').getAttribute('aria-activedescendant')).toBe(
        'root-option-0',
      );

      // now click on option b
      fireEvent.mouseDown(
        document.querySelector('[role="option"]:nth-child(2)'),
      );

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
        <TestDesignSystem>
          <Select
            data-testid="select"
            id="root"
            onChange={onChange}
            options={onLoadOptions}
          />
        </TestDesignSystem>,
      );

      // now focus select
      fireEvent.focus(getByTestId('select'));

      // now open focus using ArrowDown
      fireEvent.keyDown(document.querySelector('input'), { key: 'ArrowDown' });

      // now expect select to be loading options
      expect(onLoadOptions).toHaveBeenCalledTimes(1);

      // resolve loading
      await Promise.resolve();

      // now we expect menu to be visible
      expect(document.querySelectorAll('[role="option"]').length).toBe(3);

      // we expect the first option to be focused
      expect(getByTestId('select').getAttribute('aria-activedescendant')).toBe(
        'root-option-0',
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

      // one value should be already selected and one focused
      expect(document.querySelectorAll('[aria-selected="true"]').length).toBe(
        2,
      );

      // we expect the last option to be focused
      expect(getByTestId('select').getAttribute('aria-activedescendant')).toBe(
        'root-option-2',
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
        'root-option-0',
      );

      // focus the last using End
      fireEvent.keyDown(getByTestId('select'), { key: 'End' });

      // we expect the last option to be focused
      expect(getByTestId('select').getAttribute('aria-activedescendant')).toBe(
        'root-option-2',
      );

      // cycle through list downward
      fireEvent.keyDown(getByTestId('select'), { key: 'ArrowDown' });

      expect(getByTestId('select').getAttribute('aria-activedescendant')).toBe(
        'root-option-0',
      );

      fireEvent.keyDown(getByTestId('select'), { key: 'ArrowDown' });

      expect(getByTestId('select').getAttribute('aria-activedescendant')).toBe(
        'root-option-1',
      );

      fireEvent.keyDown(getByTestId('select'), { key: 'ArrowDown' });

      expect(getByTestId('select').getAttribute('aria-activedescendant')).toBe(
        'root-option-2',
      );

      fireEvent.keyDown(getByTestId('select'), { key: 'Home' });

      expect(getByTestId('select').getAttribute('aria-activedescendant')).toBe(
        'root-option-0',
      );

      // cycle through list upward
      fireEvent.keyDown(getByTestId('select'), { key: 'ArrowUp' });

      expect(getByTestId('select').getAttribute('aria-activedescendant')).toBe(
        'root-option-2',
      );

      fireEvent.keyDown(getByTestId('select'), { key: 'ArrowUp' });

      expect(getByTestId('select').getAttribute('aria-activedescendant')).toBe(
        'root-option-1',
      );

      fireEvent.keyDown(getByTestId('select'), { key: 'ArrowUp' });

      expect(getByTestId('select').getAttribute('aria-activedescendant')).toBe(
        'root-option-0',
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
        <TestDesignSystem>
          <Select
            data-testid="select"
            id="root"
            options={onLoadOptions}
            searchable
          />
        </TestDesignSystem>,
      );

      // focus element
      fireEvent.focus(getByTestId('select'));

      // searchable input can be expanded by clicking on toggler of with arrow down/up
      fireEvent.keyDown(getByTestId('select'), { key: 'ArrowDown' });

      // now expect select to be loading options
      expect(onLoadOptions).toHaveBeenCalledTimes(1);
      expect(onLoadOptions).toHaveBeenCalledWith('');

      // resolve loading
      await Promise.resolve();

      // now we expect menu to be visible
      expect(document.querySelectorAll('[role="option"]').length).toBe(3);

      // now select an option
      fireEvent.mouseDown(
        document.querySelector('[role="option"]:first-of-type'),
      );

      expect(getByTestId('select').getAttribute('value')).toBe('a');

      // now type something to input
      fireEvent.change(getByTestId('select'), { target: { value: 'abcd' } });

      // resolve change debounce
      jest.runAllTimers();

      expect(onLoadOptions).toHaveBeenCalledTimes(2);
      expect(onLoadOptions).toHaveBeenLastCalledWith('abcd');

      expect(getByTestId('select').getAttribute('value')).toBe('abcd');

      // wait for options to resolve
      await Promise.resolve();

      // now blur
      fireEvent.blur(getByTestId('select'));

      // now expect the value of input to be selected value
      fireEvent.change(getByTestId('select'), { target: { value: 'a' } });
    });
  });

  describe('controlled', () => {
    it('works correctly', async () => {
      const onLoadOptions = jest.fn().mockResolvedValue(['a', 'b', 'c']);
      const onChange = jest.fn();

      const { getByTestId, rerender } = render(
        <TestDesignSystem>
          <Select
            defaultValue="a"
            data-testid="select"
            id="root"
            onChange={onChange}
            options={onLoadOptions}
            value="b"
          />
        </TestDesignSystem>,
      );

      // now focus select
      fireEvent.focus(getByTestId('select'));

      // now open focus using ArrowDown
      fireEvent.click(document.querySelector('input'));

      expect(getByTestId('select').getAttribute('value')).toBe('b');

      // now expect select to be loading options
      expect(onLoadOptions).toHaveBeenCalledTimes(1);

      // resolve loading
      await Promise.resolve();

      // now we expect menu to be visible
      expect(document.querySelectorAll('[role="option"]').length).toBe(3);

      expect(onChange).not.toHaveBeenCalled();

      // we expect the first option to be focused
      expect(getByTestId('select').getAttribute('aria-activedescendant')).toBe(
        'root-option-0',
      );

      // now click on option b
      fireEvent.mouseDown(
        document.querySelector('[role="option"]:nth-child(1)'),
      );

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('a');

      expect(getByTestId('select').getAttribute('value')).toBe('a');

      // we expect popup to close
      expect(document.querySelectorAll('[role="option"]').length).toBe(0);

      expect(onChange).toHaveBeenCalledTimes(1);

      rerender(
        <TestDesignSystem>
          <Select
            defaultValue="a"
            data-testid="select"
            id="root"
            onChange={onChange}
            options={onLoadOptions}
            value="c"
          />
        </TestDesignSystem>,
      );

      expect(getByTestId('select').getAttribute('value')).toBe('c');

      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });
});
