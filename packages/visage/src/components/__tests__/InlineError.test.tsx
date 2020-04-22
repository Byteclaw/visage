import React from 'react';
import { createTestTheme, render } from './render';
import { InlineError } from '../InlineError';

describe('InlineError', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<InlineError>This is an error</InlineError>);

    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by InlineError face', () => {
    const { asFragment } = render(<InlineError>This is an error</InlineError>, {
      ds: {
        theme: createTestTheme({
          InlineError: {
            color: 'blue',
          },
        }),
      },
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by InlineErrorIcon face', () => {
    const { asFragment } = render(<InlineError>This is an error</InlineError>, {
      ds: {
        theme: createTestTheme({
          InlineErrorIcon: {
            color: 'blue',
          },
        }),
      },
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by styles prop', () => {
    const { asFragment } = render(
      <InlineError styles={{ color: 'blue' }}>This is an error</InlineError>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
