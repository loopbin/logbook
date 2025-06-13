# 选择排序

## 基本思想

选择排序是一种简单直观的排序算法。它的工作原理是：首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置，然后，再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。以此类推，直到所有元素均排序完毕。

## 算法步骤

1. 在未排序序列中找到最小元素，存放到排序序列的起始位置
2. 从剩余未排序元素中继续寻找最小元素，然后放到已排序序列的末尾
3. 重复第二步，直到所有元素均排序完毕

## 代码实现

```typescript
/**
 * 选择排序
 * @param arr 待排序数组
 * @returns 排序后的数组
 */
const selectionSort = (arr: number[]): number[] => {
  const len = arr.length;

  // 外层循环控制已排序序列的末尾位置
  for (let i = 0; i < len - 1; i++) {
    // 假设当前位置的元素是最小的
    let minIndex = i;

    // 内层循环在未排序序列中寻找最小元素
    for (let j = i + 1; j < len; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    // 如果找到了更小的元素，则交换位置
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }

  return arr;
};
```

## 优化版本

```typescript
/**
 * 优化后的选择排序（同时找最大值和最小值）
 * @param arr 待排序数组
 * @returns 排序后的数组
 */
const optimizedSelectionSort = (arr: number[]): number[] => {
  const len = arr.length;
  let left = 0;
  let right = len - 1;

  while (left < right) {
    let minIndex = left;
    let maxIndex = right;

    // 在未排序序列中同时寻找最大值和最小值
    for (let i = left; i <= right; i++) {
      if (arr[i] < arr[minIndex]) {
        minIndex = i;
      }
      if (arr[i] > arr[maxIndex]) {
        maxIndex = i;
      }
    }

    // 将最小值放到已排序序列的起始位置
    if (minIndex !== left) {
      [arr[left], arr[minIndex]] = [arr[minIndex], arr[left]];
    }

    // 如果最大值在起始位置，需要更新最大值的位置
    if (maxIndex === left) {
      maxIndex = minIndex;
    }

    // 将最大值放到已排序序列的末尾
    if (maxIndex !== right) {
      [arr[right], arr[maxIndex]] = [arr[maxIndex], arr[right]];
    }

    left++;
    right--;
  }

  return arr;
};
```

## 复杂度分析

- 时间复杂度：
  - 最坏情况：O(n²)
  - 最好情况：O(n²)
  - 平均情况：O(n²)
- 空间复杂度：O(1)
- 稳定性：不稳定

## 特点

1. 优点：

   - 实现简单
   - 交换次数少
   - 原地排序

2. 缺点：
   - 时间复杂度较高
   - 不稳定排序
   - 对已排序数组没有优化

## 应用场景

1. 数据量较小的情况
2. 对交换次数有要求的场景
3. 对稳定性没有要求的场景

## 练习题

1. 实现一个稳定的选择排序
2. 使用选择排序对链表进行排序
3. 实现一个基于选择排序的堆排序

## 参考代码

```typescript
// 稳定的选择排序
const stableSelectionSort = (arr: number[]): number[] => {
  const len = arr.length;

  for (let i = 0; i < len - 1; i++) {
    let minIndex = i;

    // 找到最小元素
    for (let j = i + 1; j < len; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    // 将最小元素插入到已排序序列的末尾
    const min = arr[minIndex];
    for (let k = minIndex; k > i; k--) {
      arr[k] = arr[k - 1];
    }
    arr[i] = min;
  }

  return arr;
};

// 链表节点定义
interface ListNode {
  val: number;
  next: ListNode | null;
}

// 链表选择排序
const selectionSortList = (head: ListNode | null): ListNode | null => {
  if (!head || !head.next) {
    return head;
  }

  let dummy = new ListNode(0);
  dummy.next = head;
  let current = dummy;

  while (current.next) {
    let min = current.next;
    let minPrev = current;
    let prev = current.next;
    let node = prev.next;

    while (node) {
      if (node.val < min.val) {
        min = node;
        minPrev = prev;
      }
      prev = node;
      node = node.next;
    }

    if (min !== current.next) {
      minPrev.next = min.next;
      min.next = current.next;
      current.next = min;
    }

    current = current.next;
  }

  return dummy.next;
};
```
