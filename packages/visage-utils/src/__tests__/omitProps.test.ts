import { omitProps } from '../omitProps';

describe('omitProps', () => {
  it('works correctly', () => {
    expect(
      omitProps({ a: 1, b: 2, c: 3 }, [
        { prop: 'a', name: 'a', stripProp: true },
        { prop: 'b', name: 'b' },
      ]),
    ).toEqual({
      a: undefined,
      b: 2,
      c: 3,
      'data-a': 1,
      'data-b': 2,
    });
  });

  it('works correctly with camelCased', () => {
    expect(
      omitProps({ isActive: true, b: 2, c: 3 }, [
        { prop: 'isActive', name: 'isactive', stripProp: true },
      ]),
    ).toEqual({
      b: 2,
      c: 3,
      'data-isactive': true,
    });
  });
});
