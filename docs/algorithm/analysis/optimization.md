# 算法优化方案

## 优化方向

### 1. 时间复杂度优化

#### 1.1 数据结构优化

- 使用哈希表替代数组查找 [哈希表实现](../data-structures/hash-table.md)
- 使用堆优化排序 [堆排序实现](../sorting/heap-sort.md)
- 使用树结构优化查找 [树结构实现](../data-structures/tree.md)

```typescript
// 优化前：O(n²)
function findDuplicates(arr: number[]): number[] {
  const result: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        result.push(arr[i]);
      }
    }
  }
  return result;
}

// 优化后：O(n)
function findDuplicatesOptimized(arr: number[]): number[] {
  const seen = new Set<number>();
  const result: number[] = [];

  for (const num of arr) {
    if (seen.has(num)) {
      result.push(num);
    } else {
      seen.add(num);
    }
  }

  return result;
}
```

#### 1.2 算法策略优化

- 使用分治策略 [分治算法](../techniques/divide-conquer.md)
- 使用动态规划 [动态规划](../techniques/dynamic-programming.md)
- 使用贪心策略 [贪心算法](../techniques/greedy.md)

```typescript
// 优化前：O(2^n)
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// 优化后：O(n)
function fibonacciOptimized(n: number): number {
  if (n <= 1) return n;

  let prev = 0;
  let curr = 1;

  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }

  return curr;
}
```

### 2. 空间复杂度优化

#### 2.1 原地算法

- 使用原地排序 [快速排序](../sorting/quick-sort.md)
- 使用原地反转 [链表反转](../data-structures/linked-list.md)
- 使用原地交换 [冒泡排序](../sorting/bubble-sort.md)

```typescript
// 优化前：O(n)
function reverseArray(arr: number[]): number[] {
  const result: number[] = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    result.push(arr[i]);
  }
  return result;
}

// 优化后：O(1)
function reverseArrayInPlace(arr: number[]): void {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
}
```

#### 2.2 空间复用

- 使用位运算优化 [位运算技巧](./bit-manipulation.md)
- 使用状态压缩 [状态压缩 DP](../techniques/dynamic-programming.md)
- 使用滑动窗口 [滑动窗口技巧](./sliding-window.md)

```typescript
// 优化前：O(n)
function isPowerOfTwo(n: number): boolean {
  if (n <= 0) return false;
  while (n % 2 === 0) {
    n /= 2;
  }
  return n === 1;
}

// 优化后：O(1)
function isPowerOfTwoOptimized(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0;
}
```

### 3. 代码优化

#### 3.1 循环优化

- 减少循环嵌套 [循环优化技巧](./loop-optimization.md)
- 使用双指针 [双指针技巧](./two-pointers.md)
- 使用前缀和 [前缀和技巧](./prefix-sum.md)

```typescript
// 优化前：O(n²)
function findPairSum(arr: number[], target: number): [number, number] | null {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] + arr[j] === target) {
        return [arr[i], arr[j]];
      }
    }
  }
  return null;
}

// 优化后：O(n)
function findPairSumOptimized(
  arr: number[],
  target: number
): [number, number] | null {
  const map = new Map<number, number>();

  for (let i = 0; i < arr.length; i++) {
    const complement = target - arr[i];
    if (map.has(complement)) {
      return [complement, arr[i]];
    }
    map.set(arr[i], i);
  }

  return null;
}
```

#### 3.2 递归优化

- 使用尾递归 [尾递归优化](./tail-recursion.md)
- 使用记忆化 [记忆化搜索](../techniques/dynamic-programming.md)
- 使用迭代替代递归 [迭代优化](./iteration.md)

```typescript
// 优化前：O(2^n)
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// 优化后：O(n)
function fibonacciMemoized(
  n: number,
  memo: Map<number, number> = new Map()
): number {
  if (memo.has(n)) return memo.get(n)!;
  if (n <= 1) return n;

  const result =
    fibonacciMemoized(n - 1, memo) + fibonacciMemoized(n - 2, memo);
  memo.set(n, result);
  return result;
}
```

## 优化实践

### 1. 排序算法优化

- [快速排序优化](../sorting/quick-sort.md#优化方案)
- [归并排序优化](../sorting/merge-sort.md#优化方案)
- [堆排序优化](../sorting/heap-sort.md#优化方案)

### 2. 查找算法优化

- [二分查找优化](../searching/binary-search.md#优化方案)
- [哈希查找优化](../searching/hash-search.md#优化方案)
- [树形查找优化](../data-structures/tree.md#优化方案)

### 3. 数据结构优化

- [数组优化](../data-structures/array.md#优化方案)
- [链表优化](../data-structures/linked-list.md#优化方案)
- [树结构优化](../data-structures/tree.md#优化方案)

## 练习题

1. 优化以下代码的时间复杂度：

```typescript
function findCommonElements(arr1: number[], arr2: number[]): number[] {
  const result: number[] = [];
  for (const num1 of arr1) {
    for (const num2 of arr2) {
      if (num1 === num2) {
        result.push(num1);
      }
    }
  }
  return result;
}
```

2. 优化以下代码的空间复杂度：

```typescript
function rotateArray(arr: number[], k: number): number[] {
  const result = new Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    result[(i + k) % arr.length] = arr[i];
  }
  return result;
}
```

3. 优化以下代码的递归实现：

```typescript
function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
```

## 参考代码

```typescript
// 练习题1答案：O(n)
function findCommonElementsOptimized(arr1: number[], arr2: number[]): number[] {
  const set = new Set(arr1);
  return arr2.filter((num) => set.has(num));
}

// 练习题2答案：O(1)
function rotateArrayInPlace(arr: number[], k: number): void {
  k = k % arr.length;
  reverse(arr, 0, arr.length - 1);
  reverse(arr, 0, k - 1);
  reverse(arr, k, arr.length - 1);
}

function reverse(arr: number[], start: number, end: number): void {
  while (start < end) {
    [arr[start], arr[end]] = [arr[end], arr[start]];
    start++;
    end--;
  }
}

// 练习题3答案：O(n)
function factorialIterative(n: number): number {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}
```
