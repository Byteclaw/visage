import { fireEvent } from '@testing-library/react';
import React from 'react';
import { render } from './render';
import { Menu, MenuItem } from '../Menu';

describe('Menu', () => {
  it('automatically focuses first item on open and navigates using arrows', () => {
    const onFocus = jest.fn();
    const anchor = document.createElement('div');
    document.body.append(anchor);

    render(
      <Menu anchor={anchor} open>
        <MenuItem onFocus={() => onFocus('A')}>A</MenuItem>
        <MenuItem onFocus={() => onFocus('B')}>B</MenuItem>
        <div />
        <MenuItem onFocus={() => onFocus('C')}>C</MenuItem>
      </Menu>,
    );

    // expect first to be focused
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onFocus).toHaveBeenCalledWith('A');

    // now push arrow down to select B
    fireEvent.keyDown(
      document.querySelector('[role="menuitem"]:nth-child(1)'),
      { key: 'ArrowDown' },
    );

    expect(onFocus).toHaveBeenCalledTimes(2);
    expect(onFocus).toHaveBeenCalledWith('B');

    // select C
    fireEvent.keyDown(
      document.querySelector('[role="menuitem"]:nth-child(2)'),
      { key: 'ArrowDown' },
    );

    expect(onFocus).toHaveBeenCalledTimes(3);
    expect(onFocus).toHaveBeenCalledWith('C');

    // arrow down should select A again
    fireEvent.keyDown(
      document.querySelector('[role="menuitem"]:nth-child(4)'),
      { key: 'ArrowDown' },
    );

    expect(onFocus).toHaveBeenCalledTimes(4);
    expect(onFocus).toHaveBeenCalledWith('A');

    // arrow up should select C again
    fireEvent.keyDown(
      document.querySelector('[role="menuitem"]:nth-child(1)'),
      { key: 'ArrowUp' },
    );

    expect(onFocus).toHaveBeenCalledTimes(5);
    expect(onFocus).toHaveBeenCalledWith('C');
  });

  it('does not autofocus first item if disableAutoFocusItem is provided', () => {
    const onFocus = jest.fn();
    const anchor = document.createElement('div');
    document.body.append(anchor);

    render(
      <Menu anchor={anchor} disableAutoFocusItem open>
        <MenuItem onFocus={() => onFocus('A')}>A</MenuItem>
        <MenuItem onFocus={() => onFocus('B')}>B</MenuItem>
        <div />
        <MenuItem onFocus={() => onFocus('C')}>C</MenuItem>
      </Menu>,
    );

    expect(onFocus).not.toHaveBeenCalled();

    // arrow down selects A
    fireEvent.keyDown(document.querySelector('[role="menu"]'), {
      key: 'ArrowDown',
    });

    expect(onFocus).toBeCalledTimes(1);
    expect(onFocus).toBeCalledWith('A');
  });

  it('does not react to keyboard events if disableEvents is provided', () => {
    const onFocus = jest.fn();
    const anchor = document.createElement('div');
    document.body.append(anchor);

    render(
      <Menu anchor={anchor} disableEvents open>
        <MenuItem onFocus={() => onFocus('A')}>A</MenuItem>
        <MenuItem onFocus={() => onFocus('B')}>B</MenuItem>
        <div />
        <MenuItem onFocus={() => onFocus('C')}>C</MenuItem>
      </Menu>,
    );

    expect(onFocus).not.toHaveBeenCalled();

    fireEvent.keyDown(document.querySelector('[role="menu"]'), {
      key: 'ArrowDown',
    });

    expect(onFocus).not.toBeCalled();
  });
});
