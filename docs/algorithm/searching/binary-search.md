# 二分查找

## 基本思想

二分查找是一种在有序数组中查找特定元素的搜索算法。它的基本思想是：每次查找都通过将待查找区间分成两部分，并只保留可能包含目标值的部分，从而将搜索范围缩小一半，直到找到目标值或确定目标值不存在。

## 算法步骤

1. 确定数组的中间元素
2. 如果中间元素等于目标值，则查找成功
3. 如果目标值小于中间元素，则在左半部分继续查找
4. 如果目标值大于中间元素，则在右半部分继续查找
5. 重复步骤 1-4，直到找到目标值或确定目标值不存在

## 代码实现

```typescript
/**
 * 二分查找
 * @param arr 有序数组
 * @param target 目标值
 * @returns 目标值的索引，如果不存在则返回 -1
 */
const binarySearch = (arr: number[], target: number): number => {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;
    }

    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
};
```

## 优化版本

```typescript
/**
 * 优化后的二分查找（处理重复元素）
 * @param arr 有序数组
 * @param target 目标值
 * @returns 目标值的第一个索引，如果不存在则返回 -1
 */
const binarySearchFirst = (arr: number[], target: number): number => {
  let left = 0;
  let right = arr.length - 1;
  let result = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      result = mid;
      right = mid - 1; // 继续在左半部分查找
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return result;
};

/**
 * 查找目标值的最后一个位置
 */
const binarySearchLast = (arr: number[], target: number): number => {
  let left = 0;
  let right = arr.length - 1;
  let result = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      result = mid;
      left = mid + 1; // 继续在右半部分查找
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return result;
};
```

## 复杂度分析

- 时间复杂度：O(log n)
- 空间复杂度：O(1)
- 稳定性：不适用

## 特点

1. 优点：

   - 查找效率高
   - 实现简单
   - 空间复杂度低

2. 缺点：
   - 要求数组必须有序
   - 不适合频繁插入和删除的场景
   - 不适合数据量很小的场景

## 应用场景

1. 有序数组的查找
2. 查找第一个/最后一个等于目标值的位置
3. 查找第一个大于/小于目标值的位置
4. 查找最接近目标值的元素

## 练习题

1. 实现一个查找第一个大于目标值的二分查找
2. 使用二分查找在旋转有序数组中查找目标值
3. 实现一个查找最接近目标值的二分查找

## 参考代码

```typescript
// 查找第一个大于目标值的位置
const binarySearchFirstGreater = (arr: number[], target: number): number => {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] <= target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return left < arr.length ? left : -1;
};

// 在旋转有序数组中查找目标值
const searchInRotatedArray = (arr: number[], target: number): number => {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;
    }

    // 判断左半部分是否有序
    if (arr[left] <= arr[mid]) {
      if (arr[left] <= target && target < arr[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      // 右半部分有序
      if (arr[mid] < target && target <= arr[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return -1;
};

// 查找最接近目标值的元素
const findClosest = (arr: number[], target: number): number => {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;
    }

    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  // 处理边界情况
  if (left === 0) return 0;
  if (left === arr.length) return arr.length - 1;

  // 比较左右两个元素，返回更接近目标值的索引
  return Math.abs(arr[left - 1] - target) <= Math.abs(arr[left] - target)
    ? left - 1
    : left;
};
```
