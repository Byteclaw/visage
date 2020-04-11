import { LRUCache } from '../LRUCache';

describe('LRUCache', () => {
  it('works correctly', () => {
    const cache = new LRUCache(3);

    expect(cache.size).toBe(0);

    cache.set('test', 10);
    cache.set('test1', 11);
    cache.set('test2', 12);

    expect(cache.size).toBe(3);

    // assign one more item, this will result in test to be removed
    cache.set('test3', 13);

    expect(cache.size).toBe(3);
    expect(cache.has('test')).toBe(false);
    expect(cache.get('test')).toBeUndefined();

    // now visit test1 so it moves to the start
    expect(cache.has('test1')).toBe(true);
    expect(cache.size).toBe(3);

    // now new addition will remove test2
    cache.set('test4', 14);

    expect(cache.size).toBe(3);
    expect(cache.has('test2')).toBe(false);

    // now add 3 new
    cache.set('test5', 15);
    cache.set('test6', 16);
    cache.set('test7', 17);

    expect(cache.size).toBe(3);

    expect(cache.has('test5')).toBe(true);
    expect(cache.has('test6')).toBe(true);
    expect(cache.has('test7')).toBe(true);

    cache.set('test8', 18);
    cache.set('test9', 19);
    cache.set('test10', 20);

    expect(cache.size).toBe(3);
  });
});
