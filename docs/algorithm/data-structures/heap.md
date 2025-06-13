# 堆

## 基本概念

堆是一种特殊的完全二叉树，它满足堆的性质：对于最大堆，每个节点的值都大于或等于其子节点的值；对于最小堆，每个节点的值都小于或等于其子节点的值。堆常用于实现优先队列和堆排序算法。

## 基本实现

```typescript
/**
 * 堆实现
 */
class Heap<T> {
  private data: T[];
  private comparator: (a: T, b: T) => number;

  constructor(comparator: (a: T, b: T) => number) {
    this.data = [];
    this.comparator = comparator;
  }

  /**
   * 获取父节点索引
   */
  private parent(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  /**
   * 获取左子节点索引
   */
  private leftChild(index: number): number {
    return 2 * index + 1;
  }

  /**
   * 获取右子节点索引
   */
  private rightChild(index: number): number {
    return 2 * index + 2;
  }

  /**
   * 交换两个元素
   */
  private swap(i: number, j: number): void {
    [this.data[i], this.data[j]] = [this.data[j], this.data[i]];
  }

  /**
   * 上浮操作
   */
  private siftUp(index: number): void {
    while (index > 0) {
      const parent = this.parent(index);
      if (this.comparator(this.data[index], this.data[parent]) >= 0) {
        break;
      }
      this.swap(index, parent);
      index = parent;
    }
  }

  /**
   * 下沉操作
   */
  private siftDown(index: number): void {
    const size = this.data.length;
    while (true) {
      const left = this.leftChild(index);
      const right = this.rightChild(index);
      let smallest = index;

      if (
        left < size &&
        this.comparator(this.data[left], this.data[smallest]) < 0
      ) {
        smallest = left;
      }

      if (
        right < size &&
        this.comparator(this.data[right], this.data[smallest]) < 0
      ) {
        smallest = right;
      }

      if (smallest === index) {
        break;
      }

      this.swap(index, smallest);
      index = smallest;
    }
  }

  /**
   * 插入元素
   */
  push(value: T): void {
    this.data.push(value);
    this.siftUp(this.data.length - 1);
  }

  /**
   * 弹出顶部元素
   */
  pop(): T | null {
    if (this.data.length === 0) {
      return null;
    }

    const result = this.data[0];
    const last = this.data.pop()!;

    if (this.data.length > 0) {
      this.data[0] = last;
      this.siftDown(0);
    }

    return result;
  }

  /**
   * 获取顶部元素
   */
  peek(): T | null {
    return this.data.length > 0 ? this.data[0] : null;
  }

  /**
   * 获取堆大小
   */
  size(): number {
    return this.data.length;
  }

  /**
   * 判断堆是否为空
   */
  isEmpty(): boolean {
    return this.data.length === 0;
  }
}
```

## 优先队列

```typescript
/**
 * 优先队列实现
 */
class PriorityQueue<T> {
  private heap: Heap<T>;

  constructor(comparator: (a: T, b: T) => number) {
    this.heap = new Heap(comparator);
  }

  /**
   * 入队
   */
  enqueue(value: T): void {
    this.heap.push(value);
  }

  /**
   * 出队
   */
  dequeue(): T | null {
    return this.heap.pop();
  }

  /**
   * 查看队首元素
   */
  peek(): T | null {
    return this.heap.peek();
  }

  /**
   * 获取队列大小
   */
  size(): number {
    return this.heap.size();
  }

  /**
   * 判断队列是否为空
   */
  isEmpty(): boolean {
    return this.heap.isEmpty();
  }
}
```

## 堆排序

```typescript
/**
 * 堆排序实现
 */
class HeapSort {
  /**
   * 堆排序
   */
  static sort<T>(arr: T[], comparator: (a: T, b: T) => number): T[] {
    const heap = new Heap(comparator);
    const result: T[] = [];

    // 构建堆
    for (const item of arr) {
      heap.push(item);
    }

    // 依次取出堆顶元素
    while (!heap.isEmpty()) {
      result.push(heap.pop()!);
    }

    return result;
  }

  /**
   * 原地堆排序
   */
  static sortInPlace<T>(arr: T[], comparator: (a: T, b: T) => number): void {
    const heapify = (index: number, size: number) => {
      let largest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;

      if (left < size && comparator(arr[left], arr[largest]) > 0) {
        largest = left;
      }

      if (right < size && comparator(arr[right], arr[largest]) > 0) {
        largest = right;
      }

      if (largest !== index) {
        [arr[index], arr[largest]] = [arr[largest], arr[index]];
        heapify(largest, size);
      }
    };

    // 构建最大堆
    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
      heapify(i, arr.length);
    }

    // 依次取出堆顶元素
    for (let i = arr.length - 1; i > 0; i--) {
      [arr[0], arr[i]] = [arr[i], arr[0]];
      heapify(0, i);
    }
  }
}
```

## 应用场景

1. 优先队列
2. 堆排序
3. 任务调度
4. 事件处理
5. 图算法（如 Dijkstra 算法）

## 练习题

1. 实现一个支持动态调整优先级的优先队列
2. 实现一个支持合并的堆
3. 实现一个支持删除任意元素的堆

## 参考代码

```typescript
// 支持动态调整优先级的优先队列
class DynamicPriorityQueue<T> {
  private heap: Heap<T>;
  private indexMap: Map<T, number>;

  constructor(comparator: (a: T, b: T) => number) {
    this.heap = new Heap(comparator);
    this.indexMap = new Map();
  }

  enqueue(value: T): void {
    this.indexMap.set(value, this.heap.size());
    this.heap.push(value);
  }

  updatePriority(value: T, newValue: T): void {
    const index = this.indexMap.get(value);
    if (index === undefined) {
      return;
    }

    this.heap.data[index] = newValue;
    this.indexMap.delete(value);
    this.indexMap.set(newValue, index);

    const parent = Math.floor((index - 1) / 2);
    if (
      index > 0 &&
      this.heap.comparator(this.heap.data[index], this.heap.data[parent]) < 0
    ) {
      this.heap.siftUp(index);
    } else {
      this.heap.siftDown(index);
    }
  }
}

// 支持合并的堆
class MergeableHeap<T> {
  private heap: Heap<T>;

  constructor(comparator: (a: T, b: T) => number) {
    this.heap = new Heap(comparator);
  }

  merge(other: MergeableHeap<T>): void {
    while (!other.isEmpty()) {
      this.heap.push(other.heap.pop()!);
    }
  }

  push(value: T): void {
    this.heap.push(value);
  }

  pop(): T | null {
    return this.heap.pop();
  }

  isEmpty(): boolean {
    return this.heap.isEmpty();
  }
}

// 支持删除任意元素的堆
class DeletableHeap<T> {
  private heap: Heap<T>;
  private deleted: Set<T>;

  constructor(comparator: (a: T, b: T) => number) {
    this.heap = new Heap(comparator);
    this.deleted = new Set();
  }

  push(value: T): void {
    this.heap.push(value);
  }

  pop(): T | null {
    while (!this.heap.isEmpty()) {
      const value = this.heap.pop()!;
      if (!this.deleted.has(value)) {
        return value;
      }
    }
    return null;
  }

  delete(value: T): void {
    this.deleted.add(value);
  }
}

// 使用示例
const heap = new Heap<number>((a, b) => a - b);
heap.push(5);
heap.push(3);
heap.push(7);
console.log(heap.pop()); // 3

const pq = new PriorityQueue<{ name: string; priority: number }>(
  (a, b) => a.priority - b.priority
);
pq.enqueue({ name: "Task 1", priority: 2 });
pq.enqueue({ name: "Task 2", priority: 1 });
console.log(pq.dequeue()); // { name: "Task 2", priority: 1 }

const arr = [5, 3, 7, 1, 9];
HeapSort.sortInPlace(arr, (a, b) => a - b);
console.log(arr); // [1, 3, 5, 7, 9]
```
