import React from 'react';
import { KeyboardKey } from '../KeyboardKey';
import { createTestTheme, render } from './render';

describe('KeyboardKey', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<KeyboardKey />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by KeyboardKey face', () => {
    const { asFragment } = render(<KeyboardKey />, {
      ds: {
        theme: createTestTheme({
          KeyboardKey: {
            borderRadius: '10px',
          },
        }),
      },
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
