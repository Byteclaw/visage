import { depthFirstObjectMerge } from '../depthFirstObjectMerge';

describe('depthFirstObjectMerge', () => {
  it('works correctly', () => {
    const a = {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
    };
    const b = {
      b: {
        a: 1,
        b: {
          c: 3,
        },
      },
      d: 5,
    };
    const c = {
      a: 2,
      c: 3,
      b: {
        a: 2,
        c: 4,
        b: {
          c: 4,
          b: 5,
        },
      },
    };
    const result = depthFirstObjectMerge<{ [key: string]: any }>(a, b, c);

    expect(result).toMatchInlineSnapshot(`
                  Object {
                    "a": 2,
                    "b": Object {
                      "a": 2,
                      "b": Object {
                        "b": 5,
                        "c": 4,
                      },
                      "c": 4,
                    },
                    "c": 3,
                    "d": 5,
                  }
            `);

    expect(depthFirstObjectMerge({}, {}, { a: 1 })).toMatchInlineSnapshot(`
      Object {
        "a": 1,
      }
    `);
  });
});
