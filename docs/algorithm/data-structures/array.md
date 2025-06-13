# 数组

## 基本概念

数组是一种线性数据结构，它用一组连续的内存空间来存储相同类型的数据。数组支持随机访问，通过索引可以在 O(1) 时间内访问任意位置的元素。

## 基本操作

```typescript
/**
 * 数组的基本操作
 */
class Array<T> {
  private data: T[];
  private size: number;
  private capacity: number;

  constructor(capacity: number = 10) {
    this.data = new Array(capacity);
    this.size = 0;
    this.capacity = capacity;
  }

  /**
   * 获取数组大小
   */
  getSize(): number {
    return this.size;
  }

  /**
   * 获取数组容量
   */
  getCapacity(): number {
    return this.capacity;
  }

  /**
   * 判断数组是否为空
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * 在指定位置插入元素
   */
  insert(index: number, element: T): void {
    if (index < 0 || index > this.size) {
      throw new Error("Index out of bounds");
    }

    if (this.size === this.capacity) {
      this.resize(this.capacity * 2);
    }

    for (let i = this.size - 1; i >= index; i--) {
      this.data[i + 1] = this.data[i];
    }

    this.data[index] = element;
    this.size++;
  }

  /**
   * 在数组末尾添加元素
   */
  push(element: T): void {
    this.insert(this.size, element);
  }

  /**
   * 在数组开头添加元素
   */
  unshift(element: T): void {
    this.insert(0, element);
  }

  /**
   * 删除指定位置的元素
   */
  remove(index: number): T {
    if (index < 0 || index >= this.size) {
      throw new Error("Index out of bounds");
    }

    const element = this.data[index];

    for (let i = index; i < this.size - 1; i++) {
      this.data[i] = this.data[i + 1];
    }

    this.size--;
    this.data[this.size] = null as any;

    if (this.size === this.capacity / 4 && this.capacity / 2 !== 0) {
      this.resize(this.capacity / 2);
    }

    return element;
  }

  /**
   * 删除数组末尾的元素
   */
  pop(): T {
    return this.remove(this.size - 1);
  }

  /**
   * 删除数组开头的元素
   */
  shift(): T {
    return this.remove(0);
  }

  /**
   * 获取指定位置的元素
   */
  get(index: number): T {
    if (index < 0 || index >= this.size) {
      throw new Error("Index out of bounds");
    }
    return this.data[index];
  }

  /**
   * 设置指定位置的元素
   */
  set(index: number, element: T): void {
    if (index < 0 || index >= this.size) {
      throw new Error("Index out of bounds");
    }
    this.data[index] = element;
  }

  /**
   * 查找元素
   */
  find(element: T): number {
    for (let i = 0; i < this.size; i++) {
      if (this.data[i] === element) {
        return i;
      }
    }
    return -1;
  }

  /**
   * 判断是否包含元素
   */
  contains(element: T): boolean {
    return this.find(element) !== -1;
  }

  /**
   * 调整数组容量
   */
  private resize(newCapacity: number): void {
    const newData = new Array(newCapacity);
    for (let i = 0; i < this.size; i++) {
      newData[i] = this.data[i];
    }
    this.data = newData;
    this.capacity = newCapacity;
  }
}
```

## 动态数组

```typescript
/**
 * 动态数组实现
 */
class DynamicArray<T> {
  private data: T[];
  private size: number;
  private capacity: number;
  private growthFactor: number;

  constructor(capacity: number = 10, growthFactor: number = 2) {
    this.data = new Array(capacity);
    this.size = 0;
    this.capacity = capacity;
    this.growthFactor = growthFactor;
  }

  /**
   * 添加元素
   */
  add(element: T): void {
    if (this.size === this.capacity) {
      this.grow();
    }
    this.data[this.size++] = element;
  }

  /**
   * 扩容
   */
  private grow(): void {
    const newCapacity = Math.floor(this.capacity * this.growthFactor);
    const newData = new Array(newCapacity);
    for (let i = 0; i < this.size; i++) {
      newData[i] = this.data[i];
    }
    this.data = newData;
    this.capacity = newCapacity;
  }

  /**
   * 缩容
   */
  private shrink(): void {
    if (this.size < this.capacity / this.growthFactor) {
      const newCapacity = Math.floor(this.capacity / this.growthFactor);
      const newData = new Array(newCapacity);
      for (let i = 0; i < this.size; i++) {
        newData[i] = this.data[i];
      }
      this.data = newData;
      this.capacity = newCapacity;
    }
  }
}
```

## 复杂度分析

- 随机访问：O(1)
- 插入/删除：
  - 末尾：O(1)
  - 中间：O(n)
- 查找：O(n)
- 空间复杂度：O(n)

## 特点

1. 优点：

   - 随机访问效率高
   - 内存连续，缓存友好
   - 实现简单
   - 适合频繁访问的场景

2. 缺点：
   - 插入和删除效率低
   - 需要连续的内存空间
   - 大小固定（静态数组）
   - 扩容成本高（动态数组）

## 应用场景

1. 需要随机访问的场景
2. 数据量固定或变化不大的场景
3. 需要频繁访问元素的场景
4. 作为其他数据结构的基础

## 练习题

1. 实现一个支持泛型的动态数组
2. 实现一个支持自定义比较器的数组
3. 实现一个支持范围操作的数组

## 参考代码

```typescript
// 支持泛型的动态数组
class GenericArray<T> {
  private data: T[];
  private size: number;

  constructor() {
    this.data = [];
    this.size = 0;
  }

  add(element: T): void {
    this.data[this.size++] = element;
  }

  remove(index: number): T {
    if (index < 0 || index >= this.size) {
      throw new Error("Index out of bounds");
    }
    const element = this.data[index];
    for (let i = index; i < this.size - 1; i++) {
      this.data[i] = this.data[i + 1];
    }
    this.size--;
    return element;
  }
}

// 支持自定义比较器的数组
class ComparableArray<T> {
  private data: T[];
  private comparator: (a: T, b: T) => number;

  constructor(comparator: (a: T, b: T) => number) {
    this.data = [];
    this.comparator = comparator;
  }

  sort(): void {
    this.data.sort(this.comparator);
  }

  binarySearch(element: T): number {
    let left = 0;
    let right = this.data.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const comparison = this.comparator(this.data[mid], element);

      if (comparison === 0) {
        return mid;
      } else if (comparison < 0) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return -1;
  }
}

// 支持范围操作的数组
class RangeArray<T> {
  private data: T[];

  constructor() {
    this.data = [];
  }

  fill(value: T, start: number, end: number): void {
    for (let i = start; i < end; i++) {
      this.data[i] = value;
    }
  }

  slice(start: number, end: number): T[] {
    return this.data.slice(start, end);
  }

  splice(start: number, deleteCount: number, ...items: T[]): T[] {
    return this.data.splice(start, deleteCount, ...items);
  }
}

// 使用示例
const numbers = new GenericArray<number>();
numbers.add(1);
numbers.add(2);
console.log(numbers.remove(0)); // 1

const students = new ComparableArray<{ name: string; age: number }>(
  (a, b) => a.age - b.age
);
students.sort();
console.log(students.binarySearch({ name: "Alice", age: 20 }));

const rangeArray = new RangeArray<number>();
rangeArray.fill(0, 0, 5);
console.log(rangeArray.slice(0, 3)); // [0, 0, 0]
```
