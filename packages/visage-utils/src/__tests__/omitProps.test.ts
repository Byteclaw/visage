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

  it('applies null default value correctly', () => {
    expect(
      omitProps({ b: 2, c: 3 }, [
        {
          prop: 'isActive',
          name: 'isactive',
          stripProp: true,
          defaultValue: null,
        },
      ]),
    ).toEqual({
      b: 2,
      c: 3,
      'data-isactive': null,
    });

    expect(
      omitProps({ isActive: false, b: 2, c: 3 }, [
        {
          prop: 'isActive',
          name: 'isactive',
          stripProp: true,
          defaultValue: null,
        },
      ]),
    ).toEqual({
      b: 2,
      c: 3,
      'data-isactive': false,
    });

    expect(
      omitProps({ isActive: null, b: 2, c: 3 }, [
        {
          prop: 'isActive',
          name: 'isactive',
          stripProp: true,
          defaultValue: null,
        },
      ]),
    ).toEqual({
      b: 2,
      c: 3,
      'data-isactive': null,
    });

    expect(
      omitProps({ isActive: true, b: 2, c: 3 }, [
        {
          prop: 'isActive',
          name: 'isactive',
          stripProp: true,
          defaultValue: null,
        },
      ]),
    ).toEqual({
      b: 2,
      c: 3,
      'data-isactive': true,
    });
  });

  it('applies false default value correctly', () => {
    expect(
      omitProps({ b: 2, c: 3 }, [
        {
          prop: 'isActive',
          name: 'isactive',
          stripProp: true,
          defaultValue: false,
        },
      ]),
    ).toEqual({
      b: 2,
      c: 3,
      'data-isactive': false,
    });

    expect(
      omitProps({ isActive: false, b: 2, c: 3 }, [
        {
          prop: 'isActive',
          name: 'isactive',
          stripProp: true,
          defaultValue: false,
        },
      ]),
    ).toEqual({
      b: 2,
      c: 3,
      'data-isactive': false,
    });

    expect(
      omitProps({ isActive: null, b: 2, c: 3 }, [
        {
          prop: 'isActive',
          name: 'isactive',
          stripProp: true,
          defaultValue: false,
        },
      ]),
    ).toEqual({
      b: 2,
      c: 3,
      'data-isactive': null,
    });

    expect(
      omitProps({ isActive: true, b: 2, c: 3 }, [
        {
          prop: 'isActive',
          name: 'isactive',
          stripProp: true,
          defaultValue: false,
        },
      ]),
    ).toEqual({
      b: 2,
      c: 3,
      'data-isactive': true,
    });
  });

  it('applies true default value correctly', () => {
    expect(
      omitProps({ b: 2, c: 3 }, [
        {
          prop: 'isActive',
          name: 'isactive',
          stripProp: true,
          defaultValue: true,
        },
      ]),
    ).toEqual({
      b: 2,
      c: 3,
      'data-isactive': true,
    });

    expect(
      omitProps({ isActive: false, b: 2, c: 3 }, [
        {
          prop: 'isActive',
          name: 'isactive',
          stripProp: true,
          defaultValue: true,
        },
      ]),
    ).toEqual({
      b: 2,
      c: 3,
      'data-isactive': false,
    });

    expect(
      omitProps({ isActive: null, b: 2, c: 3 }, [
        {
          prop: 'isActive',
          name: 'isactive',
          stripProp: true,
          defaultValue: true,
        },
      ]),
    ).toEqual({
      b: 2,
      c: 3,
      'data-isactive': null,
    });

    expect(
      omitProps({ isActive: true, b: 2, c: 3 }, [
        {
          prop: 'isActive',
          name: 'isactive',
          stripProp: true,
          defaultValue: true,
        },
      ]),
    ).toEqual({
      b: 2,
      c: 3,
      'data-isactive': true,
    });
  });
});
