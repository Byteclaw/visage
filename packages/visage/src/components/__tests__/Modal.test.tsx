import React from 'react';
import { render } from './render';
import { Modal } from '../Modal';

describe('Modal', () => {
  it('is extendable using styles prop', () => {
    const { getByTestId } = render(
      <Modal data-testid="base-modal" styles={{ backgroundColor: 'pink' }}>
        <span>Open</span>
      </Modal>,
    );

    expect(getByTestId('base-modal')).toHaveAttribute('data-zindex', '101');
    expect(getByTestId('base-modal')).toHaveStyle({
      backgroundColor: 'rgb(255, 192, 203)',
    });
  });
});
