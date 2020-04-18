import React from 'react';
import { ProgressBar } from '../ProgressBar';
import { createTestTheme, render } from './render';

describe('ProgressBar', () => {
  it('works correctly', () => {
    const { container, getByTestId, rerender } = render(
      <ProgressBar progressProps={{ 'data-testid': 'p' } as any} value={0} />,
    );

    expect(container.querySelector('progress')).toHaveAttribute('max', '100');
    expect(container.querySelector('progress')).toHaveAttribute('value', '0');

    expect(getByTestId('p')).toHaveStyle({ width: '0%' });

    rerender(
      <ProgressBar progressProps={{ 'data-testid': 'p' } as any} value={50} />,
    );

    expect(container.querySelector('progress')).toHaveAttribute('max', '100');
    expect(container.querySelector('progress')).toHaveAttribute('value', '50');

    expect(getByTestId('p')).toHaveStyle({ width: '50%' });
  });

  it('works with max prop', () => {
    const { container, getByTestId, rerender } = render(
      <ProgressBar
        progressProps={{ 'data-testid': 'p' } as any}
        max={200}
        value={0}
      />,
    );

    expect(container.querySelector('progress')).toHaveAttribute('max', '200');
    expect(container.querySelector('progress')).toHaveAttribute('value', '0');

    expect(getByTestId('p')).toHaveStyle({ width: '0%' });

    rerender(
      <ProgressBar
        progressProps={{ 'data-testid': 'p' } as any}
        max={200}
        value={50}
      />,
    );

    expect(container.querySelector('progress')).toHaveAttribute('max', '200');
    expect(container.querySelector('progress')).toHaveAttribute('value', '50');

    expect(getByTestId('p')).toHaveStyle({ width: '25%' });
  });

  it('renders correctly', () => {
    const { asFragment } = render(<ProgressBar value={0} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by ProgressBar face', () => {
    const { asFragment } = render(<ProgressBar value={0} />, {
      ds: {
        theme: createTestTheme({
          ProgressBar: {
            color: 'pink',
          },
        }),
      },
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by ProgressBarProgress face', () => {
    const { asFragment } = render(<ProgressBar value={0} />, {
      ds: {
        theme: createTestTheme({
          ProgressBarProgress: {
            color: 'pink',
            fontSize: -1,
            lineHeight: -1,
          },
        }),
      },
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
