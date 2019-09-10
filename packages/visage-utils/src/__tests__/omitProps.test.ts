import { omitProps } from '../omitProps';

describe('omitProps', () => {
  it('works correctly', () => {
    expect(
      omitProps({ a: 1, b: 2, c: 3 }, [
        { name: 'a', stripProp: true },
        { name: 'b' },
      ]),
    ).toEqual({
      a: undefined,
      b: 2,
      c: 3,
      'data-a': 1,
      'data-b': 2,
    });
  });
});
