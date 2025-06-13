# 链表

## 基本概念

链表是一种线性数据结构，它通过指针将一组零散的内存块串联起来。每个节点包含数据和指向下一个节点的指针。链表支持动态扩容，不需要连续的内存空间。

## 基本操作

```typescript
/**
 * 链表节点
 */
interface IListNode<T> {
  val: T;
  next: IListNode<T> | null;
}

/**
 * 链表实现
 */
class LinkedList<T> {
  private head: IListNode<T> | null;
  private size: number;

  constructor() {
    this.head = null;
    this.size = 0;
  }

  /**
   * 获取链表大小
   */
  getSize(): number {
    return this.size;
  }

  /**
   * 判断链表是否为空
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * 在指定位置插入节点
   */
  insert(index: number, val: T): void {
    if (index < 0 || index > this.size) {
      throw new Error("Index out of bounds");
    }

    const newNode: IListNode<T> = { val, next: null };

    if (index === 0) {
      newNode.next = this.head;
      this.head = newNode;
    } else {
      let prev = this.head;
      for (let i = 0; i < index - 1; i++) {
        prev = prev!.next;
      }
      newNode.next = prev!.next;
      prev!.next = newNode;
    }

    this.size++;
  }

  /**
   * 在链表头部插入节点
   */
  addFirst(val: T): void {
    this.insert(0, val);
  }

  /**
   * 在链表尾部插入节点
   */
  addLast(val: T): void {
    this.insert(this.size, val);
  }

  /**
   * 删除指定位置的节点
   */
  remove(index: number): T {
    if (index < 0 || index >= this.size) {
      throw new Error("Index out of bounds");
    }

    let delNode: IListNode<T>;
    if (index === 0) {
      delNode = this.head!;
      this.head = this.head!.next;
    } else {
      let prev = this.head;
      for (let i = 0; i < index - 1; i++) {
        prev = prev!.next;
      }
      delNode = prev!.next!;
      prev!.next = delNode.next;
    }

    this.size--;
    return delNode.val;
  }

  /**
   * 删除第一个节点
   */
  removeFirst(): T {
    return this.remove(0);
  }

  /**
   * 删除最后一个节点
   */
  removeLast(): T {
    return this.remove(this.size - 1);
  }

  /**
   * 获取指定位置的节点值
   */
  get(index: number): T {
    if (index < 0 || index >= this.size) {
      throw new Error("Index out of bounds");
    }

    let cur = this.head;
    for (let i = 0; i < index; i++) {
      cur = cur!.next;
    }

    return cur!.val;
  }

  /**
   * 设置指定位置的节点值
   */
  set(index: number, val: T): void {
    if (index < 0 || index >= this.size) {
      throw new Error("Index out of bounds");
    }

    let cur = this.head;
    for (let i = 0; i < index; i++) {
      cur = cur!.next;
    }

    cur!.val = val;
  }

  /**
   * 查找值
   */
  find(val: T): number {
    let cur = this.head;
    for (let i = 0; i < this.size; i++) {
      if (cur!.val === val) {
        return i;
      }
      cur = cur!.next;
    }
    return -1;
  }

  /**
   * 判断是否包含值
   */
  contains(val: T): boolean {
    return this.find(val) !== -1;
  }
}
```

## 双向链表

```typescript
/**
 * 双向链表节点
 */
interface IDoublyListNode<T> {
  val: T;
  prev: IDoublyListNode<T> | null;
  next: IDoublyListNode<T> | null;
}

/**
 * 双向链表实现
 */
class DoublyLinkedList<T> {
  private head: IDoublyListNode<T> | null;
  private tail: IDoublyListNode<T> | null;
  private size: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  /**
   * 在指定位置插入节点
   */
  insert(index: number, val: T): void {
    if (index < 0 || index > this.size) {
      throw new Error("Index out of bounds");
    }

    const newNode: IDoublyListNode<T> = {
      val,
      prev: null,
      next: null,
    };

    if (index === 0) {
      newNode.next = this.head;
      if (this.head) {
        this.head.prev = newNode;
      }
      this.head = newNode;
      if (!this.tail) {
        this.tail = newNode;
      }
    } else if (index === this.size) {
      newNode.prev = this.tail;
      this.tail!.next = newNode;
      this.tail = newNode;
    } else {
      let cur = this.head;
      for (let i = 0; i < index; i++) {
        cur = cur!.next;
      }
      newNode.prev = cur!.prev;
      newNode.next = cur;
      cur!.prev!.next = newNode;
      cur!.prev = newNode;
    }

    this.size++;
  }

  /**
   * 删除指定位置的节点
   */
  remove(index: number): T {
    if (index < 0 || index >= this.size) {
      throw new Error("Index out of bounds");
    }

    let delNode: IDoublyListNode<T>;
    if (index === 0) {
      delNode = this.head!;
      this.head = this.head!.next;
      if (this.head) {
        this.head.prev = null;
      } else {
        this.tail = null;
      }
    } else if (index === this.size - 1) {
      delNode = this.tail!;
      this.tail = this.tail!.prev;
      this.tail!.next = null;
    } else {
      let cur = this.head;
      for (let i = 0; i < index; i++) {
        cur = cur!.next;
      }
      delNode = cur!;
      cur!.prev!.next = cur!.next;
      cur!.next!.prev = cur!.prev;
    }

    this.size--;
    return delNode.val;
  }
}
```

## 循环链表

```typescript
/**
 * 循环链表实现
 */
class CircularLinkedList<T> {
  private head: IListNode<T> | null;
  private size: number;

  constructor() {
    this.head = null;
    this.size = 0;
  }

  /**
   * 在指定位置插入节点
   */
  insert(index: number, val: T): void {
    if (index < 0 || index > this.size) {
      throw new Error("Index out of bounds");
    }

    const newNode: IListNode<T> = { val, next: null };

    if (this.size === 0) {
      newNode.next = newNode;
      this.head = newNode;
    } else if (index === 0) {
      newNode.next = this.head;
      let tail = this.head;
      for (let i = 0; i < this.size - 1; i++) {
        tail = tail!.next;
      }
      tail!.next = newNode;
      this.head = newNode;
    } else {
      let prev = this.head;
      for (let i = 0; i < index - 1; i++) {
        prev = prev!.next;
      }
      newNode.next = prev!.next;
      prev!.next = newNode;
    }

    this.size++;
  }

  /**
   * 删除指定位置的节点
   */
  remove(index: number): T {
    if (index < 0 || index >= this.size) {
      throw new Error("Index out of bounds");
    }

    let delNode: IListNode<T>;
    if (this.size === 1) {
      delNode = this.head!;
      this.head = null;
    } else if (index === 0) {
      delNode = this.head!;
      let tail = this.head;
      for (let i = 0; i < this.size - 1; i++) {
        tail = tail!.next;
      }
      this.head = this.head!.next;
      tail!.next = this.head;
    } else {
      let prev = this.head;
      for (let i = 0; i < index - 1; i++) {
        prev = prev!.next;
      }
      delNode = prev!.next!;
      prev!.next = delNode.next;
    }

    this.size--;
    return delNode.val;
  }
}
```

## 复杂度分析

- 访问：O(n)
- 插入/删除：
  - 头部：O(1)
  - 尾部：O(1)（双向链表）/ O(n)（单链表）
  - 中间：O(n)
- 查找：O(n)
- 空间复杂度：O(n)

## 特点

1. 优点：

   - 动态扩容
   - 不需要连续内存
   - 插入删除效率高
   - 适合频繁修改的场景

2. 缺点：
   - 随机访问效率低
   - 需要额外的指针空间
   - 缓存不友好
   - 实现相对复杂

## 应用场景

1. 需要频繁插入删除的场景
2. 内存空间不连续的场景
3. 实现其他数据结构（如栈、队列）
4. 需要双向遍历的场景

## 练习题

1. 实现一个支持泛型的双向链表
2. 实现一个支持自定义比较器的链表
3. 实现一个支持范围操作的链表

## 参考代码

```typescript
// 支持泛型的双向链表
class GenericDoublyLinkedList<T> {
  private head: IDoublyListNode<T> | null;
  private tail: IDoublyListNode<T> | null;
  private size: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  add(val: T): void {
    const newNode: IDoublyListNode<T> = {
      val,
      prev: this.tail,
      next: null,
    };

    if (this.tail) {
      this.tail.next = newNode;
    } else {
      this.head = newNode;
    }

    this.tail = newNode;
    this.size++;
  }

  remove(val: T): boolean {
    let cur = this.head;
    while (cur) {
      if (cur.val === val) {
        if (cur.prev) {
          cur.prev.next = cur.next;
        } else {
          this.head = cur.next;
        }

        if (cur.next) {
          cur.next.prev = cur.prev;
        } else {
          this.tail = cur.prev;
        }

        this.size--;
        return true;
      }
      cur = cur.next;
    }
    return false;
  }
}

// 支持自定义比较器的链表
class ComparableLinkedList<T> {
  private head: IListNode<T> | null;
  private comparator: (a: T, b: T) => number;

  constructor(comparator: (a: T, b: T) => number) {
    this.head = null;
    this.comparator = comparator;
  }

  insertSorted(val: T): void {
    const newNode: IListNode<T> = { val, next: null };

    if (!this.head || this.comparator(val, this.head.val) <= 0) {
      newNode.next = this.head;
      this.head = newNode;
      return;
    }

    let cur = this.head;
    while (cur.next && this.comparator(val, cur.next.val) > 0) {
      cur = cur.next;
    }

    newNode.next = cur.next;
    cur.next = newNode;
  }
}

// 支持范围操作的链表
class RangeLinkedList<T> {
  private head: IListNode<T> | null;

  constructor() {
    this.head = null;
  }

  reverse(start: number, end: number): void {
    if (!this.head || start >= end) return;

    let dummy: IListNode<T> = { val: null as any, next: this.head };
    let prev = dummy;

    for (let i = 0; i < start; i++) {
      prev = prev.next!;
    }

    let cur = prev.next;
    for (let i = start; i < end; i++) {
      const next = cur!.next;
      cur!.next = next!.next;
      next!.next = prev.next;
      prev.next = next;
    }

    this.head = dummy.next;
  }

  rotate(k: number): void {
    if (!this.head || k === 0) return;

    let len = 1;
    let tail = this.head;
    while (tail.next) {
      tail = tail.next;
      len++;
    }

    k = k % len;
    if (k === 0) return;

    let cur = this.head;
    for (let i = 0; i < len - k - 1; i++) {
      cur = cur!.next;
    }

    const newHead = cur!.next;
    cur!.next = null;
    tail.next = this.head;
    this.head = newHead;
  }
}

// 使用示例
const list = new GenericDoublyLinkedList<number>();
list.add(1);
list.add(2);
list.add(3);
console.log(list.remove(2)); // true

const sortedList = new ComparableLinkedList<{ name: string; age: number }>(
  (a, b) => a.age - b.age
);
sortedList.insertSorted({ name: "Alice", age: 20 });
sortedList.insertSorted({ name: "Bob", age: 18 });

const rangeList = new RangeLinkedList<number>();
rangeList.reverse(0, 3);
rangeList.rotate(2);
```
