export default class Stack<T> {
  private array: T[] = [];

  push(...items: T[]) {
    this.array.push(...items);
  }

  pop() {
    return this.array.pop();
  }

  peek() {
    return this.array[this.array.length - 1];
  }

  get length() {
    return this.array.length;
  }
}
