import { formatters } from '../formatters';
import { ThemeFormatterAndResolverContext } from '../types';

describe('formatters', () => {
  const ctx: ThemeFormatterAndResolverContext = {} as any;

  describe('px', () => {
    it('returns a number as pixels', () => {
      expect(formatters.px('', 10, ctx)).toEqual('10px');
      expect(formatters.px('', 10.1, ctx)).toEqual('10px');
    });

    it('returns any other value as is', () => {
      expect(formatters.px('', '10em', ctx)).toEqual('10em');
    });
  });

  describe('sizeUnit', () => {
    it('returns a number as pixels', () => {
      expect(formatters.sizeUnit('', 10, ctx)).toEqual('10px');
      expect(formatters.sizeUnit('', 10.1, ctx)).toEqual('10.1%');
    });

    it('returns any other value as is', () => {
      expect(formatters.sizeUnit('', '10em', ctx)).toEqual('10em');
    });
  });
});
