import React from 'react';
import { render, createTestTheme } from './render';
import { TextInput } from '../TextInput';

describe('TextInput', () => {
  it('render correctly', () => {
    const { asFragment } = render(<TextInput />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by TextInputBase face', () => {
    const { asFragment } = render(<TextInput />, {
      ds: {
        theme: createTestTheme({ TextInputBase: { borderRadius: 10 } }),
      },
    });

    // emotion 2 should have border-radius: 10px;
    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by TextInputControl face', () => {
    const { asFragment } = render(<TextInput />, {
      ds: {
        theme: createTestTheme({
          TextInputControl: {
            borderRadius: 10,
            '::placeholder': { opacity: 1, color: 'pink' },
          },
        }),
      },
    });

    // emotion-0 should have border-radius: 10px; and placeholder styles
    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by TextInputControlBase face', () => {
    const { asFragment } = render(<TextInput />, {
      ds: {
        theme: createTestTheme({
          TextInputControlBase: { borderRadius: 10 },
        }),
      },
    });

    // emotion-1 should have border-radius: 10px;
    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by TextInputExtraElement face', () => {
    const { asFragment } = render(<TextInput prefix={<span>P</span>} />, {
      ds: {
        theme: createTestTheme({
          TextInputExtraElement: {
            borderRadius: 10,
            '&:hover': { color: 'pink' },
          },
        }),
      },
    });

    // emotion-0 should have border-radius: 10px; and hover color pink
    expect(asFragment()).toMatchSnapshot();
  });
});
