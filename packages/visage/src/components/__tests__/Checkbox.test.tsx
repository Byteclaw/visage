/* eslint-disable no-irregular-whitespace */
import { fireEvent } from '@testing-library/react';
import React from 'react';
import { render, createTestTheme } from './render';
import { Checkbox } from '../Checkbox';

describe('Checkbox', () => {
  it('respects disabled prop', () => {
    const handler = jest.fn();
    const { getByTestId } = render(
      <Checkbox
        data-testid="checkbox"
        disabled
        onClick={handler}
        onKeyDown={handler}
        label=""
        labelProps={{ 'data-testid': 'label' }}
      />,
    );

    expect(getByTestId('checkbox')).toHaveAttribute('disabled');
    expect(getByTestId('label')).toHaveAttribute('data-disabled', 'true');

    fireEvent.click(getByTestId('checkbox'));
    // we don't fire a keyDown because it isn't possible to focus disabled checkbox in browser

    expect(handler).not.toHaveBeenCalled();
  });

  it('respects hiddenLabel prop', () => {
    const { getByTestId } = render(
      <Checkbox
        data-testid="checkbox"
        hiddenLabel
        label="Label"
        labelProps={{ 'data-testid': 'label' }}
        labelTextProps={{ 'data-testid': 'label-text' }}
      />,
    );

    expect(getByTestId('label-text')).toHaveAttribute('data-hidden', 'true');
  });

  it('respects invalid prop', () => {
    const props = {
      'data-testid': 'checkbox',
      label: 'Label',
      labelProps: { 'data-test-id': 'label' },
      labelTextProps: { 'date-testid': 'label-text' },
    };
    const { getByTestId, rerender } = render(<Checkbox {...props} />);

    expect(getByTestId('checkbox')).not.toHaveAttribute('aria-invalid');

    rerender(<Checkbox {...props} invalid />);

    expect(getByTestId('checkbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('respects readOnly prop', () => {
    const handler = jest.fn();
    const { getByTestId } = render(
      <Checkbox
        data-testid="checkbox"
        readOnly
        onClick={handler}
        onKeyDown={handler}
        label=""
        labelProps={{ 'data-testid': 'label' }}
      />,
    );

    // read only checkbox can be focused, clicked, etc but can't be changed
    expect(getByTestId('checkbox')).toHaveAttribute('readOnly');
    expect(getByTestId('label')).toHaveAttribute('data-readonly', 'true');

    fireEvent.click(getByTestId('checkbox'));
    fireEvent.keyDown(getByTestId('checkbox'), { key: ' ' });

    expect(getByTestId('checkbox')).not.toHaveAttribute('checked');

    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('renders correctly', () => {
    const { asFragment } = render(<Checkbox label="Required label" />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('allows to customize Toggler (uncontrolled)', () => {
    const toggler = jest.fn(() => <div />);
    const { container, rerender } = render(
      <Checkbox invalid toggler={toggler} />,
    );

    expect(toggler).toHaveBeenCalledTimes(1);
    expect(toggler).toHaveBeenCalledWith(
      {
        checked: false,
        disabled: undefined,
        focused: false,
        invalid: true,
        readOnly: undefined,
      },
      expect.anything(),
    );

    // now change the value
    fireEvent.click(container.querySelector('input[type=checkbox]'));

    expect(toggler).toHaveBeenCalledTimes(2);
    expect(toggler).toHaveBeenCalledWith(
      {
        checked: true,
        disabled: undefined,
        focused: false,
        invalid: true,
        readOnly: undefined,
      },
      expect.anything(),
    );

    fireEvent.focus(container.querySelector('input[type=checkbox]'));

    expect(toggler).toHaveBeenCalledTimes(3);
    expect(toggler).toHaveBeenCalledWith(
      {
        checked: true,
        disabled: undefined,
        focused: true,
        invalid: true,
        readOnly: undefined,
      },
      expect.anything(),
    );

    fireEvent.blur(container.querySelector('input[type=checkbox]'));

    expect(toggler).toHaveBeenCalledTimes(4);
    expect(toggler).toHaveBeenCalledWith(
      {
        checked: true,
        disabled: undefined,
        focused: false,
        invalid: true,
        readOnly: undefined,
      },
      expect.anything(),
    );

    // toggle
    fireEvent.click(container.querySelector('input[type=checkbox]'));

    expect(toggler).toHaveBeenCalledTimes(5);
    expect(toggler).toHaveBeenCalledWith(
      {
        checked: false,
        disabled: undefined,
        focused: false,
        invalid: true,
        readOnly: undefined,
      },
      expect.anything(),
    );

    // make it readonly
    rerender(<Checkbox invalid readOnly toggler={toggler} />);

    expect(toggler).toHaveBeenCalledTimes(6);
    expect(toggler).toHaveBeenCalledWith(
      {
        checked: false,
        disabled: undefined,
        focused: false,
        invalid: true,
        readOnly: true,
      },
      expect.anything(),
    );

    // toggle
    fireEvent.click(container.querySelector('input[type=checkbox]'));

    expect(toggler).toHaveBeenCalledTimes(6);
  });

  it('allows to customize Toggler (controlled)', () => {
    const toggler = jest.fn(() => <div />);
    const onChange = jest.fn();
    const { container, rerender } = render(
      <Checkbox invalid onChange={onChange} toggler={toggler} />,
    );

    expect(toggler).toHaveBeenCalledTimes(1);
    expect(toggler).toHaveBeenCalledWith(
      {
        checked: false,
        disabled: undefined,
        focused: false,
        invalid: true,
        readOnly: undefined,
      },
      expect.anything(),
    );

    // now change the value
    fireEvent.click(container.querySelector('input[type=checkbox]'));

    expect(onChange).toHaveBeenCalledTimes(1);

    // rerender as checked
    rerender(
      <Checkbox checked invalid onChange={onChange} toggler={toggler} />,
    );

    expect(toggler).toHaveBeenCalledTimes(2);
    expect(toggler).toHaveBeenCalledWith(
      {
        checked: true,
        disabled: undefined,
        focused: false,
        invalid: true,
        readOnly: undefined,
      },
      expect.anything(),
    );

    fireEvent.focus(container.querySelector('input[type=checkbox]'));

    expect(toggler).toHaveBeenCalledTimes(3);
    expect(toggler).toHaveBeenCalledWith(
      {
        checked: true,
        disabled: undefined,
        focused: true,
        invalid: true,
        readOnly: undefined,
      },
      expect.anything(),
    );

    fireEvent.blur(container.querySelector('input[type=checkbox]'));

    expect(toggler).toHaveBeenCalledTimes(4);
    expect(toggler).toHaveBeenCalledWith(
      {
        checked: true,
        disabled: undefined,
        focused: false,
        invalid: true,
        readOnly: undefined,
      },
      expect.anything(),
    );
  });

  it('is extendable by styles', () => {
    const { asFragment } = render(
      <Checkbox label="test" styles={{ color: 'pink' }} />,
    );

    // label should have color pink
    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by CheckboxLabel face', () => {
    const { asFragment } = render(<Checkbox label="test" />, {
      ds: {
        theme: createTestTheme({ CheckboxLabel: { borderRadius: 10 } }),
      },
    });

    // emotion 4 should have border-radius: 10px;
    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by CheckboxLabelText face', () => {
    const { asFragment } = render(<Checkbox label="test" />, {
      ds: {
        theme: createTestTheme({ CheckboxLabelText: { borderRadius: 10 } }),
      },
    });

    // emotion 3 should have border-radius: 10px;
    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by CheckboxControl face', () => {
    const { asFragment } = render(<Checkbox label="test" />, {
      ds: {
        theme: createTestTheme({ CheckboxControl: { borderRadius: 10 } }),
      },
    });

    // emotion 0 should have border-radius: 10px;
    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by CheckboxToggler face', () => {
    const { asFragment } = render(<Checkbox label="test" />, {
      ds: {
        theme: createTestTheme({ CheckboxToggler: { borderRadius: 10 } }),
      },
    });

    // emotion 2 should have border-radius: 10px;
    expect(asFragment()).toMatchSnapshot();
  });
});
