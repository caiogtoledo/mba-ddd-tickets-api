export interface ICollection<T extends object> {
  getItems(): Iterable<T>;
  add(item: T, ...items: T[]): void;
  remove(item: T, ...items: T[]): void;
  find(predicate: (item: T) => boolean): T | undefined;
  forEach(callbackfn: (value: T, index: number) => void): void;
  map<U>(callbackfn: (value: T, index: number) => U): U[];
  removeAll(): void;
  count(): number;
  size: number;
  values(): T[];
  [Symbol.iterator](): IterableIterator<T>;
}

export type AnyCollection<T extends object> = T[]; // ou ICollection<T>, se quiser manter consistência

class ArrayCollection<T extends object> implements ICollection<T> {
  private items: T[];

  constructor(initialItems?: T[]) {
    this.items = initialItems ? [...initialItems] : [];
  }

  getItems(): Iterable<T> {
    return this.items;
  }

  add(item: T, ...items: T[]): void {
    this.items.push(item, ...items);
  }

  remove(item: T, ...items: T[]): void {
    [item, ...items].forEach((i) => {
      const index = this.items.indexOf(i);
      if (index !== -1) this.items.splice(index, 1);
    });
  }

  find(predicate: (item: T) => boolean): T | undefined {
    return this.items.find(predicate);
  }

  forEach(callbackfn: (value: T, index: number) => void): void {
    this.items.forEach(callbackfn);
  }

  map<U>(callbackfn: (value: T, index: number) => U): U[] {
    return this.items.map(callbackfn);
  }

  removeAll(): void {
    this.items = [];
  }

  count(): number {
    return this.items.length;
  }

  get size(): number {
    return this.items.length;
  }

  values(): T[] {
    return [...this.items];
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.items[Symbol.iterator]();
  }
}

export class MyCollectionFactory {
  static create<T extends object>(_ref?: any): ICollection<T> {
    return new ArrayCollection<T>();
  }

  static createFrom<T extends object>(items: T[]): ICollection<T> {
    return new ArrayCollection<T>(items);
  }
}
