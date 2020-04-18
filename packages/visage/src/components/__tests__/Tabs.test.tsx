import React from 'react';
import { fireEvent } from '@testing-library/react';
import { Tab, Tabs } from '../Tabs';
import { createTestTheme, render } from './render';

describe('Tabs', () => {
  it('renders correctly', () => {
    const { asFragment, getByText, getByTestId } = render(
      <Tabs>
        <Tab label="Tab 1" data-testid="content1">
          Content 1
        </Tab>
        <Tab disabled label="Tab 2" data-testid="content2">
          Content 2
        </Tab>
        <Tab label="Tab 3" data-testid="content3">
          Content 3
        </Tab>
      </Tabs>,
    );

    expect(asFragment()).toMatchSnapshot();

    expect(getByText('Tab 1')).toHaveAttribute('aria-selected', 'true');
    expect(getByTestId('content1')).not.toHaveAttribute('hidden');
  });

  it('works correctly with mouse interaction', () => {
    const { getByText, getByTestId } = render(
      <Tabs>
        <Tab label="Tab 1" data-testid="content1">
          Content 1
        </Tab>
        <Tab disabled label="Tab 2" data-testid="content2">
          Content 2
        </Tab>
        <Tab label="Tab 3" data-testid="content3">
          Content 3
        </Tab>
      </Tabs>,
    );

    expect(getByText('Tab 1')).toHaveAttribute('aria-selected', 'true');
    expect(getByTestId('content1')).not.toHaveAttribute('hidden');

    // click on tab 2 (disabled) does not cause anything
    fireEvent.click(getByText('Tab 2'));

    expect(getByText('Tab 1')).toHaveAttribute('aria-selected', 'true');
    expect(getByTestId('content1')).not.toHaveAttribute('hidden');

    // click on tab 2 (disabled) does not cause anything
    fireEvent.click(getByText('Tab 3'));

    expect(getByText('Tab 3')).toHaveAttribute('aria-selected', 'true');
    expect(getByTestId('content3')).not.toHaveAttribute('hidden');
  });

  it('works correctly with keyboard interaction', () => {
    const { getByText, getByTestId } = render(
      <Tabs>
        <Tab label="Tab 1" data-testid="content1">
          Content 1
        </Tab>
        <Tab disabled label="Tab 2" data-testid="content2">
          Content 2
        </Tab>
        <Tab label="Tab 3" data-testid="content3">
          Content 3
        </Tab>
      </Tabs>,
    );

    expect(getByText('Tab 1')).toHaveAttribute('aria-selected', 'true');
    expect(getByTestId('content1')).not.toHaveAttribute('hidden');

    // focus first button
    fireEvent.focus(getByText('Tab 1'));

    expect(getByText('Tab 1')).toHaveAttribute('aria-selected', 'true');
    expect(getByTestId('content1')).not.toHaveAttribute('hidden');

    // now move to the right, move focus to Tab 3
    fireEvent.keyDown(getByText('Tab 1'), { key: 'ArrowRight' });

    expect(getByText('Tab 3')).toHaveFocus();

    // now press enter
    fireEvent.keyDown(getByText('Tab 3'), { key: 'Enter' });

    expect(getByText('Tab 3')).toHaveAttribute('aria-selected', 'true');
    expect(getByTestId('content3')).not.toHaveAttribute('hidden');

    // now press Home, moves focus to Tab 1
    fireEvent.keyDown(getByText('Tab 3'), { key: 'Home' });

    expect(getByText('Tab 1')).toHaveFocus();

    // now press space to active tab
    fireEvent.keyDown(getByText('Tab 1'), { key: ' ' });

    expect(getByText('Tab 1')).toHaveAttribute('aria-selected', 'true');
    expect(getByTestId('content1')).not.toHaveAttribute('hidden');

    // now press End to move focus to Tab 3
    fireEvent.keyDown(getByText('Tab 1'), { key: 'End' });

    expect(getByText('Tab 3')).toHaveFocus();

    // now press arrow right, to focus Tab 1
    fireEvent.keyDown(getByText('Tab 1'), { key: 'ArrowRight' });

    expect(getByText('Tab 1')).toHaveFocus();

    // now press arrow left, to focus Tab 3
    fireEvent.keyDown(getByText('Tab 1'), { key: 'ArrowLeft' });

    expect(getByText('Tab 3')).toHaveFocus();
  });

  it('is extendable by Tabs face', () => {
    const { asFragment } = render(
      <Tabs>
        <Tab label="Tab 1" data-testid="content1">
          Content 1
        </Tab>
        <Tab disabled label="Tab 2" data-testid="content2">
          Content 2
        </Tab>
        <Tab label="Tab 3" data-testid="content3">
          Content 3
        </Tab>
      </Tabs>,
      {
        ds: {
          theme: createTestTheme({
            Tabs: {
              backgroundColor: 'pink',
            },
          }),
        },
      },
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by TabList face', () => {
    const { asFragment } = render(
      <Tabs>
        <Tab label="Tab 1" data-testid="content1">
          Content 1
        </Tab>
        <Tab disabled label="Tab 2" data-testid="content2">
          Content 2
        </Tab>
        <Tab label="Tab 3" data-testid="content3">
          Content 3
        </Tab>
      </Tabs>,
      {
        ds: {
          theme: createTestTheme({
            TabList: {
              borderColor: 'pink',
            },
          }),
        },
      },
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('is extendable by TabNavigationButton face', () => {
    const { asFragment } = render(
      <Tabs>
        <Tab label="Tab 1" data-testid="content1">
          Content 1
        </Tab>
        <Tab disabled label="Tab 2" data-testid="content2">
          Content 2
        </Tab>
        <Tab label="Tab 3" data-testid="content3">
          Content 3
        </Tab>
      </Tabs>,
      {
        ds: {
          theme: createTestTheme({
            TabNavigationButton: {
              color: 'pink',
            },
          }),
        },
      },
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
