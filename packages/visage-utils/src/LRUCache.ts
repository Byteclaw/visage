/* eslint-disable no-param-reassign */

interface LRUCacheRecord {
  key: any;
  value: any;
  prev: LRUCacheRecord | undefined;
  next: LRUCacheRecord | undefined;
}

export class LRUCache<TKey extends string = string, TValue = any> {
  private hash: Map<TKey, LRUCacheRecord>;

  private head: LRUCacheRecord | undefined;

  private maxSize: number;

  private tail: LRUCacheRecord | undefined;

  constructor(maxSize: number = 100) {
    this.hash = new Map();
    this.maxSize = maxSize;
  }

  has(key: TKey): boolean {
    const hit = this.hash.get(key);

    if (hit) {
      this.moveToStart(hit);

      return true;
    }

    return false;
  }

  get(key: TKey): TValue | undefined {
    const hit = this.hash.get(key);

    if (hit) {
      this.moveToStart(hit);

      return hit.value;
    }

    return hit;
  }

  get size(): number {
    return this.hash.size;
  }

  set(key: TKey, value: TValue): TValue {
    const record = { key, prev: undefined, value, next: this.head };

    this.hash.set(key, record);
    this.head = record;

    if (this.head.next) {
      this.head.next.prev = this.head;
    }

    if (!this.tail) {
      this.tail = this.head;
    }

    if (this.hash.size > this.maxSize && this.tail) {
      // remove last record
      this.hash.delete(this.tail.key);
      const { tail } = this;

      this.tail = tail.prev;
      tail.prev = undefined;
      tail.next = undefined;

      if (this.tail) {
        this.tail.next = undefined;
      }
    }

    return value;
  }

  private moveToStart(record: LRUCacheRecord) {
    if (this.head === record) {
      return;
    }

    if (this.tail === record) {
      record.prev!.next = undefined;
      this.tail = record.prev;
    } else {
      record.prev!.next = record.next;
      record.next!.prev = record.prev;
    }

    this.head!.prev = record;
    record.next = this.head;
    record.prev = undefined;
    this.head = record;
  }
}
