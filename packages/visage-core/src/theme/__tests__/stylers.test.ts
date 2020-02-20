import { colorProps } from '../constants';
import { stylers } from '../stylers';

describe('stylers', () => {
  it.each(colorProps)('sets up %s to use color resolver', name => {
    expect(stylers[name]).toEqual({
      resolver: 'color',
    });
  });

  it('sets up fontFamily to use fontFamily resolver', () => {
    expect(stylers.fontFamily).toEqual({
      resolver: 'fontFamily',
    });
  });

  it('sets up catchAll to use themeKey resolver', () => {
    expect(stylers.catchAll).toEqual({
      resolver: 'themeKey',
    });
  });
});
