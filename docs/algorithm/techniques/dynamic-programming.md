# 动态规划

## 基本概念

动态规划是一种通过把原问题分解为相对简单的子问题来解决复杂问题的方法。动态规划常常适用于有重叠子问题和最优子结构性质的问题。

## 经典问题

### 1. 斐波那契数列

```typescript
/**
 * 斐波那契数列实现
 */
class Fibonacci {
  /**
   * 递归实现
   */
  static recursive(n: number): number {
    if (n <= 1) return n;
    return this.recursive(n - 1) + this.recursive(n - 2);
  }

  /**
   * 动态规划实现
   */
  static dp(n: number): number {
    if (n <= 1) return n;

    const dp = new Array(n + 1).fill(0);
    dp[1] = 1;

    for (let i = 2; i <= n; i++) {
      dp[i] = dp[i - 1] + dp[i - 2];
    }

    return dp[n];
  }

  /**
   * 空间优化实现
   */
  static optimized(n: number): number {
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
}
```

### 2. 最长公共子序列

```typescript
/**
 * 最长公共子序列实现
 */
class LongestCommonSubsequence {
  /**
   * 动态规划实现
   */
  static find(text1: string, text2: string): string {
    const m = text1.length;
    const n = text2.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    // 填充dp表
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (text1[i - 1] === text2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    // 重建最长公共子序列
    const lcs: string[] = [];
    let i = m;
    let j = n;

    while (i > 0 && j > 0) {
      if (text1[i - 1] === text2[j - 1]) {
        lcs.unshift(text1[i - 1]);
        i--;
        j--;
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }

    return lcs.join("");
  }

  /**
   * 空间优化实现
   */
  static findOptimized(text1: string, text2: string): string {
    const m = text1.length;
    const n = text2.length;
    let prev = Array(n + 1).fill(0);
    let curr = Array(n + 1).fill(0);

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (text1[i - 1] === text2[j - 1]) {
          curr[j] = prev[j - 1] + 1;
        } else {
          curr[j] = Math.max(prev[j], curr[j - 1]);
        }
      }
      [prev, curr] = [curr, prev];
    }

    // 重建最长公共子序列
    const lcs: string[] = [];
    let i = m;
    let j = n;

    while (i > 0 && j > 0) {
      if (text1[i - 1] === text2[j - 1]) {
        lcs.unshift(text1[i - 1]);
        i--;
        j--;
      } else if (prev[j] > curr[j - 1]) {
        i--;
      } else {
        j--;
      }
    }

    return lcs.join("");
  }
}
```

### 3. 背包问题

```typescript
/**
 * 背包问题实现
 */
class Knapsack {
  /**
   * 0-1背包问题
   */
  static zeroOneKnapsack(
    weights: number[],
    values: number[],
    capacity: number
  ): number {
    const n = weights.length;
    const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
        if (weights[i - 1] <= w) {
          dp[i][w] = Math.max(
            dp[i - 1][w],
            dp[i - 1][w - weights[i - 1]] + values[i - 1]
          );
        } else {
          dp[i][w] = dp[i - 1][w];
        }
      }
    }

    return dp[n][capacity];
  }

  /**
   * 完全背包问题
   */
  static unboundedKnapsack(
    weights: number[],
    values: number[],
    capacity: number
  ): number {
    const n = weights.length;
    const dp = Array(capacity + 1).fill(0);

    for (let w = 0; w <= capacity; w++) {
      for (let i = 0; i < n; i++) {
        if (weights[i] <= w) {
          dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
        }
      }
    }

    return dp[capacity];
  }

  /**
   * 多重背包问题
   */
  static boundedKnapsack(
    weights: number[],
    values: number[],
    counts: number[],
    capacity: number
  ): number {
    const n = weights.length;
    const dp = Array(capacity + 1).fill(0);

    for (let i = 0; i < n; i++) {
      for (let w = capacity; w >= weights[i]; w--) {
        for (let k = 1; k <= counts[i] && k * weights[i] <= w; k++) {
          dp[w] = Math.max(dp[w], dp[w - k * weights[i]] + k * values[i]);
        }
      }
    }

    return dp[capacity];
  }
}
```

## 应用场景

1. 斐波那契数列
2. 最长公共子序列
3. 背包问题
4. 最短路径问题
5. 编辑距离

## 练习题

1. 实现一个支持自定义状态转移方程的动态规划算法
2. 实现一个支持自定义目标函数的背包问题算法
3. 实现一个支持自定义约束条件的动态规划算法

## 参考代码

```typescript
// 支持自定义状态转移方程的动态规划算法
class CustomDynamicProgramming<T> {
  private stateTransition: (state: T, params: any) => T;
  private initialState: T;

  constructor(stateTransition: (state: T, params: any) => T, initialState: T) {
    this.stateTransition = stateTransition;
    this.initialState = initialState;
  }

  solve(params: any[]): T {
    let state = this.initialState;

    for (const param of params) {
      state = this.stateTransition(state, param);
    }

    return state;
  }
}

// 支持自定义目标函数的背包问题算法
class CustomKnapsack<T> {
  private getWeight: (item: T) => number;
  private getValue: (item: T) => number;
  private isCompatible: (item1: T, item2: T) => boolean;

  constructor(
    getWeight: (item: T) => number,
    getValue: (item: T) => number,
    isCompatible: (item1: T, item2: T) => boolean
  ) {
    this.getWeight = getWeight;
    this.getValue = getValue;
    this.isCompatible = isCompatible;
  }

  solve(items: T[], capacity: number): T[] {
    const n = items.length;
    const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
    const selected = Array.from({ length: n + 1 }, () =>
      Array(capacity + 1).fill(false)
    );

    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
        const weight = this.getWeight(items[i - 1]);
        const value = this.getValue(items[i - 1]);

        if (weight <= w) {
          const newValue = dp[i - 1][w - weight] + value;
          if (newValue > dp[i - 1][w]) {
            dp[i][w] = newValue;
            selected[i][w] = true;
          } else {
            dp[i][w] = dp[i - 1][w];
          }
        } else {
          dp[i][w] = dp[i - 1][w];
        }
      }
    }

    // 重建选择的物品
    const result: T[] = [];
    let w = capacity;
    for (let i = n; i > 0; i--) {
      if (selected[i][w]) {
        result.unshift(items[i - 1]);
        w -= this.getWeight(items[i - 1]);
      }
    }

    return result;
  }
}

// 支持自定义约束条件的动态规划算法
class ConstrainedDynamicProgramming<T> {
  private stateTransition: (state: T, params: any) => T;
  private initialState: T;
  private constraints: ((state: T, params: any) => boolean)[];

  constructor(
    stateTransition: (state: T, params: any) => T,
    initialState: T,
    constraints: ((state: T, params: any) => boolean)[]
  ) {
    this.stateTransition = stateTransition;
    this.initialState = initialState;
    this.constraints = constraints;
  }

  solve(params: any[]): T | null {
    let state = this.initialState;

    for (const param of params) {
      const nextState = this.stateTransition(state, param);

      // 检查所有约束条件
      const isValid = this.constraints.every((constraint) =>
        constraint(nextState, param)
      );

      if (isValid) {
        state = nextState;
      } else {
        return null; // 不满足约束条件
      }
    }

    return state;
  }
}

// 使用示例
const fibonacci = new CustomDynamicProgramming<number>(
  (state, n) => state + n,
  0
);
console.log(fibonacci.solve([1, 1, 2, 3, 5])); // 12

interface Item {
  weight: number;
  value: number;
  type: string;
}

const knapsack = new CustomKnapsack<Item>(
  (item) => item.weight,
  (item) => item.value,
  (item1, item2) => item1.type !== item2.type
);

const items: Item[] = [
  { weight: 2, value: 3, type: "A" },
  { weight: 3, value: 4, type: "B" },
  { weight: 4, value: 5, type: "A" },
  { weight: 5, value: 6, type: "B" },
];

console.log(knapsack.solve(items, 10));

const constrainedDP = new ConstrainedDynamicProgramming<number>(
  (state, n) => state + n,
  0,
  [(state) => state >= 0, (state) => state <= 100]
);

console.log(constrainedDP.solve([1, 2, 3, 4, 5])); // 15
console.log(constrainedDP.solve([-1, 2, 3, 4, 5])); // null
```
