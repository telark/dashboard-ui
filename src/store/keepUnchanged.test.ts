import { describe, expect, it } from 'vitest';
import { keepUnchanged } from './keepUnchanged';

interface Item {
  id: string;
  v: number;
}

const keyOf = (item: Item) => item.id;

describe('keepUnchanged', () => {
  const a: Item = { id: 'a', v: 1 };
  const b: Item = { id: 'b', v: 1 };

  it('keeps the same array when nothing changed', () => {
    const previous = [a, b];

    expect(keepUnchanged(previous, [{ ...a }, { ...b }], keyOf)).toBe(previous);
  });

  it('keeps unchanged items and takes the changed and new ones', () => {
    const changed = { ...b, v: 2 };
    const added = { id: 'c', v: 1 };

    const merged = keepUnchanged([a, b], [{ ...a }, changed, added], keyOf);

    expect(merged[0]).toBe(a);
    expect(merged[1]).toBe(changed);
    expect(merged[2]).toBe(added);
  });

  it('returns a new array when an item went away', () => {
    const previous = [a, b];

    const merged = keepUnchanged(previous, [{ ...a }], keyOf);

    expect(merged).toEqual([a]);
    expect(merged).not.toBe(previous);
  });
});
