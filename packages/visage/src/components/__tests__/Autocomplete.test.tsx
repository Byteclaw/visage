import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { TestDesignSystem } from './DesignSystem';
import { AutocompleteInput } from '../AutocompleteInput';

describe('Autocomplete', () => {
  describe('readOnly', () => {
    it('reacts to mouse interaction', async () => {
      const onLoadOptions = jest.fn();
      const onChange = jest.fn();

      const { getByTestId } = render(
        <TestDesignSystem>
          <AutocompleteInput
            data-testid="input"
            id="root"
            onChange={onChange}
            options={onLoadOptions}
            readOnly
          />
        </TestDesignSystem>,
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
        <TestDesignSystem>
          <AutocompleteInput
            data-testid="input"
            id="root"
            onChange={onChange}
            options={onLoadOptions}
            readOnly
          />
        </TestDesignSystem>,
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
        <TestDesignSystem>
          <AutocompleteInput
            data-testid="input"
            id="root"
            onChange={onChange}
            options={onLoadOptions}
          />
        </TestDesignSystem>,
      );

      // now open focus using click
      fireEvent.click(getByTestId('input'));

      // type something
      fireEvent.change(getByTestId('input'), { target: { value: 'Typed' } });

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenLastCalledWith('Typed');

      // debounce change, so it loads options
      jest.runAllTimers();

      // now expect select to be loading options
      expect(onLoadOptions).toHaveBeenCalledTimes(1);
      expect(onLoadOptions).toHaveBeenLastCalledWith('Typed');

      // resolve loading
      await Promise.resolve();

      // now we expect menu to be visible
      expect(document.querySelectorAll('[role="option"]').length).toBe(3);

      // we expect the first option to be focused
      expect(getByTestId('input').getAttribute('aria-activedescendant')).toBe(
        'root-option-0',
      );

      // now click on option b
      fireEvent.mouseDown(
        document.querySelector('[role="option"]:nth-child(2)'),
      );

      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenLastCalledWith('b');

      expect(getByTestId('input').getAttribute('value')).toBe('b');

      // we expect popup to close
      expect(document.querySelectorAll('[role="option"]').length).toBe(0);

      expect(onChange).toHaveBeenCalledTimes(2);
    });

    it('reacts to keyboard interaction', async () => {
      jest.useFakeTimers();
      const onLoadOptions = jest.fn().mockResolvedValue(['a', 'b', 'c']);
      const onChange = jest.fn();

      const { getByTestId } = render(
        <TestDesignSystem>
          <AutocompleteInput
            data-testid="input"
            id="root"
            onChange={onChange}
            options={onLoadOptions}
          />
        </TestDesignSystem>,
      );

      // now focus select
      fireEvent.focus(getByTestId('input'));

      // type something
      fireEvent.change(getByTestId('input'), { target: { value: 'Typed' } });

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenLastCalledWith('Typed');

      // debounce change
      jest.runAllTimers();

      // now expect select to be loading options
      expect(onLoadOptions).toHaveBeenCalledTimes(1);
      expect(onLoadOptions).toHaveBeenLastCalledWith('Typed');

      // resolve loading
      await Promise.resolve();

      // now we expect menu to be visible
      expect(document.querySelectorAll('[role="option"]').length).toBe(3);

      // we expect the first option to be focused
      expect(getByTestId('input').getAttribute('aria-activedescendant')).toBe(
        'root-option-0',
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
      jest.runAllTimers();

      // now expect select to be loading options
      expect(onLoadOptions).toHaveBeenCalledTimes(2);
      expect(onLoadOptions).toHaveBeenLastCalledWith('Typed value new');

      // resolve loading
      await Promise.resolve();

      // now we expect menu to be visible
      expect(document.querySelectorAll('[role="option"]').length).toBe(3);
    });
  });

  describe('controlled', () => {
    it('works correctly', async () => {
      jest.useFakeTimers();
      const onLoadOptions = jest.fn().mockResolvedValue(['a', 'b', 'c']);
      const onChange = jest.fn();

      const { getByTestId, rerender } = render(
        <TestDesignSystem>
          <AutocompleteInput
            defaultValue="a"
            data-testid="input"
            id="root"
            onChange={onChange}
            options={onLoadOptions}
            value="b"
          />
        </TestDesignSystem>,
      );

      // now focus select
      fireEvent.focus(getByTestId('input'));

      expect(getByTestId('input').getAttribute('value')).toBe('b');

      expect(onChange).not.toHaveBeenCalled();

      // now start typing
      fireEvent.change(getByTestId('input'), { target: { value: 'new' } });

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenLastCalledWith('new');
      jest.runAllTimers();

      expect(onLoadOptions).toHaveBeenCalledTimes(1);
      expect(onLoadOptions).toHaveBeenLastCalledWith('new');

      await Promise.resolve();

      // now we expect menu to be visible
      expect(document.querySelectorAll('[role="option"]').length).toBe(3);

      // we expect the first option to be focused
      expect(getByTestId('input').getAttribute('aria-activedescendant')).toBe(
        'root-option-0',
      );

      // now click on option b
      fireEvent.mouseDown(
        document.querySelector('[role="option"]:nth-child(1)'),
      );

      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenCalledWith('a');

      expect(getByTestId('input').getAttribute('value')).toBe('a');

      // we expect popup to close
      expect(document.querySelectorAll('[role="option"]').length).toBe(0);

      expect(onChange).toHaveBeenCalledTimes(2);

      rerender(
        <TestDesignSystem>
          <AutocompleteInput
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

      expect(onChange).toHaveBeenCalledTimes(2);
    });
  });
});
