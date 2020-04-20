import { fireEvent } from '@testing-library/react';
import React, { createRef } from 'react';
import { render, createTestTheme } from './render';
import { CloseIcon } from '../../assets';
import { IconButton } from '../IconButton';

describe('IconButton', () => {
  it('renders correctly', () => {
    const { asFragment } = render(
      <IconButton icon={CloseIcon} label="Label" />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('passes ref correctly', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <IconButton
        data-testid="button"
        icon={CloseIcon}
        label="Label"
        ref={ref}
      />,
    );

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('reacts on click event', () => {
    const onClick = jest.fn();
    const { getByTestId } = render(
      <IconButton
        data-testid="button"
        icon={CloseIcon}
        label="Label"
        onClick={onClick}
      />,
    );

    fireEvent.click(getByTestId('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is extendable by styles prop', () => {
    const { asFragment } = render(
      <IconButton
        icon={CloseIcon}
        label="Label"
        styles={{ borderRadius: '12px' }}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by IconButton face', () => {
    const { asFragment } = render(
      <IconButton icon={CloseIcon} label="Label" />,
      {
        ds: {
          theme: createTestTheme({
            IconButton: {
              borderRadius: '12px',
            },
          }),
        },
      },
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
