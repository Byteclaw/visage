import { fireEvent } from '@testing-library/react';
import React from 'react';
import { render, createTestTheme } from './render';
import { SpinButton } from '../SpinButton';

describe('SpinButton', () => {
  it('render correctly', () => {
    const { asFragment } = render(<SpinButton values={[1, 2, 3, 4]} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('can be uncontrolled', () => {
    const { getByTestId, rerender } = render(
      <SpinButton
        data-testid="valuediv"
        nextButtonProps={{ 'data-testid': 'next' } as any}
        previousButtonProps={{ 'data-testid': 'prev' } as any}
        values={[1, 2, 3, 4]}
      />,
    );

    // automatically inferred based on values length
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuemin', '0');
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuemax', '3');
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuenow', '0');
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuetext', '1');

    // increment by click
    fireEvent.mouseDown(getByTestId('next'));

    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuenow', '1');
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuetext', '2');

    // decrement by click
    fireEvent.mouseDown(getByTestId('prev'));

    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuenow', '0');
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuetext', '1');

    // now try to increment value
    fireEvent.keyDown(getByTestId('valuediv'), { key: 'ArrowDown' });

    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuenow', '1');
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuetext', '2');

    // now try to increment value
    fireEvent.keyDown(getByTestId('valuediv'), { key: 'ArrowDown' });
    fireEvent.keyDown(getByTestId('valuediv'), { key: 'ArrowDown' });
    // back to first
    fireEvent.keyDown(getByTestId('valuediv'), { key: 'ArrowDown' });

    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuenow', '0');
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuetext', '1');

    // back to last
    fireEvent.keyDown(getByTestId('valuediv'), { key: 'ArrowUp' });

    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuenow', '3');
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuetext', '4');

    // back to first
    fireEvent.keyDown(getByTestId('valuediv'), { key: 'ArrowDown' });

    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuenow', '0');
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuetext', '1');

    rerender(<SpinButton data-testid="valuediv" values={[1, 2, 3, 4, 5, 6]} />);

    // by 5 steps (goes to last)
    fireEvent.keyDown(getByTestId('valuediv'), { key: 'PageDown' });

    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuenow', '5');
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuetext', '6');

    // by 5 steps (goes to first)
    fireEvent.keyDown(getByTestId('valuediv'), { key: 'PageUp' });

    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuenow', '0');
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuetext', '1');

    // go to end
    fireEvent.keyDown(getByTestId('valuediv'), { key: 'End' });

    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuenow', '5');
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuetext', '6');

    // go to start
    fireEvent.keyDown(getByTestId('valuediv'), { key: 'Home' });

    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuenow', '0');
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuetext', '1');

    // make it disabled
    rerender(
      <SpinButton
        data-testid="valuediv"
        disabled
        nextButtonProps={{ 'data-testid': 'next' } as any}
        previousButtonProps={{ 'data-testid': 'prev' } as any}
        values={[1, 2, 3, 4, 5, 6]}
      />,
    );

    expect(getByTestId('valuediv')).toHaveAttribute('aria-disabled', 'true');

    // key down does nothing
    fireEvent.keyDown(getByTestId('valuediv'), { key: 'End' });

    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuenow', '0');
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuetext', '1');

    // click does nothing
    fireEvent.mouseDown(getByTestId('next'));

    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuenow', '0');
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuetext', '1');

    // now make it read only
    rerender(
      <SpinButton
        data-testid="valuediv"
        readOnly
        nextButtonProps={{ 'data-testid': 'next' } as any}
        previousButtonProps={{ 'data-testid': 'prev' } as any}
        values={[1, 2, 3, 4, 5, 6]}
      />,
    );

    expect(getByTestId('valuediv')).toHaveAttribute('aria-readonly', 'true');

    // key down does nothing
    fireEvent.keyDown(getByTestId('valuediv'), { key: 'End' });

    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuenow', '0');
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuetext', '1');

    // click does nothing
    fireEvent.mouseDown(getByTestId('next'));

    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuenow', '0');
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuetext', '1');
  });

  it('deals with values length change correctly', () => {
    const { getByTestId, rerender } = render(
      <SpinButton data-testid="valuediv" values={[1, 2, 3, 4]} />,
    );

    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuemin', '0');
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuemax', '3');
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuenow', '0');
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuetext', '1');

    // select 4
    fireEvent.keyDown(getByTestId('valuediv'), { key: 'End' });

    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuetext', '4');

    // now change values length
    rerender(<SpinButton data-testid="valuediv" values={[1, 2]} />);

    // expect value to be initial one
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuemin', '0');
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuemax', '1');
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuenow', '0');
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuetext', '1');
  });

  it('can be controlled', () => {
    const onChange = jest.fn();
    const { getByTestId, rerender } = render(
      <SpinButton<number>
        data-testid="valuediv"
        nextButtonProps={{ 'data-testid': 'next' } as any}
        previousButtonProps={{ 'data-testid': 'prev' } as any}
        value={1}
        values={[1, 2, 3, 4]}
      />,
    );

    // automatically inferred based on values length
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuemin', '0');
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuemax', '3');
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuenow', '0');
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuetext', '1');

    // increment by click
    fireEvent.mouseDown(getByTestId('next'));

    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuenow', '0');
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuetext', '1');

    // now propagate the change
    rerender(
      <SpinButton<number>
        data-testid="valuediv"
        nextButtonProps={{ 'data-testid': 'next' } as any}
        onChange={onChange}
        previousButtonProps={{ 'data-testid': 'prev' } as any}
        value={2}
        values={[1, 2, 3, 4]}
      />,
    );

    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuenow', '1');
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuetext', '2');

    // now add onChange so it will start to work
    rerender(
      <SpinButton<number>
        data-testid="valuediv"
        nextButtonProps={{ 'data-testid': 'next' } as any}
        onChange={onChange}
        previousButtonProps={{ 'data-testid': 'prev' } as any}
        value={1}
        values={[1, 2, 3, 4]}
      />,
    );

    // increment by click
    fireEvent.mouseDown(getByTestId('next'));

    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuenow', '0');
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuetext', '1');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(2);

    // now it does nothing for disabled
    rerender(
      <SpinButton<number>
        data-testid="valuediv"
        disabled
        nextButtonProps={{ 'data-testid': 'next' } as any}
        onChange={onChange}
        previousButtonProps={{ 'data-testid': 'prev' } as any}
        value={1}
        values={[1, 2, 3, 4]}
      />,
    );

    // increment by click
    fireEvent.mouseDown(getByTestId('next'));

    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuenow', '0');
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuetext', '1');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(2);

    // now it does nothing for read only
    rerender(
      <SpinButton<number>
        data-testid="valuediv"
        readOnly
        nextButtonProps={{ 'data-testid': 'next' } as any}
        onChange={onChange}
        previousButtonProps={{ 'data-testid': 'prev' } as any}
        value={1}
        values={[1, 2, 3, 4]}
      />,
    );

    // increment by click
    fireEvent.mouseDown(getByTestId('next'));

    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuenow', '0');
    expect(getByTestId('valuediv')).toHaveAttribute('aria-valuetext', '1');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('is extendable by SpinButtonBase face', () => {
    const { asFragment } = render(<SpinButton values={[1, 2, 3, 4]} />, {
      ds: {
        theme: createTestTheme({ SpinButtonBase: { borderRadius: 10 } }),
      },
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by SpinButtonButton face', () => {
    const { asFragment } = render(<SpinButton values={[1, 2, 3, 4]} />, {
      ds: {
        theme: createTestTheme({
          SpinButtonButton: {
            borderRadius: 10,
          },
        }),
      },
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by SpinButtonValue face', () => {
    const { asFragment } = render(<SpinButton values={[1, 2, 3, 4]} />, {
      ds: {
        theme: createTestTheme({
          SpinButtonValue: { borderRadius: 10 },
        }),
      },
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by SpinButtonOtherValue face', () => {
    const { asFragment } = render(<SpinButton values={[1, 2, 3, 4]} />, {
      ds: {
        theme: createTestTheme({
          SpinButtonOtherValue: {
            borderRadius: 10,
          },
        }),
      },
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by styles prop', () => {
    const { asFragment } = render(
      <SpinButton styles={{ borderRadius: 10 }} values={[1, 2, 3, 4]} />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
