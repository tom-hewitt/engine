export default class Stack<T> {
  private array: T[] = [];

  push(...items: T[]) {
    this.array.push(...items);
  }

  pop() {
    return this.array.pop();
  }

  get length() {
    return this.array.length;
  }
}
