import React from 'react';
import { Divider } from '../Divider';
import { createTestTheme, render } from './render';

describe('Divider', () => {
  it('renders correctly (horizontal - default)', () => {
    const { asFragment } = render(<Divider />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly with a label', () => {
    const { asFragment } = render(<Divider label="OR" />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly as vertical', () => {
    const { asFragment } = render(<Divider vertical />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly as vertical with a label', () => {
    const { asFragment } = render(<Divider label="OR" vertical />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by Divider face', () => {
    const { asFragment } = render(<Divider label="OR" />, {
      ds: {
        theme: createTestTheme({
          Divider: {
            color: 'black',
          },
        }),
      },
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by DividerLine face', () => {
    const { asFragment } = render(<Divider label="OR" />, {
      ds: {
        theme: createTestTheme({
          DividerLine: {
            color: 'black',
          },
        }),
      },
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by DividerLabel face', () => {
    const { asFragment } = render(<Divider label="OR" />, {
      ds: {
        theme: createTestTheme({
          DividerLabel: {
            color: 'black',
          },
        }),
      },
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
