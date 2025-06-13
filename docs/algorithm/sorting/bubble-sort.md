# 冒泡排序

## 基本思想

冒泡排序是一种简单的排序算法，它重复地遍历要排序的数组，比较相邻的两个元素，如果它们的顺序错误就把它们交换过来。遍历数组的工作是重复进行的，直到没有交换发生，也就是说该数组已经排序完成。

## 算法步骤

1. 比较相邻的元素。如果第一个比第二个大，就交换它们。
2. 对每一对相邻元素做同样的工作，从开始第一对到结尾的最后一对。这步做完后，最后的元素会是最大的数。
3. 针对所有的元素重复以上的步骤，除了最后一个。
4. 持续每次对越来越少的元素重复上面的步骤，直到没有任何一对数字需要比较。

## 代码实现

```typescript
/**
 * 冒泡排序
 * @param arr 待排序数组
 * @returns 排序后的数组
 */
const bubbleSort = (arr: number[]): number[] => {
  const len = arr.length;

  // 外层循环控制需要比较的轮数
  for (let i = 0; i < len - 1; i++) {
    // 内层循环控制每轮比较的次数
    for (let j = 0; j < len - 1 - i; j++) {
      // 如果前一个元素大于后一个元素，则交换它们的位置
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }

  return arr;
};
```

## 优化版本

```typescript
/**
 * 优化后的冒泡排序
 * @param arr 待排序数组
 * @returns 排序后的数组
 */
const optimizedBubbleSort = (arr: number[]): number[] => {
  const len = arr.length;

  for (let i = 0; i < len - 1; i++) {
    // 添加标志位，如果某一轮没有发生交换，说明数组已经有序
    let swapped = false;

    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }

    // 如果没有发生交换，提前退出循环
    if (!swapped) {
      break;
    }
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

2. 缺点：
   - 时间复杂度较高
   - 交换次数较多

## 应用场景

1. 数据量较小的情况
2. 对稳定性有要求的场景
3. 教学演示

## 练习题

1. 实现一个双向冒泡排序
2. 优化冒泡排序，记录最后一次交换的位置
3. 使用冒泡排序对链表进行排序

## 参考代码

```typescript
// 双向冒泡排序
const bidirectionalBubbleSort = (arr: number[]): number[] => {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    // 从左到右冒泡
    for (let i = left; i < right; i++) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
      }
    }
    right--;

    // 从右到左冒泡
    for (let i = right; i > left; i--) {
      if (arr[i] < arr[i - 1]) {
        [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
      }
    }
    left++;
  }

  return arr;
};
```
