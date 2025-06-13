# 计数排序

## 基本思想

计数排序是一种非比较排序算法，它的基本思想是：对于给定的输入序列中的每一个元素 x，确定该序列中值小于 x 的元素的个数。利用这一信息，就可以直接将 x 放到它在输出序列中的正确位置上。

## 算法步骤

1. 找出待排序数组中的最大值和最小值
2. 统计数组中每个值为 i 的元素出现的次数，存入计数数组的第 i 项
3. 对所有的计数累加（从计数数组的第一个元素开始，每一项和前一项相加）
4. 反向填充目标数组：将每个元素 i 放在新数组的第 C[i] 项，每放一个元素就将 C[i] 减去 1

## 代码实现

```typescript
/**
 * 计数排序
 * @param arr 待排序数组
 * @returns 排序后的数组
 */
const countingSort = (arr: number[]): number[] => {
  if (arr.length <= 1) {
    return arr;
  }

  // 找出最大值和最小值
  const max = Math.max(...arr);
  const min = Math.min(...arr);

  // 创建计数数组
  const count = new Array(max - min + 1).fill(0);

  // 统计每个元素出现的次数
  for (const num of arr) {
    count[num - min]++;
  }

  // 计算每个元素在排序后数组中的位置
  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
  }

  // 创建结果数组
  const result = new Array(arr.length);

  // 反向填充结果数组
  for (let i = arr.length - 1; i >= 0; i--) {
    const num = arr[i];
    const index = count[num - min] - 1;
    result[index] = num;
    count[num - min]--;
  }

  return result;
};
```

## 优化版本

```typescript
/**
 * 优化后的计数排序（处理负数）
 * @param arr 待排序数组
 * @returns 排序后的数组
 */
const countingSortOptimized = (arr: number[]): number[] => {
  if (arr.length <= 1) {
    return arr;
  }

  // 找出最大值和最小值
  const max = Math.max(...arr);
  const min = Math.min(...arr);

  // 创建计数数组（处理负数情况）
  const range = max - min + 1;
  const count = new Array(range).fill(0);
  const offset = -min; // 偏移量，用于处理负数

  // 统计每个元素出现的次数
  for (const num of arr) {
    count[num + offset]++;
  }

  // 计算每个元素在排序后数组中的位置
  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
  }

  // 创建结果数组
  const result = new Array(arr.length);

  // 反向填充结果数组
  for (let i = arr.length - 1; i >= 0; i--) {
    const num = arr[i];
    const index = count[num + offset] - 1;
    result[index] = num;
    count[num + offset]--;
  }

  return result;
};
```

## 复杂度分析

- 时间复杂度：O(n + k)，其中 k 是待排序数组中的最大值与最小值的差
- 空间复杂度：O(n + k)
- 稳定性：稳定

## 特点

1. 优点：

   - 稳定排序
   - 时间复杂度为 O(n + k)
   - 不需要比较操作

2. 缺点：
   - 需要额外的空间
   - 只适用于整数排序
   - 当数据范围很大时，空间消耗大

## 应用场景

1. 数据范围较小的整数排序
2. 需要稳定排序的场景
3. 数据分布集中的情况
4. 作为其他排序算法的优化手段

## 练习题

1. 实现一个支持浮点数的计数排序
2. 使用计数排序对字符串进行排序
3. 实现一个支持自定义范围的计数排序

## 参考代码

```typescript
// 支持浮点数的计数排序
const countingSortFloat = (arr: number[], precision: number = 2): number[] => {
  if (arr.length <= 1) {
    return arr;
  }

  // 将浮点数转换为整数
  const multiplier = Math.pow(10, precision);
  const intArr = arr.map((num) => Math.round(num * multiplier));

  // 使用计数排序
  const sortedIntArr = countingSort(intArr);

  // 转换回浮点数
  return sortedIntArr.map((num) => num / multiplier);
};

// 字符串计数排序
const countingSortString = (arr: string[]): string[] => {
  if (arr.length <= 1) {
    return arr;
  }

  // 获取字符串的最大长度
  const maxLength = Math.max(...arr.map((str) => str.length));

  // 从最低位开始，对每一位进行计数排序
  for (let i = maxLength - 1; i >= 0; i--) {
    // 创建计数数组（ASCII 码范围）
    const count = new Array(128).fill(0);

    // 统计每个字符出现的次数
    for (const str of arr) {
      const char = i < str.length ? str.charCodeAt(i) : 0;
      count[char]++;
    }

    // 计算每个字符在排序后数组中的位置
    for (let j = 1; j < count.length; j++) {
      count[j] += count[j - 1];
    }

    // 创建临时数组
    const temp = new Array(arr.length);

    // 反向填充临时数组
    for (let j = arr.length - 1; j >= 0; j--) {
      const str = arr[j];
      const char = i < str.length ? str.charCodeAt(i) : 0;
      const index = count[char] - 1;
      temp[index] = str;
      count[char]--;
    }

    // 更新原数组
    arr = temp;
  }

  return arr;
};

// 自定义范围的计数排序
const countingSortCustom = (
  arr: number[],
  min: number,
  max: number
): number[] => {
  if (arr.length <= 1) {
    return arr;
  }

  // 创建计数数组
  const range = max - min + 1;
  const count = new Array(range).fill(0);

  // 统计每个元素出现的次数
  for (const num of arr) {
    if (num < min || num > max) {
      throw new Error("元素超出指定范围");
    }
    count[num - min]++;
  }

  // 计算每个元素在排序后数组中的位置
  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
  }

  // 创建结果数组
  const result = new Array(arr.length);

  // 反向填充结果数组
  for (let i = arr.length - 1; i >= 0; i--) {
    const num = arr[i];
    const index = count[num - min] - 1;
    result[index] = num;
    count[num - min]--;
  }

  return result;
};
```
