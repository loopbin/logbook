# 树

## 基本概念

树是一种非线性数据结构，它由 n 个有限节点组成一个具有层次关系的集合。每个节点有零个或多个子节点，没有父节点的节点称为根节点，没有子节点的节点称为叶子节点。

## 二叉树

```typescript
/**
 * 二叉树节点
 */
interface ITreeNode<T> {
  val: T;
  left: ITreeNode<T> | null;
  right: ITreeNode<T> | null;
}

/**
 * 二叉树实现
 */
class BinaryTree<T> {
  private root: ITreeNode<T> | null;

  constructor() {
    this.root = null;
  }

  /**
   * 插入节点
   */
  insert(val: T): void {
    const newNode: ITreeNode<T> = {
      val,
      left: null,
      right: null,
    };

    if (!this.root) {
      this.root = newNode;
      return;
    }

    const queue: ITreeNode<T>[] = [this.root];
    while (queue.length > 0) {
      const node = queue.shift()!;
      if (!node.left) {
        node.left = newNode;
        return;
      }
      if (!node.right) {
        node.right = newNode;
        return;
      }
      queue.push(node.left);
      queue.push(node.right);
    }
  }

  /**
   * 前序遍历
   */
  preorderTraversal(): T[] {
    const result: T[] = [];
    const traverse = (node: ITreeNode<T> | null) => {
      if (!node) return;
      result.push(node.val);
      traverse(node.left);
      traverse(node.right);
    };
    traverse(this.root);
    return result;
  }

  /**
   * 中序遍历
   */
  inorderTraversal(): T[] {
    const result: T[] = [];
    const traverse = (node: ITreeNode<T> | null) => {
      if (!node) return;
      traverse(node.left);
      result.push(node.val);
      traverse(node.right);
    };
    traverse(this.root);
    return result;
  }

  /**
   * 后序遍历
   */
  postorderTraversal(): T[] {
    const result: T[] = [];
    const traverse = (node: ITreeNode<T> | null) => {
      if (!node) return;
      traverse(node.left);
      traverse(node.right);
      result.push(node.val);
    };
    traverse(this.root);
    return result;
  }

  /**
   * 层序遍历
   */
  levelOrderTraversal(): T[] {
    const result: T[] = [];
    if (!this.root) return result;

    const queue: ITreeNode<T>[] = [this.root];
    while (queue.length > 0) {
      const node = queue.shift()!;
      result.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    return result;
  }
}
```

## 二叉搜索树

```typescript
/**
 * 二叉搜索树实现
 */
class BinarySearchTree<T> {
  private root: ITreeNode<T> | null;
  private comparator: (a: T, b: T) => number;

  constructor(comparator: (a: T, b: T) => number) {
    this.root = null;
    this.comparator = comparator;
  }

  /**
   * 插入节点
   */
  insert(val: T): void {
    const newNode: ITreeNode<T> = {
      val,
      left: null,
      right: null,
    };

    if (!this.root) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    while (true) {
      if (this.comparator(val, current.val) < 0) {
        if (!current.left) {
          current.left = newNode;
          break;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          break;
        }
        current = current.right;
      }
    }
  }

  /**
   * 查找节点
   */
  find(val: T): ITreeNode<T> | null {
    let current = this.root;
    while (current) {
      const comparison = this.comparator(val, current.val);
      if (comparison === 0) {
        return current;
      }
      current = comparison < 0 ? current.left : current.right;
    }
    return null;
  }

  /**
   * 删除节点
   */
  remove(val: T): boolean {
    const removeNode = (
      node: ITreeNode<T> | null,
      value: T
    ): ITreeNode<T> | null => {
      if (!node) return null;

      const comparison = this.comparator(value, node.val);
      if (comparison < 0) {
        node.left = removeNode(node.left, value);
      } else if (comparison > 0) {
        node.right = removeNode(node.right, value);
      } else {
        if (!node.left && !node.right) {
          return null;
        }
        if (!node.left) {
          return node.right;
        }
        if (!node.right) {
          return node.left;
        }

        const minNode = this.findMin(node.right);
        node.val = minNode.val;
        node.right = removeNode(node.right, minNode.val);
      }
      return node;
    };

    this.root = removeNode(this.root, val);
    return true;
  }

  /**
   * 查找最小值节点
   */
  private findMin(node: ITreeNode<T>): ITreeNode<T> {
    while (node.left) {
      node = node.left;
    }
    return node;
  }
}
```

## 平衡树

```typescript
/**
 * AVL树节点
 */
interface IAVLNode<T> {
  val: T;
  left: IAVLNode<T> | null;
  right: IAVLNode<T> | null;
  height: number;
}

/**
 * AVL树实现
 */
class AVLTree<T> {
  private root: IAVLNode<T> | null;
  private comparator: (a: T, b: T) => number;

  constructor(comparator: (a: T, b: T) => number) {
    this.root = null;
    this.comparator = comparator;
  }

  /**
   * 获取节点高度
   */
  private getHeight(node: IAVLNode<T> | null): number {
    return node ? node.height : 0;
  }

  /**
   * 获取平衡因子
   */
  private getBalance(node: IAVLNode<T> | null): number {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  /**
   * 右旋转
   */
  private rightRotate(node: IAVLNode<T>): IAVLNode<T> {
    const left = node.left!;
    const right = left.right;

    left.right = node;
    node.left = right;

    node.height =
      Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
    left.height =
      Math.max(this.getHeight(left.left), this.getHeight(left.right)) + 1;

    return left;
  }

  /**
   * 左旋转
   */
  private leftRotate(node: IAVLNode<T>): IAVLNode<T> {
    const right = node.right!;
    const left = right.left;

    right.left = node;
    node.right = left;

    node.height =
      Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
    right.height =
      Math.max(this.getHeight(right.left), this.getHeight(right.right)) + 1;

    return right;
  }

  /**
   * 插入节点
   */
  insert(val: T): void {
    const insertNode = (node: IAVLNode<T> | null, value: T): IAVLNode<T> => {
      if (!node) {
        return {
          val: value,
          left: null,
          right: null,
          height: 1,
        };
      }

      const comparison = this.comparator(value, node.val);
      if (comparison < 0) {
        node.left = insertNode(node.left, value);
      } else if (comparison > 0) {
        node.right = insertNode(node.right, value);
      } else {
        return node;
      }

      node.height =
        Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;

      const balance = this.getBalance(node);

      // 左左情况
      if (balance > 1 && this.comparator(value, node.left!.val) < 0) {
        return this.rightRotate(node);
      }

      // 右右情况
      if (balance < -1 && this.comparator(value, node.right!.val) > 0) {
        return this.leftRotate(node);
      }

      // 左右情况
      if (balance > 1 && this.comparator(value, node.left!.val) > 0) {
        node.left = this.leftRotate(node.left!);
        return this.rightRotate(node);
      }

      // 右左情况
      if (balance < -1 && this.comparator(value, node.right!.val) < 0) {
        node.right = this.rightRotate(node.right!);
        return this.leftRotate(node);
      }

      return node;
    };

    this.root = insertNode(this.root, val);
  }
}
```

## 应用场景

1. 文件系统
2. 数据库索引
3. 表达式求值
4. 决策树
5. 游戏 AI

## 练习题

1. 实现一个支持范围查询的二叉搜索树
2. 实现一个支持重复值的二叉搜索树
3. 实现一个支持区间统计的树

## 参考代码

```typescript
// 支持范围查询的二叉搜索树
class RangeBST<T> {
  private root: ITreeNode<T> | null;
  private comparator: (a: T, b: T) => number;

  constructor(comparator: (a: T, b: T) => number) {
    this.root = null;
    this.comparator = comparator;
  }

  rangeQuery(min: T, max: T): T[] {
    const result: T[] = [];
    const query = (node: ITreeNode<T> | null) => {
      if (!node) return;

      if (this.comparator(min, node.val) <= 0) {
        query(node.left);
      }
      if (
        this.comparator(min, node.val) <= 0 &&
        this.comparator(max, node.val) >= 0
      ) {
        result.push(node.val);
      }
      if (this.comparator(max, node.val) >= 0) {
        query(node.right);
      }
    };
    query(this.root);
    return result;
  }
}

// 支持重复值的二叉搜索树
class DuplicateBST<T> {
  private root: ITreeNode<T> | null;
  private comparator: (a: T, b: T) => number;

  constructor(comparator: (a: T, b: T) => number) {
    this.root = null;
    this.comparator = comparator;
  }

  insert(val: T): void {
    const newNode: ITreeNode<T> = {
      val,
      left: null,
      right: null,
    };

    if (!this.root) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    while (true) {
      const comparison = this.comparator(val, current.val);
      if (comparison <= 0) {
        if (!current.left) {
          current.left = newNode;
          break;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          break;
        }
        current = current.right;
      }
    }
  }

  count(val: T): number {
    let count = 0;
    const traverse = (node: ITreeNode<T> | null) => {
      if (!node) return;
      if (this.comparator(val, node.val) === 0) {
        count++;
      }
      traverse(node.left);
      traverse(node.right);
    };
    traverse(this.root);
    return count;
  }
}

// 支持区间统计的树
class SegmentTree {
  private data: number[];
  private tree: number[];
  private size: number;

  constructor(arr: number[]) {
    this.size = arr.length;
    this.data = [...arr];
    this.tree = new Array(4 * this.size);
    this.build(0, 0, this.size - 1);
  }

  private build(node: number, start: number, end: number): void {
    if (start === end) {
      this.tree[node] = this.data[start];
      return;
    }

    const mid = Math.floor((start + end) / 2);
    this.build(2 * node + 1, start, mid);
    this.build(2 * node + 2, mid + 1, end);
    this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
  }

  query(left: number, right: number): number {
    return this.queryRange(0, 0, this.size - 1, left, right);
  }

  private queryRange(
    node: number,
    start: number,
    end: number,
    left: number,
    right: number
  ): number {
    if (start > right || end < left) {
      return 0;
    }

    if (start >= left && end <= right) {
      return this.tree[node];
    }

    const mid = Math.floor((start + end) / 2);
    return (
      this.queryRange(2 * node + 1, start, mid, left, right) +
      this.queryRange(2 * node + 2, mid + 1, end, left, right)
    );
  }

  update(index: number, value: number): void {
    this.data[index] = value;
    this.updateRange(0, 0, this.size - 1, index, value);
  }

  private updateRange(
    node: number,
    start: number,
    end: number,
    index: number,
    value: number
  ): void {
    if (start === end) {
      this.tree[node] = value;
      return;
    }

    const mid = Math.floor((start + end) / 2);
    if (index <= mid) {
      this.updateRange(2 * node + 1, start, mid, index, value);
    } else {
      this.updateRange(2 * node + 2, mid + 1, end, index, value);
    }

    this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
  }
}

// 使用示例
const bst = new BinarySearchTree<number>((a, b) => a - b);
bst.insert(5);
bst.insert(3);
bst.insert(7);
console.log(bst.find(3)); // { val: 3, left: null, right: null }

const avl = new AVLTree<number>((a, b) => a - b);
avl.insert(10);
avl.insert(20);
avl.insert(30);
console.log(avl);

const rangeBst = new RangeBST<number>((a, b) => a - b);
rangeBst.insert(1);
rangeBst.insert(2);
rangeBst.insert(3);
console.log(rangeBst.rangeQuery(1, 2)); // [1, 2]

const segmentTree = new SegmentTree([1, 3, 5, 7, 9, 11]);
console.log(segmentTree.query(1, 3)); // 15
segmentTree.update(2, 6);
console.log(segmentTree.query(1, 3)); // 16
```
