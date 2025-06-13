# 插入排序

## 基本思想

插入排序是一种简单直观的排序算法。它的工作原理是通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。插入排序在实现上，通常采用 in-place 排序（即只需用到 O(1) 的额外空间的排序），因而在从后向前扫描过程中，需要反复把已排序元素逐步向后挪位，为最新元素提供插入空间。

## 算法步骤

1. 从第一个元素开始，该元素可以认为已经被排序
2. 取出下一个元素，在已经排序的元素序列中从后向前扫描
3. 如果该元素（已排序）大于新元素，将该元素移到下一位置
4. 重复步骤 3，直到找到已排序的元素小于或者等于新元素的位置
5. 将新元素插入到该位置后
6. 重复步骤 2~5，直到所有元素都插入完毕

## 代码实现

```typescript
/**
 * 插入排序
 * @param arr 待排序数组
 * @returns 排序后的数组
 */
const insertionSort = (arr: number[]): number[] => {
  const len = arr.length;

  // 从第二个元素开始遍历
  for (let i = 1; i < len; i++) {
    // 保存当前要插入的元素
    const current = arr[i];
    let j = i - 1;

    // 在已排序序列中从后向前扫描
    while (j >= 0 && arr[j] > current) {
      // 将大于 current 的元素向后移动
      arr[j + 1] = arr[j];
      j--;
    }

    // 找到合适的位置，插入元素
    arr[j + 1] = current;
  }

  return arr;
};
```

## 优化版本

```typescript
/**
 * 优化后的插入排序（使用二分查找）
 * @param arr 待排序数组
 * @returns 排序后的数组
 */
const optimizedInsertionSort = (arr: number[]): number[] => {
  const len = arr.length;

  for (let i = 1; i < len; i++) {
    const current = arr[i];

    // 使用二分查找找到插入位置
    let left = 0;
    let right = i - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (arr[mid] > current) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    // 将元素插入到正确位置
    for (let j = i - 1; j >= left; j--) {
      arr[j + 1] = arr[j];
    }
    arr[left] = current;
  }

  return arr;
};
```

## 复杂度分析

- 时间复杂度：
  - 最坏情况：O(n²)
  - 最好情况：O(n)
  - 平均情况：O(n²)
- 空间复杂度：O(1)
- 稳定性：稳定

## 特点

1. 优点：

   - 实现简单
   - 稳定排序
   - 原地排序
   - 对于小规模数据或基本有序的数据效率高

2. 缺点：
   - 时间复杂度较高
   - 对于大规模数据效率低

## 应用场景

1. 数据量较小的情况
2. 数据基本有序的情况
3. 对稳定性有要求的场景
4. 作为其他排序算法的优化手段（如快速排序的小数组优化）

## 练习题

1. 实现一个希尔排序（插入排序的改进版本）
2. 使用插入排序对链表进行排序
3. 实现一个基于插入排序的归并排序

## 参考代码

```typescript
// 希尔排序
const shellSort = (arr: number[]): number[] => {
  const len = arr.length;

  // 生成增量序列
  for (let gap = Math.floor(len / 2); gap > 0; gap = Math.floor(gap / 2)) {
    // 对每个子序列进行插入排序
    for (let i = gap; i < len; i++) {
      const current = arr[i];
      let j = i - gap;

      while (j >= 0 && arr[j] > current) {
        arr[j + gap] = arr[j];
        j -= gap;
      }

      arr[j + gap] = current;
    }
  }

  return arr;
};

// 链表节点定义
interface ListNode {
  val: number;
  next: ListNode | null;
}

// 链表插入排序
const insertionSortList = (head: ListNode | null): ListNode | null => {
  if (!head || !head.next) {
    return head;
  }

  const dummy = new ListNode(0);
  let current = head;

  while (current) {
    const next = current.next;
    let prev = dummy;

    // 在已排序链表中找到插入位置
    while (prev.next && prev.next.val < current.val) {
      prev = prev.next;
    }

    // 插入节点
    current.next = prev.next;
    prev.next = current;
    current = next;
  }

  return dummy.next;
};

// 基于插入排序的归并排序
const mergeSortWithInsertion = (
  arr: number[],
  left: number,
  right: number
): void => {
  // 当子数组长度小于某个阈值时，使用插入排序
  if (right - left <= 10) {
    for (let i = left + 1; i <= right; i++) {
      const current = arr[i];
      let j = i - 1;

      while (j >= left && arr[j] > current) {
        arr[j + 1] = arr[j];
        j--;
      }

      arr[j + 1] = current;
    }
    return;
  }

  // 否则使用归并排序
  const mid = Math.floor((left + right) / 2);
  mergeSortWithInsertion(arr, left, mid);
  mergeSortWithInsertion(arr, mid + 1, right);

  // 合并两个有序子数组
  const temp = [];
  let i = left;
  let j = mid + 1;

  while (i <= mid && j <= right) {
    if (arr[i] <= arr[j]) {
      temp.push(arr[i++]);
    } else {
      temp.push(arr[j++]);
    }
  }

  while (i <= mid) {
    temp.push(arr[i++]);
  }

  while (j <= right) {
    temp.push(arr[j++]);
  }

  for (let k = 0; k < temp.length; k++) {
    arr[left + k] = temp[k];
  }
};
```
