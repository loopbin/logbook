# 算法复杂度分析

## 基本概念

### 时间复杂度

时间复杂度用于评估算法运行时间随输入规模增长的变化趋势。通常使用大 O 表示法来描述。

### 空间复杂度

空间复杂度用于评估算法额外空间使用量随输入规模增长的变化趋势。

## 常见复杂度

### 1. 常数时间 O(1)

```typescript
// 示例：数组随机访问
const arr = [1, 2, 3, 4, 5];
const element = arr[2]; // O(1)

// 示例：哈希表查找
const map = new Map<string, number>();
map.set("key", 1);
const value = map.get("key"); // O(1)
```

### 2. 对数时间 O(log n)

```typescript
// 示例：二分查找
function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}
```

### 3. 线性时间 O(n)

```typescript
// 示例：数组遍历
function findMax(arr: number[]): number {
  let max = arr[0];
  for (const num of arr) {
    if (num > max) max = num;
  }
  return max;
}

// 示例：链表遍历
function findMiddle(head: ListNode): ListNode {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}
```

### 4. 线性对数时间 O(n log n)

```typescript
// 示例：归并排序
function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}
```

### 5. 平方时间 O(n²)

```typescript
// 示例：冒泡排序
function bubbleSort(arr: number[]): void {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
}

// 示例：选择排序
function selectionSort(arr: number[]): void {
  for (let i = 0; i < arr.length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) minIndex = j;
    }
    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
  }
}
```

### 6. 指数时间 O(2^n)

```typescript
// 示例：斐波那契数列（递归）
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// 示例：子集生成
function generateSubsets(nums: number[]): number[][] {
  const result: number[][] = [];
  const n = nums.length;

  for (let i = 0; i < 1 << n; i++) {
    const subset: number[] = [];
    for (let j = 0; j < n; j++) {
      if (i & (1 << j)) subset.push(nums[j]);
    }
    result.push(subset);
  }

  return result;
}
```

## 复杂度分析技巧

### 1. 循环分析

```typescript
// 单层循环
for (let i = 0; i < n; i++) {
  // O(1) 操作
} // O(n)

// 嵌套循环
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    // O(1) 操作
  }
} // O(n²)

// 不同步长的循环
for (let i = 0; i < n; i *= 2) {
  // O(1) 操作
} // O(log n)
```

### 2. 递归分析

```typescript
// 线性递归
function linearRecursion(n: number): number {
  if (n <= 1) return 1;
  return linearRecursion(n - 1) + 1;
} // O(n)

// 二分递归
function binaryRecursion(n: number): number {
  if (n <= 1) return 1;
  return binaryRecursion(n / 2) + 1;
} // O(log n)

// 树形递归
function treeRecursion(n: number): number {
  if (n <= 1) return 1;
  return treeRecursion(n - 1) + treeRecursion(n - 2);
} // O(2^n)
```

### 3. 空间复杂度分析

```typescript
// 原地算法
function inPlaceSort(arr: number[]): void {
  for (let i = 0; i < arr.length; i++) {
    // 只使用常数额外空间
  }
} // O(1)

// 线性空间
function linearSpace(n: number): number[] {
  const result = new Array(n);
  for (let i = 0; i < n; i++) {
    result[i] = i;
  }
  return result;
} // O(n)

// 递归空间
function recursiveSpace(n: number): number {
  if (n <= 1) return 1;
  return recursiveSpace(n - 1) + 1;
} // O(n) 调用栈空间
```

## 优化技巧

### 1. 时间换空间

```typescript
// 使用哈希表优化查找
function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }

  return [];
} // 时间：O(n)，空间：O(n)
```

### 2. 空间换时间

```typescript
// 使用动态规划优化斐波那契
function fibonacciDP(n: number): number {
  const dp = new Array(n + 1).fill(0);
  dp[1] = 1;

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
} // 时间：O(n)，空间：O(n)
```

### 3. 分治优化

```typescript
// 使用分治优化矩阵乘法
function matrixMultiply(A: number[][], B: number[][]): number[][] {
  const n = A.length;
  if (n === 1) return [[A[0][0] * B[0][0]]];

  const mid = n / 2;
  const A11 = A.slice(0, mid).map((row) => row.slice(0, mid));
  const A12 = A.slice(0, mid).map((row) => row.slice(mid));
  const A21 = A.slice(mid).map((row) => row.slice(0, mid));
  const A22 = A.slice(mid).map((row) => row.slice(mid));

  const B11 = B.slice(0, mid).map((row) => row.slice(0, mid));
  const B12 = B.slice(0, mid).map((row) => row.slice(mid));
  const B21 = B.slice(mid).map((row) => row.slice(0, mid));
  const B22 = B.slice(mid).map((row) => row.slice(mid));

  const C11 = add(matrixMultiply(A11, B11), matrixMultiply(A12, B21));
  const C12 = add(matrixMultiply(A11, B12), matrixMultiply(A12, B22));
  const C21 = add(matrixMultiply(A21, B11), matrixMultiply(A22, B21));
  const C22 = add(matrixMultiply(A21, B12), matrixMultiply(A22, B22));

  return combine(C11, C12, C21, C22);
} // 时间：O(n^log2(7))，空间：O(n²)
```

## 练习题

1. 分析以下算法的时间复杂度：

   ```typescript
   function mystery(n: number): number {
     let count = 0;
     for (let i = 1; i <= n; i *= 2) {
       for (let j = 1; j <= i; j++) {
         count++;
       }
     }
     return count;
   }
   ```

2. 分析以下算法的空间复杂度：

   ```typescript
   function recursive(n: number): number[] {
     if (n <= 0) return [];
     return [n, ...recursive(n - 1)];
   }
   ```

3. 优化以下算法的时间复杂度：
   ```typescript
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
   ```

## 参考代码

```typescript
// 练习题1答案：O(n)
// 练习题2答案：O(n)
// 练习题3答案：O(n)
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
