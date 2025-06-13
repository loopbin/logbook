# 归并排序

## 基本思想

归并排序是一种分治的排序算法。它的基本思想是：将待排序的数组分成两个子数组，分别对这两个子数组进行排序，然后将排序好的子数组合并成一个有序的数组。这个过程可以递归地进行，直到子数组的长度为 1 时，自然就是有序的。

## 算法步骤

1. 将数组分成两半
2. 递归地对左半部分进行归并排序
3. 递归地对右半部分进行归并排序
4. 将两个有序的子数组合并成一个有序的数组

## 代码实现

```typescript
/**
 * 归并排序
 * @param arr 待排序数组
 * @returns 排序后的数组
 */
const mergeSort = (arr: number[]): number[] => {
  if (arr.length <= 1) {
    return arr;
  }

  // 将数组分成两半
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  // 递归排序并合并
  return merge(mergeSort(left), mergeSort(right));
};

/**
 * 合并两个有序数组
 */
const merge = (left: number[], right: number[]): number[] => {
  const result: number[] = [];
  let i = 0;
  let j = 0;

  // 比较两个数组的元素，将较小的放入结果数组
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  // 将剩余元素添加到结果数组
  return result.concat(left.slice(i)).concat(right.slice(j));
};
```

## 优化版本

```typescript
/**
 * 优化后的归并排序（原地排序）
 * @param arr 待排序数组
 * @param left 左边界
 * @param right 右边界
 * @param temp 临时数组
 */
const mergeSortInPlace = (
  arr: number[],
  left: number = 0,
  right: number = arr.length - 1,
  temp: number[] = new Array(arr.length)
): void => {
  if (left >= right) {
    return;
  }

  const mid = Math.floor((left + right) / 2);

  // 递归排序左右两部分
  mergeSortInPlace(arr, left, mid, temp);
  mergeSortInPlace(arr, mid + 1, right, temp);

  // 合并两个有序子数组
  mergeInPlace(arr, left, mid, right, temp);
};

/**
 * 原地合并两个有序子数组
 */
const mergeInPlace = (
  arr: number[],
  left: number,
  mid: number,
  right: number,
  temp: number[]
): void => {
  // 复制到临时数组
  for (let i = left; i <= right; i++) {
    temp[i] = arr[i];
  }

  let i = left; // 左子数组的起始位置
  let j = mid + 1; // 右子数组的起始位置
  let k = left; // 原数组的当前位置

  // 合并两个有序子数组
  while (i <= mid && j <= right) {
    if (temp[i] <= temp[j]) {
      arr[k++] = temp[i++];
    } else {
      arr[k++] = temp[j++];
    }
  }

  // 复制剩余元素
  while (i <= mid) {
    arr[k++] = temp[i++];
  }
  while (j <= right) {
    arr[k++] = temp[j++];
  }
};
```

## 复杂度分析

- 时间复杂度：
  - 最坏情况：O(n log n)
  - 最好情况：O(n log n)
  - 平均情况：O(n log n)
- 空间复杂度：O(n)
- 稳定性：稳定

## 特点

1. 优点：

   - 稳定排序
   - 时间复杂度稳定
   - 适合外部排序

2. 缺点：
   - 需要额外空间
   - 对于小规模数据，可能不如插入排序效率高

## 应用场景

1. 大规模数据排序
2. 需要稳定排序的场景
3. 外部排序
4. 链表排序

## 练习题

1. 实现一个自底向上的归并排序
2. 使用归并排序对链表进行排序
3. 实现一个多路归并排序

## 参考代码

```typescript
// 自底向上的归并排序
const mergeSortBottomUp = (arr: number[]): void => {
  const n = arr.length;
  const temp = new Array(n);

  // 子数组大小从 1 开始，每次翻倍
  for (let size = 1; size < n; size *= 2) {
    // 对每个子数组进行归并
    for (let left = 0; left < n - size; left += size * 2) {
      const mid = left + size - 1;
      const right = Math.min(left + size * 2 - 1, n - 1);
      mergeInPlace(arr, left, mid, right, temp);
    }
  }
};

// 链表节点定义
interface ListNode {
  val: number;
  next: ListNode | null;
}

// 链表归并排序
const mergeSortList = (head: ListNode | null): ListNode | null => {
  if (!head || !head.next) {
    return head;
  }

  // 找到链表中点
  const mid = findMiddle(head);
  const right = mid.next;
  mid.next = null;

  // 递归排序左右两部分
  const left = mergeSortList(head);
  const sortedRight = mergeSortList(right);

  // 合并两个有序链表
  return mergeLists(left, sortedRight);
};

// 找到链表中点
const findMiddle = (head: ListNode): ListNode => {
  let slow = head;
  let fast = head;

  while (fast.next && fast.next.next) {
    slow = slow.next!;
    fast = fast.next.next;
  }

  return slow;
};

// 合并两个有序链表
const mergeLists = (
  left: ListNode | null,
  right: ListNode | null
): ListNode | null => {
  const dummy = new ListNode(0);
  let current = dummy;

  while (left && right) {
    if (left.val <= right.val) {
      current.next = left;
      left = left.next;
    } else {
      current.next = right;
      right = right.next;
    }
    current = current.next;
  }

  current.next = left || right;
  return dummy.next;
};

// 多路归并排序
const mergeKSortedArrays = (arrays: number[][]): number[] => {
  const k = arrays.length;
  if (k === 0) return [];
  if (k === 1) return arrays[0];

  // 使用分治法合并 k 个有序数组
  const mergeArrays = (left: number, right: number): number[] => {
    if (left === right) {
      return arrays[left];
    }

    const mid = Math.floor((left + right) / 2);
    const leftArray = mergeArrays(left, mid);
    const rightArray = mergeArrays(mid + 1, right);

    return merge(leftArray, rightArray);
  };

  return mergeArrays(0, k - 1);
};
```
