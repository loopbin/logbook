# 快速排序

## 基本思想

快速排序是一种分治的排序算法。它的基本思想是：选择一个基准元素，通过一趟排序将要排序的数据分割成独立的两部分，其中一部分的所有数据都比基准元素小，另一部分的所有数据都比基准元素大，然后再按此方法对这两部分数据分别进行快速排序，整个排序过程可以递归进行，以此达到整个数据变成有序序列。

## 算法步骤

1. 从数列中挑出一个元素，称为"基准"（pivot）
2. 重新排序数列，所有比基准值小的元素摆放在基准前面，所有比基准值大的元素摆在基准后面（相同的数可以到任一边）。在这个分区结束之后，该基准就处于数列的中间位置。这个称为分区（partition）操作
3. 递归地（recursive）把小于基准值元素的子数列和大于基准值元素的子数列排序

## 代码实现

```typescript
/**
 * 快速排序
 * @param arr 待排序数组
 * @returns 排序后的数组
 */
const quickSort = (arr: number[]): number[] => {
  if (arr.length <= 1) {
    return arr;
  }

  // 选择基准值（这里选择第一个元素）
  const pivot = arr[0];
  const left: number[] = [];
  const right: number[] = [];

  // 分区操作
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  // 递归排序并合并结果
  return [...quickSort(left), pivot, ...quickSort(right)];
};
```

## 优化版本

```typescript
/**
 * 优化后的快速排序（原地分区）
 * @param arr 待排序数组
 * @param left 左边界
 * @param right 右边界
 */
const quickSortInPlace = (
  arr: number[],
  left: number = 0,
  right: number = arr.length - 1
): void => {
  if (left >= right) {
    return;
  }

  // 三数取中法选择基准值
  const mid = Math.floor((left + right) / 2);
  const pivot = medianOfThree(arr, left, mid, right);

  // 将基准值放到最左边
  swap(arr, left, pivot);

  // 分区操作
  const pivotIndex = partition(arr, left, right);

  // 递归排序左右两部分
  quickSortInPlace(arr, left, pivotIndex - 1);
  quickSortInPlace(arr, pivotIndex + 1, right);
};

/**
 * 三数取中
 */
const medianOfThree = (
  arr: number[],
  left: number,
  mid: number,
  right: number
): number => {
  const a = arr[left];
  const b = arr[mid];
  const c = arr[right];

  if (a < b) {
    if (b < c) return mid;
    if (a < c) return right;
    return left;
  } else {
    if (a < c) return left;
    if (b < c) return right;
    return mid;
  }
};

/**
 * 交换数组中的两个元素
 */
const swap = (arr: number[], i: number, j: number): void => {
  [arr[i], arr[j]] = [arr[j], arr[i]];
};

/**
 * 分区操作
 */
const partition = (arr: number[], left: number, right: number): number => {
  const pivot = arr[left];
  let i = left + 1;
  let j = right;

  while (true) {
    // 从左向右找第一个大于基准值的数
    while (i <= right && arr[i] <= pivot) {
      i++;
    }

    // 从右向左找第一个小于基准值的数
    while (j > left && arr[j] >= pivot) {
      j--;
    }

    if (i >= j) {
      break;
    }

    // 交换这两个数
    swap(arr, i, j);
  }

  // 将基准值放到正确的位置
  swap(arr, left, j);
  return j;
};
```

## 复杂度分析

- 时间复杂度：
  - 最坏情况：O(n²)
  - 最好情况：O(n log n)
  - 平均情况：O(n log n)
- 空间复杂度：O(log n)
- 稳定性：不稳定

## 特点

1. 优点：

   - 平均情况下效率高
   - 原地排序
   - 缓存友好

2. 缺点：
   - 不稳定排序
   - 最坏情况下效率低
   - 递归调用可能占用较多栈空间

## 应用场景

1. 大规模数据排序
2. 对稳定性没有要求的场景
3. 需要原地排序的场景
4. 作为其他排序算法的优化手段

## 练习题

1. 实现一个三路快速排序（处理大量重复元素的情况）
2. 使用快速排序找出数组中的第 k 大元素
3. 实现一个非递归版本的快速排序

## 参考代码

```typescript
// 三路快速排序
const quickSort3Way = (
  arr: number[],
  left: number = 0,
  right: number = arr.length - 1
): void => {
  if (left >= right) {
    return;
  }

  // 选择基准值
  const pivot = arr[left];
  let lt = left; // 小于基准值的右边界
  let gt = right; // 大于基准值的左边界
  let i = left + 1; // 当前扫描位置

  while (i <= gt) {
    if (arr[i] < pivot) {
      swap(arr, lt++, i++);
    } else if (arr[i] > pivot) {
      swap(arr, i, gt--);
    } else {
      i++;
    }
  }

  // 递归排序小于和大于基准值的部分
  quickSort3Way(arr, left, lt - 1);
  quickSort3Way(arr, gt + 1, right);
};

// 找出第 k 大元素
const findKthLargest = (arr: number[], k: number): number => {
  const n = arr.length;
  const targetIndex = n - k;

  const quickSelect = (left: number, right: number): number => {
    if (left === right) {
      return arr[left];
    }

    const pivotIndex = partition(arr, left, right);

    if (pivotIndex === targetIndex) {
      return arr[pivotIndex];
    } else if (pivotIndex < targetIndex) {
      return quickSelect(pivotIndex + 1, right);
    } else {
      return quickSelect(left, pivotIndex - 1);
    }
  };

  return quickSelect(0, n - 1);
};

// 非递归快速排序
const quickSortIterative = (arr: number[]): void => {
  const stack: [number, number][] = [[0, arr.length - 1]];

  while (stack.length > 0) {
    const [left, right] = stack.pop()!;

    if (left >= right) {
      continue;
    }

    const pivotIndex = partition(arr, left, right);

    // 将左右子数组的边界压入栈中
    stack.push([left, pivotIndex - 1]);
    stack.push([pivotIndex + 1, right]);
  }
};
```
