# 堆排序

## 基本思想

堆排序是一种基于二叉堆的比较排序算法。它的基本思想是：将待排序的数组构建成一个大顶堆（或小顶堆），然后依次将堆顶元素与末尾元素交换，并重新调整堆结构，直到整个序列有序。

## 算法步骤

1. 构建初始堆：将待排序数组构建成一个大顶堆
2. 将堆顶元素与末尾元素交换，将最大元素"沉"到数组末端
3. 重新调整堆结构，使其满足堆定义
4. 重复步骤 2~3，直到整个序列有序

## 代码实现

```typescript
/**
 * 堆排序
 * @param arr 待排序数组
 */
const heapSort = (arr: number[]): void => {
  const len = arr.length;

  // 构建初始堆
  for (let i = Math.floor(len / 2) - 1; i >= 0; i--) {
    heapify(arr, len, i);
  }

  // 依次将堆顶元素与末尾元素交换，并重新调整堆
  for (let i = len - 1; i > 0; i--) {
    // 交换堆顶元素与末尾元素
    [arr[0], arr[i]] = [arr[i], arr[0]];

    // 重新调整堆
    heapify(arr, i, 0);
  }
};

/**
 * 调整堆结构
 * @param arr 待调整的数组
 * @param len 堆的大小
 * @param i 当前需要调整的节点下标
 */
const heapify = (arr: number[], len: number, i: number): void => {
  let largest = i; // 初始化最大值为根节点
  const left = 2 * i + 1; // 左子节点
  const right = 2 * i + 2; // 右子节点

  // 如果左子节点存在且大于根节点
  if (left < len && arr[left] > arr[largest]) {
    largest = left;
  }

  // 如果右子节点存在且大于最大值
  if (right < len && arr[right] > arr[largest]) {
    largest = right;
  }

  // 如果最大值不是根节点
  if (largest !== i) {
    // 交换根节点和最大值
    [arr[i], arr[largest]] = [arr[largest], arr[i]];

    // 递归调整被交换的子树
    heapify(arr, len, largest);
  }
};
```

## 优化版本

```typescript
/**
 * 优化后的堆排序（使用小顶堆）
 * @param arr 待排序数组
 */
const heapSortOptimized = (arr: number[]): void => {
  const len = arr.length;

  // 构建初始小顶堆
  for (let i = Math.floor(len / 2) - 1; i >= 0; i--) {
    heapifyMin(arr, len, i);
  }

  // 依次将堆顶元素与末尾元素交换，并重新调整堆
  for (let i = len - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapifyMin(arr, i, 0);
  }
};

/**
 * 调整小顶堆结构
 */
const heapifyMin = (arr: number[], len: number, i: number): void => {
  let smallest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < len && arr[left] < arr[smallest]) {
    smallest = left;
  }

  if (right < len && arr[right] < arr[smallest]) {
    smallest = right;
  }

  if (smallest !== i) {
    [arr[i], arr[smallest]] = [arr[smallest], arr[i]];
    heapifyMin(arr, len, smallest);
  }
};
```

## 复杂度分析

- 时间复杂度：
  - 最坏情况：O(n log n)
  - 最好情况：O(n log n)
  - 平均情况：O(n log n)
- 空间复杂度：O(1)
- 稳定性：不稳定

## 特点

1. 优点：

   - 原地排序
   - 时间复杂度稳定
   - 适合大数据量排序

2. 缺点：
   - 不稳定排序
   - 对缓存不友好
   - 数据量较小时不如快速排序

## 应用场景

1. 大规模数据排序
2. 需要原地排序的场景
3. 实时性要求不高的场景
4. 作为其他算法的优化手段

## 练习题

1. 实现一个基于堆的优先队列
2. 使用堆排序找出数组中的前 k 个最大元素
3. 实现一个支持动态扩容的堆

## 参考代码

```typescript
// 优先队列实现
class PriorityQueue<T> {
  private heap: T[] = [];
  private compare: (a: T, b: T) => number;

  constructor(compare: (a: T, b: T) => number) {
    this.compare = compare;
  }

  // 获取父节点索引
  private parent(i: number): number {
    return Math.floor((i - 1) / 2);
  }

  // 获取左子节点索引
  private left(i: number): number {
    return 2 * i + 1;
  }

  // 获取右子节点索引
  private right(i: number): number {
    return 2 * i + 2;
  }

  // 交换两个元素
  private swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  // 上浮操作
  private siftUp(i: number): void {
    let parent = this.parent(i);
    while (i > 0 && this.compare(this.heap[i], this.heap[parent]) < 0) {
      this.swap(i, parent);
      i = parent;
      parent = this.parent(i);
    }
  }

  // 下沉操作
  private siftDown(i: number): void {
    let min = i;
    const left = this.left(i);
    const right = this.right(i);

    if (
      left < this.heap.length &&
      this.compare(this.heap[left], this.heap[min]) < 0
    ) {
      min = left;
    }

    if (
      right < this.heap.length &&
      this.compare(this.heap[right], this.heap[min]) < 0
    ) {
      min = right;
    }

    if (min !== i) {
      this.swap(i, min);
      this.siftDown(min);
    }
  }

  // 入队
  enqueue(item: T): void {
    this.heap.push(item);
    this.siftUp(this.heap.length - 1);
  }

  // 出队
  dequeue(): T | undefined {
    if (this.heap.length === 0) {
      return undefined;
    }

    const result = this.heap[0];
    const last = this.heap.pop()!;

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.siftDown(0);
    }

    return result;
  }

  // 查看队首元素
  peek(): T | undefined {
    return this.heap[0];
  }

  // 获取队列大小
  size(): number {
    return this.heap.length;
  }

  // 判断队列是否为空
  isEmpty(): boolean {
    return this.heap.length === 0;
  }
}

// 找出前 k 个最大元素
const findTopK = (arr: number[], k: number): number[] => {
  // 创建小顶堆
  const minHeap = new PriorityQueue<number>((a, b) => a - b);

  // 先将前 k 个元素加入堆
  for (let i = 0; i < k; i++) {
    minHeap.enqueue(arr[i]);
  }

  // 遍历剩余元素
  for (let i = k; i < arr.length; i++) {
    if (arr[i] > minHeap.peek()!) {
      minHeap.dequeue();
      minHeap.enqueue(arr[i]);
    }
  }

  // 将堆中元素转换为数组
  const result: number[] = [];
  while (!minHeap.isEmpty()) {
    result.unshift(minHeap.dequeue()!);
  }

  return result;
};

// 动态扩容的堆
class DynamicHeap<T> {
  private heap: T[] = [];
  private compare: (a: T, b: T) => number;
  private capacity: number;

  constructor(compare: (a: T, b: T) => number, initialCapacity: number = 10) {
    this.compare = compare;
    this.capacity = initialCapacity;
    this.heap = new Array(initialCapacity);
  }

  // 扩容
  private resize(newCapacity: number): void {
    const newHeap = new Array(newCapacity);
    for (let i = 0; i < this.heap.length; i++) {
      newHeap[i] = this.heap[i];
    }
    this.heap = newHeap;
    this.capacity = newCapacity;
  }

  // 添加元素
  add(item: T): void {
    if (this.heap.length === this.capacity) {
      this.resize(this.capacity * 2);
    }
    this.heap.push(item);
    this.siftUp(this.heap.length - 1);
  }

  // 其他方法实现与 PriorityQueue 类似
  // ...
}
```
