/* eslint-disable no-irregular-whitespace */
import { fireEvent } from '@testing-library/react';
import React from 'react';
import { render, createTestTheme } from './render';
import { Radio } from '../Radio';

describe('Radio', () => {
  it('respects disabled prop', () => {
    const handler = jest.fn();
    const { getByTestId } = render(
      <Radio
        data-testid="radio"
        disabled
        onClick={handler}
        onKeyDown={handler}
        label=""
        labelProps={{ 'data-testid': 'label' }}
      />,
    );

    expect(getByTestId('radio')).toHaveAttribute('disabled');
    expect(getByTestId('label')).toHaveAttribute('data-disabled', 'true');

    fireEvent.click(getByTestId('radio'));
    // we don't fire a keyDown because it isn't possible to focus disabled checkbox in browser

    expect(handler).not.toHaveBeenCalled();
  });

  it('respects hiddenLabel prop', () => {
    const { getByTestId } = render(
      <Radio
        data-testid="radio"
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
      'data-testid': 'radio',
      label: 'Label',
      labelProps: { 'data-test-id': 'label' },
      labelTextProps: { 'date-testid': 'label-text' },
    };
    const { getByTestId, rerender } = render(<Radio {...props} />);

    expect(getByTestId('radio')).not.toHaveAttribute('aria-invalid');

    rerender(<Radio {...props} invalid />);

    expect(getByTestId('radio')).toHaveAttribute('aria-invalid', 'true');
  });

  it('respects readOnly prop', () => {
    const handler = jest.fn();
    const { getByTestId } = render(
      <Radio
        data-testid="radio"
        readOnly
        onClick={handler}
        onKeyDown={handler}
        label=""
        labelProps={{ 'data-testid': 'label' }}
      />,
    );

    // read only checkbox can be focused, clicked, etc but can't be changed
    expect(getByTestId('radio')).toHaveAttribute('readOnly');
    expect(getByTestId('label')).toHaveAttribute('data-readonly', 'true');

    fireEvent.click(getByTestId('radio'));
    fireEvent.keyDown(getByTestId('radio'), { key: ' ' });

    expect(getByTestId('radio')).not.toHaveAttribute('checked');

    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('renders correctly', () => {
    const { asFragment } = render(<Radio label="Required label" />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('allows to customize Toggler (uncontrolled)', () => {
    const toggler = jest.fn(() => <div />);
    const { container, rerender } = render(<Radio invalid toggler={toggler} />);

    expect(toggler).toHaveBeenCalledTimes(1);
    expect(toggler).toHaveBeenLastCalledWith(
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
    fireEvent.click(container.querySelector('input[type=radio]'));

    expect(toggler).toHaveBeenCalledTimes(2);
    expect(toggler).toHaveBeenLastCalledWith(
      {
        checked: true,
        disabled: undefined,
        focused: false,
        invalid: true,
        readOnly: undefined,
      },
      expect.anything(),
    );

    fireEvent.focus(container.querySelector('input[type=radio]'));

    expect(toggler).toHaveBeenCalledTimes(3);
    expect(toggler).toHaveBeenLastCalledWith(
      {
        checked: true,
        disabled: undefined,
        focused: true,
        invalid: true,
        readOnly: undefined,
      },
      expect.anything(),
    );

    fireEvent.blur(container.querySelector('input[type=radio]'));

    expect(toggler).toHaveBeenCalledTimes(4);
    expect(toggler).toHaveBeenLastCalledWith(
      {
        checked: true,
        disabled: undefined,
        focused: false,
        invalid: true,
        readOnly: undefined,
      },
      expect.anything(),
    );

    // make it readonly
    rerender(
      <Radio
        defaultChecked={false}
        key="1"
        invalid
        readOnly
        toggler={toggler}
      />,
    );

    expect(toggler).toHaveBeenCalledTimes(5);
    expect(toggler).toHaveBeenLastCalledWith(
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
    fireEvent.click(container.querySelector('input[type=radio]'));

    expect(toggler).toHaveBeenCalledTimes(5);
  });

  it('allows to customize Toggler (controlled)', () => {
    const toggler = jest.fn(() => <div />);
    const onChange = jest.fn();
    const { container, rerender } = render(
      <Radio checked={false} invalid onChange={onChange} toggler={toggler} />,
    );

    expect(toggler).toHaveBeenCalledTimes(1);
    expect(toggler).toHaveBeenLastCalledWith(
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
    fireEvent.click(container.querySelector('input[type=radio]'));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(toggler).toHaveBeenCalledTimes(1);

    // rerender as checked
    rerender(<Radio checked invalid onChange={onChange} toggler={toggler} />);

    expect(toggler).toHaveBeenCalledTimes(2);
    expect(toggler).toHaveBeenLastCalledWith(
      {
        checked: true,
        disabled: undefined,
        focused: false,
        invalid: true,
        readOnly: undefined,
      },
      expect.anything(),
    );

    fireEvent.focus(container.querySelector('input[type=radio]'));

    expect(toggler).toHaveBeenCalledTimes(3);
    expect(toggler).toHaveBeenLastCalledWith(
      {
        checked: true,
        disabled: undefined,
        focused: true,
        invalid: true,
        readOnly: undefined,
      },
      expect.anything(),
    );

    fireEvent.blur(container.querySelector('input[type=radio]'));

    expect(toggler).toHaveBeenCalledTimes(4);
    expect(toggler).toHaveBeenLastCalledWith(
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
      <Radio label="test" styles={{ color: 'pink' }} />,
    );

    // label should have color pink
    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by RadioLabel face', () => {
    const { asFragment } = render(<Radio label="test" />, {
      ds: {
        theme: createTestTheme({ RadioLabel: { borderRadius: 10 } }),
      },
    });

    // emotion 4 should have border-radius: 10px;
    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by RadioLabelText face', () => {
    const { asFragment } = render(<Radio label="test" />, {
      ds: {
        theme: createTestTheme({ RadioLabelText: { borderRadius: 10 } }),
      },
    });

    // emotion 3 should have border-radius: 10px;
    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by RadioControl face', () => {
    const { asFragment } = render(<Radio label="test" />, {
      ds: {
        theme: createTestTheme({ RadioControl: { borderRadius: 10 } }),
      },
    });

    // emotion 0 should have border-radius: 10px;
    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by RadioToggler face', () => {
    const { asFragment } = render(<Radio label="test" />, {
      ds: {
        theme: createTestTheme({ RadioToggler: { borderRadius: 10 } }),
      },
    });

    // emotion 2 should have border-radius: 10px;
    expect(asFragment()).toMatchSnapshot();
  });
});
