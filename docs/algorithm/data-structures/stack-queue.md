# 栈和队列

## 栈

### 基本概念

栈是一种后进先出（LIFO）的线性数据结构，只允许在一端进行插入和删除操作。这一端称为栈顶，另一端称为栈底。

### 基本操作

```typescript
/**
 * 栈实现
 */
class Stack<T> {
  private data: T[];
  private size: number;

  constructor() {
    this.data = [];
    this.size = 0;
  }

  /**
   * 获取栈大小
   */
  getSize(): number {
    return this.size;
  }

  /**
   * 判断栈是否为空
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * 入栈
   */
  push(element: T): void {
    this.data[this.size++] = element;
  }

  /**
   * 出栈
   */
  pop(): T {
    if (this.isEmpty()) {
      throw new Error("Stack is empty");
    }
    return this.data[--this.size];
  }

  /**
   * 查看栈顶元素
   */
  peek(): T {
    if (this.isEmpty()) {
      throw new Error("Stack is empty");
    }
    return this.data[this.size - 1];
  }

  /**
   * 清空栈
   */
  clear(): void {
    this.data = [];
    this.size = 0;
  }
}
```

### 应用场景

1. 函数调用栈
2. 表达式求值
3. 括号匹配
4. 浏览器历史记录
5. 撤销操作

### 练习题

1. 实现一个支持最小值的栈
2. 使用栈实现队列
3. 使用栈实现括号匹配

### 参考代码

```typescript
// 支持最小值的栈
class MinStack {
  private data: number[];
  private minData: number[];
  private size: number;

  constructor() {
    this.data = [];
    this.minData = [];
    this.size = 0;
  }

  push(val: number): void {
    this.data[this.size] = val;
    if (this.size === 0 || val <= this.minData[this.size - 1]) {
      this.minData[this.size] = val;
    } else {
      this.minData[this.size] = this.minData[this.size - 1];
    }
    this.size++;
  }

  pop(): number {
    if (this.isEmpty()) {
      throw new Error("Stack is empty");
    }
    this.size--;
    return this.data[this.size];
  }

  top(): number {
    if (this.isEmpty()) {
      throw new Error("Stack is empty");
    }
    return this.data[this.size - 1];
  }

  getMin(): number {
    if (this.isEmpty()) {
      throw new Error("Stack is empty");
    }
    return this.minData[this.size - 1];
  }

  isEmpty(): boolean {
    return this.size === 0;
  }
}

// 使用栈实现队列
class MyQueue {
  private inStack: number[];
  private outStack: number[];

  constructor() {
    this.inStack = [];
    this.outStack = [];
  }

  push(x: number): void {
    this.inStack.push(x);
  }

  pop(): number {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        this.outStack.push(this.inStack.pop()!);
      }
    }
    return this.outStack.pop()!;
  }

  peek(): number {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        this.outStack.push(this.inStack.pop()!);
      }
    }
    return this.outStack[this.outStack.length - 1];
  }

  empty(): boolean {
    return this.inStack.length === 0 && this.outStack.length === 0;
  }
}

// 括号匹配
const isValid = (s: string): boolean => {
  const stack: string[] = [];
  const map: { [key: string]: string } = {
    "(": ")",
    "[": "]",
    "{": "}",
  };

  for (const char of s) {
    if (char in map) {
      stack.push(char);
    } else {
      const top = stack.pop();
      if (!top || map[top] !== char) {
        return false;
      }
    }
  }

  return stack.length === 0;
};
```

## 队列

### 基本概念

队列是一种先进先出（FIFO）的线性数据结构，只允许在一端进行插入操作，在另一端进行删除操作。插入端称为队尾，删除端称为队头。

### 基本操作

```typescript
/**
 * 队列实现
 */
class Queue<T> {
  private data: T[];
  private size: number;
  private front: number;
  private rear: number;

  constructor(capacity: number = 10) {
    this.data = new Array(capacity);
    this.size = 0;
    this.front = 0;
    this.rear = 0;
  }

  /**
   * 获取队列大小
   */
  getSize(): number {
    return this.size;
  }

  /**
   * 判断队列是否为空
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * 入队
   */
  enqueue(element: T): void {
    if (this.size === this.data.length) {
      this.resize(this.data.length * 2);
    }
    this.data[this.rear] = element;
    this.rear = (this.rear + 1) % this.data.length;
    this.size++;
  }

  /**
   * 出队
   */
  dequeue(): T {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    const element = this.data[this.front];
    this.front = (this.front + 1) % this.data.length;
    this.size--;

    if (this.size === this.data.length / 4 && this.data.length / 2 !== 0) {
      this.resize(this.data.length / 2);
    }

    return element;
  }

  /**
   * 查看队头元素
   */
  peek(): T {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    return this.data[this.front];
  }

  /**
   * 调整队列容量
   */
  private resize(newCapacity: number): void {
    const newData = new Array(newCapacity);
    for (let i = 0; i < this.size; i++) {
      newData[i] = this.data[(this.front + i) % this.data.length];
    }
    this.data = newData;
    this.front = 0;
    this.rear = this.size;
  }
}
```

### 双端队列

```typescript
/**
 * 双端队列实现
 */
class Deque<T> {
  private data: T[];
  private size: number;
  private front: number;
  private rear: number;

  constructor(capacity: number = 10) {
    this.data = new Array(capacity);
    this.size = 0;
    this.front = 0;
    this.rear = 0;
  }

  /**
   * 从队头入队
   */
  addFirst(element: T): void {
    if (this.size === this.data.length) {
      this.resize(this.data.length * 2);
    }
    this.front = (this.front - 1 + this.data.length) % this.data.length;
    this.data[this.front] = element;
    this.size++;
  }

  /**
   * 从队尾入队
   */
  addLast(element: T): void {
    if (this.size === this.data.length) {
      this.resize(this.data.length * 2);
    }
    this.data[this.rear] = element;
    this.rear = (this.rear + 1) % this.data.length;
    this.size++;
  }

  /**
   * 从队头出队
   */
  removeFirst(): T {
    if (this.isEmpty()) {
      throw new Error("Deque is empty");
    }
    const element = this.data[this.front];
    this.front = (this.front + 1) % this.data.length;
    this.size--;

    if (this.size === this.data.length / 4 && this.data.length / 2 !== 0) {
      this.resize(this.data.length / 2);
    }

    return element;
  }

  /**
   * 从队尾出队
   */
  removeLast(): T {
    if (this.isEmpty()) {
      throw new Error("Deque is empty");
    }
    this.rear = (this.rear - 1 + this.data.length) % this.data.length;
    const element = this.data[this.rear];
    this.size--;

    if (this.size === this.data.length / 4 && this.data.length / 2 !== 0) {
      this.resize(this.data.length / 2);
    }

    return element;
  }
}
```

### 应用场景

1. 任务调度
2. 消息队列
3. 广度优先搜索
4. 缓存实现
5. 打印机任务队列

### 练习题

1. 实现一个支持优先级的队列
2. 使用队列实现栈
3. 实现一个循环队列

### 参考代码

```typescript
// 优先队列
class PriorityQueue<T> {
  private data: T[];
  private comparator: (a: T, b: T) => number;

  constructor(comparator: (a: T, b: T) => number) {
    this.data = [];
    this.comparator = comparator;
  }

  enqueue(element: T): void {
    this.data.push(element);
    this.siftUp(this.data.length - 1);
  }

  dequeue(): T {
    if (this.isEmpty()) {
      throw new Error("PriorityQueue is empty");
    }
    const result = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      this.siftDown(0);
    }
    return result;
  }

  private siftUp(index: number): void {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.comparator(this.data[index], this.data[parent]) >= 0) {
        break;
      }
      [this.data[index], this.data[parent]] = [
        this.data[parent],
        this.data[index],
      ];
      index = parent;
    }
  }

  private siftDown(index: number): void {
    while (true) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let smallest = index;

      if (
        left < this.data.length &&
        this.comparator(this.data[left], this.data[smallest]) < 0
      ) {
        smallest = left;
      }

      if (
        right < this.data.length &&
        this.comparator(this.data[right], this.data[smallest]) < 0
      ) {
        smallest = right;
      }

      if (smallest === index) {
        break;
      }

      [this.data[index], this.data[smallest]] = [
        this.data[smallest],
        this.data[index],
      ];
      index = smallest;
    }
  }

  isEmpty(): boolean {
    return this.data.length === 0;
  }
}

// 使用队列实现栈
class MyStack {
  private queue: number[];

  constructor() {
    this.queue = [];
  }

  push(x: number): void {
    this.queue.push(x);
    for (let i = 0; i < this.queue.length - 1; i++) {
      this.queue.push(this.queue.shift()!);
    }
  }

  pop(): number {
    return this.queue.shift()!;
  }

  top(): number {
    return this.queue[0];
  }

  empty(): boolean {
    return this.queue.length === 0;
  }
}

// 循环队列
class CircularQueue {
  private data: number[];
  private front: number;
  private rear: number;
  private size: number;
  private capacity: number;

  constructor(k: number) {
    this.data = new Array(k);
    this.front = 0;
    this.rear = 0;
    this.size = 0;
    this.capacity = k;
  }

  enQueue(value: number): boolean {
    if (this.isFull()) {
      return false;
    }
    this.data[this.rear] = value;
    this.rear = (this.rear + 1) % this.capacity;
    this.size++;
    return true;
  }

  deQueue(): boolean {
    if (this.isEmpty()) {
      return false;
    }
    this.front = (this.front + 1) % this.capacity;
    this.size--;
    return true;
  }

  Front(): number {
    if (this.isEmpty()) {
      return -1;
    }
    return this.data[this.front];
  }

  Rear(): number {
    if (this.isEmpty()) {
      return -1;
    }
    return this.data[(this.rear - 1 + this.capacity) % this.capacity];
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  isFull(): boolean {
    return this.size === this.capacity;
  }
}

// 使用示例
const minStack = new MinStack();
minStack.push(1);
minStack.push(2);
console.log(minStack.getMin()); // 1

const queue = new MyQueue();
queue.push(1);
queue.push(2);
console.log(queue.pop()); // 1

const priorityQueue = new PriorityQueue<{ name: string; priority: number }>(
  (a, b) => a.priority - b.priority
);
priorityQueue.enqueue({ name: "Task 1", priority: 2 });
priorityQueue.enqueue({ name: "Task 2", priority: 1 });
console.log(priorityQueue.dequeue()); // { name: "Task 2", priority: 1 }
```
