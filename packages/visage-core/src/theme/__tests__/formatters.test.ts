import { createTheme } from '../createTheme';
import { StylerSheetResolveContext } from '../../styleSheet';

describe('formatters', () => {
  const ctx: StylerSheetResolveContext = {
    breakpoint: 0,
    ...createTheme({}),
  };

  describe('px', () => {
    it('returns a number as pixels', () => {
      expect(ctx.format('px', 10, ctx)).toEqual('10px');
      expect(ctx.format('px', 10.1, ctx)).toEqual('10px');
    });

    it('returns any other value as is', () => {
      expect(ctx.format('px', '10em', ctx)).toEqual('10em');
    });
  });

  describe('sizeUnit', () => {
    it('returns a number as pixels', () => {
      expect(ctx.format('sizeUnit', 10, ctx)).toEqual('10px');
      expect(ctx.format('sizeUnit', 10.1, ctx)).toEqual('10.1%');
    });

    it('returns any other value as is', () => {
      expect(ctx.format('sizeUnit', '10em', ctx)).toEqual('10em');
    });
  });
});
