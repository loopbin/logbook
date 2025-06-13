# 分治算法

## 基本概念

分治算法是一种将问题分解为更小的子问题，递归地解决这些子问题，然后将子问题的解合并得到原问题解的算法设计方法。分治算法的基本步骤包括：分解、解决和合并。

## 经典问题

### 1. 归并排序

```typescript
/**
 * 归并排序实现
 */
class MergeSort {
  /**
   * 归并排序
   */
  static sort<T>(arr: T[], comparator: (a: T, b: T) => number): T[] {
    if (arr.length <= 1) {
      return arr;
    }

    const mid = Math.floor(arr.length / 2);
    const left = this.sort(arr.slice(0, mid), comparator);
    const right = this.sort(arr.slice(mid), comparator);

    return this.merge(left, right, comparator);
  }

  /**
   * 合并两个有序数组
   */
  private static merge<T>(
    left: T[],
    right: T[],
    comparator: (a: T, b: T) => number
  ): T[] {
    const result: T[] = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
      if (comparator(left[i], right[j]) <= 0) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
      }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
  }
}
```

### 2. 快速排序

```typescript
/**
 * 快速排序实现
 */
class QuickSort {
  /**
   * 快速排序
   */
  static sort<T>(arr: T[], comparator: (a: T, b: T) => number): T[] {
    if (arr.length <= 1) {
      return arr;
    }

    const pivot = arr[Math.floor(arr.length / 2)];
    const left: T[] = [];
    const middle: T[] = [];
    const right: T[] = [];

    for (const item of arr) {
      const comparison = comparator(item, pivot);
      if (comparison < 0) {
        left.push(item);
      } else if (comparison === 0) {
        middle.push(item);
      } else {
        right.push(item);
      }
    }

    return [
      ...this.sort(left, comparator),
      ...middle,
      ...this.sort(right, comparator),
    ];
  }
}
```

### 3. 最近点对问题

```typescript
/**
 * 最近点对问题实现
 */
class ClosestPair {
  /**
   * 计算两点之间的距离
   */
  private static distance(p1: [number, number], p2: [number, number]): number {
    const dx = p1[0] - p2[0];
    const dy = p1[1] - p2[1];
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * 找到最近点对
   */
  static findClosestPair(points: [number, number][]): {
    pair: [[number, number], [number, number]];
    distance: number;
  } {
    // 按x坐标排序
    const sortedPoints = [...points].sort((a, b) => a[0] - b[0]);
    return this.findClosestPairRecursive(sortedPoints);
  }

  /**
   * 递归查找最近点对
   */
  private static findClosestPairRecursive(points: [number, number][]): {
    pair: [[number, number], [number, number]];
    distance: number;
  } {
    if (points.length <= 3) {
      return this.findClosestPairBruteForce(points);
    }

    const mid = Math.floor(points.length / 2);
    const midX = points[mid][0];

    const left = points.slice(0, mid);
    const right = points.slice(mid);

    const leftResult = this.findClosestPairRecursive(left);
    const rightResult = this.findClosestPairRecursive(right);

    let minResult =
      leftResult.distance < rightResult.distance ? leftResult : rightResult;

    // 检查跨越中线的点对
    const strip = points.filter(
      (p) => Math.abs(p[0] - midX) < minResult.distance
    );

    // 按y坐标排序
    strip.sort((a, b) => a[1] - b[1]);

    for (let i = 0; i < strip.length; i++) {
      for (let j = i + 1; j < Math.min(i + 7, strip.length); j++) {
        const dist = this.distance(strip[i], strip[j]);
        if (dist < minResult.distance) {
          minResult = {
            pair: [strip[i], strip[j]],
            distance: dist,
          };
        }
      }
    }

    return minResult;
  }

  /**
   * 暴力查找最近点对
   */
  private static findClosestPairBruteForce(points: [number, number][]): {
    pair: [[number, number], [number, number]];
    distance: number;
  } {
    let minDistance = Infinity;
    let minPair: [[number, number], [number, number]] = [points[0], points[1]];

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dist = this.distance(points[i], points[j]);
        if (dist < minDistance) {
          minDistance = dist;
          minPair = [points[i], points[j]];
        }
      }
    }

    return {
      pair: minPair,
      distance: minDistance,
    };
  }
}
```

## 应用场景

1. 排序算法（归并排序、快速排序）
2. 最近点对问题
3. 矩阵乘法（Strassen 算法）
4. 大整数乘法
5. 快速傅里叶变换

## 练习题

1. 实现一个支持自定义比较器的归并排序
2. 实现一个支持原地排序的快速排序
3. 实现一个支持多线程的归并排序

## 参考代码

```typescript
// 支持自定义比较器的归并排序
class CustomMergeSort<T> {
  private comparator: (a: T, b: T) => number;

  constructor(comparator: (a: T, b: T) => number) {
    this.comparator = comparator;
  }

  sort(arr: T[]): T[] {
    if (arr.length <= 1) {
      return arr;
    }

    const mid = Math.floor(arr.length / 2);
    const left = this.sort(arr.slice(0, mid));
    const right = this.sort(arr.slice(mid));

    return this.merge(left, right);
  }

  private merge(left: T[], right: T[]): T[] {
    const result: T[] = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
      if (this.comparator(left[i], right[j]) <= 0) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
      }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
  }
}

// 支持原地排序的快速排序
class InPlaceQuickSort<T> {
  private comparator: (a: T, b: T) => number;

  constructor(comparator: (a: T, b: T) => number) {
    this.comparator = comparator;
  }

  sort(arr: T[]): void {
    this.quickSort(arr, 0, arr.length - 1);
  }

  private quickSort(arr: T[], low: number, high: number): void {
    if (low < high) {
      const pivot = this.partition(arr, low, high);
      this.quickSort(arr, low, pivot - 1);
      this.quickSort(arr, pivot + 1, high);
    }
  }

  private partition(arr: T[], low: number, high: number): number {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (this.comparator(arr[j], pivot) <= 0) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
  }
}

// 支持多线程的归并排序
class ParallelMergeSort<T> {
  private comparator: (a: T, b: T) => number;
  private maxThreads: number;

  constructor(comparator: (a: T, b: T) => number, maxThreads = 4) {
    this.comparator = comparator;
    this.maxThreads = maxThreads;
  }

  async sort(arr: T[]): Promise<T[]> {
    return this.parallelSort(arr, 0, arr.length - 1, 1);
  }

  private async parallelSort(
    arr: T[],
    low: number,
    high: number,
    threadCount: number
  ): Promise<T[]> {
    if (low >= high) {
      return [arr[low]];
    }

    const mid = Math.floor((low + high) / 2);
    let left: T[];
    let right: T[];

    if (threadCount < this.maxThreads) {
      const [leftResult, rightResult] = await Promise.all([
        this.parallelSort(arr, low, mid, threadCount * 2),
        this.parallelSort(arr, mid + 1, high, threadCount * 2),
      ]);
      left = leftResult;
      right = rightResult;
    } else {
      left = await this.parallelSort(arr, low, mid, threadCount);
      right = await this.parallelSort(arr, mid + 1, high, threadCount);
    }

    return this.merge(left, right);
  }

  private merge(left: T[], right: T[]): T[] {
    const result: T[] = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
      if (this.comparator(left[i], right[j]) <= 0) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
      }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
  }
}

// 使用示例
const arr = [5, 3, 7, 1, 9];
const mergeSort = new CustomMergeSort<number>((a, b) => a - b);
console.log(mergeSort.sort(arr)); // [1, 3, 5, 7, 9]

const quickSort = new InPlaceQuickSort<number>((a, b) => a - b);
quickSort.sort(arr);
console.log(arr); // [1, 3, 5, 7, 9]

const parallelSort = new ParallelMergeSort<number>((a, b) => a - b);
parallelSort.sort(arr).then((result) => {
  console.log(result); // [1, 3, 5, 7, 9]
});
```
