import { colorProps } from '../constants';
import { stylers } from '../stylers';

describe('stylers', () => {
  it.each(colorProps)('sets up %s to use color resolver', name => {
    expect(stylers[name]).toEqual({
      resolver: 'color',
    });
  });
});
