# 顺序查找

## 基本思想

顺序查找（也称为线性查找）是一种最简单的查找算法。它的基本思想是：从数组的第一个元素开始，依次与目标值进行比较，直到找到目标值或遍历完整个数组。

## 算法步骤

1. 从数组的第一个元素开始
2. 将当前元素与目标值进行比较
3. 如果相等，则查找成功，返回当前元素的索引
4. 如果不相等，则继续查找下一个元素
5. 重复步骤 2-4，直到找到目标值或遍历完整个数组

## 代码实现

```typescript
/**
 * 顺序查找
 * @param arr 待查找数组
 * @param target 目标值
 * @returns 目标值的索引，如果不存在则返回 -1
 */
const linearSearch = (arr: number[], target: number): number => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
};
```

## 优化版本

```typescript
/**
 * 优化后的顺序查找（使用哨兵）
 * @param arr 待查找数组
 * @param target 目标值
 * @returns 目标值的索引，如果不存在则返回 -1
 */
const linearSearchWithSentinel = (arr: number[], target: number): number => {
  // 保存最后一个元素
  const last = arr[arr.length - 1];

  // 将目标值放在数组末尾作为哨兵
  arr[arr.length - 1] = target;

  let i = 0;
  // 不需要检查数组边界，因为目标值一定存在
  while (arr[i] !== target) {
    i++;
  }

  // 恢复最后一个元素
  arr[arr.length - 1] = last;

  // 判断是否找到目标值
  if (i < arr.length - 1 || last === target) {
    return i;
  }

  return -1;
};

/**
 * 查找所有匹配的元素
 */
const linearSearchAll = (arr: number[], target: number): number[] => {
  const result: number[] = [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      result.push(i);
    }
  }

  return result;
};
```

## 复杂度分析

- 时间复杂度：
  - 最坏情况：O(n)
  - 最好情况：O(1)
  - 平均情况：O(n)
- 空间复杂度：O(1)
- 稳定性：不适用

## 特点

1. 优点：

   - 实现简单
   - 不需要数组有序
   - 适合小规模数据
   - 适合频繁插入和删除的场景

2. 缺点：
   - 查找效率低
   - 不适合大规模数据
   - 没有利用数据的任何特性

## 应用场景

1. 无序数组的查找
2. 小规模数据的查找
3. 需要查找所有匹配元素的场景
4. 作为其他查找算法的基准比较

## 练习题

1. 实现一个支持自定义比较函数的顺序查找
2. 使用顺序查找找出数组中的第一个和最后一个目标值
3. 实现一个支持范围查找的顺序查找

## 参考代码

```typescript
// 支持自定义比较函数的顺序查找
const linearSearchWithComparator = <T>(
  arr: T[],
  target: T,
  comparator: (a: T, b: T) => boolean
): number => {
  for (let i = 0; i < arr.length; i++) {
    if (comparator(arr[i], target)) {
      return i;
    }
  }
  return -1;
};

// 查找第一个和最后一个目标值
const findFirstAndLast = (arr: number[], target: number): [number, number] => {
  let first = -1;
  let last = -1;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      if (first === -1) {
        first = i;
      }
      last = i;
    }
  }

  return [first, last];
};

// 范围查找
const linearSearchRange = (
  arr: number[],
  min: number,
  max: number
): number[] => {
  const result: number[] = [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] >= min && arr[i] <= max) {
      result.push(i);
    }
  }

  return result;
};

// 使用示例
const arr = [1, 2, 3, 4, 5, 3, 6, 7, 3, 8];
const target = 3;

// 使用自定义比较函数
const index = linearSearchWithComparator(arr, target, (a, b) => a === b);

// 查找第一个和最后一个目标值
const [first, last] = findFirstAndLast(arr, target);

// 范围查找
const rangeIndices = linearSearchRange(arr, 3, 6);
```
