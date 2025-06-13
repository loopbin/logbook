# 回溯算法

## 基本概念

回溯算法是一种通过探索所有可能的候选解来找出所有的解的算法。如果候选解被确认不是一个解（或者至少不是最后一个解），回溯算法会通过在上一步进行一些变化来丢弃该解，即"回溯"并且再次尝试。

## 经典问题

### 1. N 皇后问题

```typescript
/**
 * N皇后问题实现
 */
class NQueens {
  /**
   * 解决N皇后问题
   */
  static solve(n: number): string[][] {
    const result: string[][] = [];
    const board = Array.from({ length: n }, () => Array(n).fill("."));

    this.backtrack(board, 0, result);
    return result;
  }

  /**
   * 回溯函数
   */
  private static backtrack(
    board: string[][],
    row: number,
    result: string[][]
  ): void {
    if (row === board.length) {
      result.push(board.map((row) => row.join("")));
      return;
    }

    for (let col = 0; col < board.length; col++) {
      if (this.isValid(board, row, col)) {
        board[row][col] = "Q";
        this.backtrack(board, row + 1, result);
        board[row][col] = ".";
      }
    }
  }

  /**
   * 检查位置是否有效
   */
  private static isValid(board: string[][], row: number, col: number): boolean {
    const n = board.length;

    // 检查列
    for (let i = 0; i < row; i++) {
      if (board[i][col] === "Q") return false;
    }

    // 检查左上对角线
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === "Q") return false;
    }

    // 检查右上对角线
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
      if (board[i][j] === "Q") return false;
    }

    return true;
  }
}
```

### 2. 全排列问题

```typescript
/**
 * 全排列问题实现
 */
class Permutations {
  /**
   * 生成全排列
   */
  static generate<T>(nums: T[]): T[][] {
    const result: T[][] = [];
    this.backtrack(nums, 0, result);
    return result;
  }

  /**
   * 回溯函数
   */
  private static backtrack<T>(nums: T[], start: number, result: T[][]): void {
    if (start === nums.length) {
      result.push([...nums]);
      return;
    }

    for (let i = start; i < nums.length; i++) {
      [nums[start], nums[i]] = [nums[i], nums[start]];
      this.backtrack(nums, start + 1, result);
      [nums[start], nums[i]] = [nums[i], nums[start]];
    }
  }

  /**
   * 生成有重复元素的全排列
   */
  static generateWithDuplicates<T>(nums: T[]): T[][] {
    const result: T[][] = [];
    this.backtrackWithDuplicates(nums, 0, result);
    return result;
  }

  /**
   * 回溯函数（处理重复元素）
   */
  private static backtrackWithDuplicates<T>(
    nums: T[],
    start: number,
    result: T[][]
  ): void {
    if (start === nums.length) {
      result.push([...nums]);
      return;
    }

    const used = new Set<T>();

    for (let i = start; i < nums.length; i++) {
      if (used.has(nums[i])) continue;

      used.add(nums[i]);
      [nums[start], nums[i]] = [nums[i], nums[start]];
      this.backtrackWithDuplicates(nums, start + 1, result);
      [nums[start], nums[i]] = [nums[i], nums[start]];
    }
  }
}
```

### 3. 子集问题

```typescript
/**
 * 子集问题实现
 */
class Subsets {
  /**
   * 生成所有子集
   */
  static generate<T>(nums: T[]): T[][] {
    const result: T[][] = [];
    this.backtrack(nums, 0, [], result);
    return result;
  }

  /**
   * 回溯函数
   */
  private static backtrack<T>(
    nums: T[],
    start: number,
    current: T[],
    result: T[][]
  ): void {
    result.push([...current]);

    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);
      this.backtrack(nums, i + 1, current, result);
      current.pop();
    }
  }

  /**
   * 生成有重复元素的子集
   */
  static generateWithDuplicates<T>(nums: T[]): T[][] {
    const result: T[][] = [];
    nums.sort();
    this.backtrackWithDuplicates(nums, 0, [], result);
    return result;
  }

  /**
   * 回溯函数（处理重复元素）
   */
  private static backtrackWithDuplicates<T>(
    nums: T[],
    start: number,
    current: T[],
    result: T[][]
  ): void {
    result.push([...current]);

    for (let i = start; i < nums.length; i++) {
      if (i > start && nums[i] === nums[i - 1]) continue;

      current.push(nums[i]);
      this.backtrackWithDuplicates(nums, i + 1, current, result);
      current.pop();
    }
  }
}
```

## 应用场景

1. N 皇后问题
2. 全排列问题
3. 子集问题
4. 数独求解
5. 图的着色问题

## 练习题

1. 实现一个支持自定义约束条件的回溯算法
2. 实现一个支持自定义目标函数的回溯算法
3. 实现一个支持自定义剪枝策略的回溯算法

## 参考代码

```typescript
// 支持自定义约束条件的回溯算法
class CustomBacktracking<T> {
  private isValid: (state: T[], candidate: T) => boolean;
  private getCandidates: (state: T[]) => T[];

  constructor(
    isValid: (state: T[], candidate: T) => boolean,
    getCandidates: (state: T[]) => T[]
  ) {
    this.isValid = isValid;
    this.getCandidates = getCandidates;
  }

  solve(initialState: T[]): T[][] {
    const result: T[][] = [];
    this.backtrack(initialState, [], result);
    return result;
  }

  private backtrack(candidates: T[], state: T[], result: T[][]): void {
    if (candidates.length === 0) {
      result.push([...state]);
      return;
    }

    for (const candidate of this.getCandidates(candidates)) {
      if (this.isValid(state, candidate)) {
        state.push(candidate);
        this.backtrack(
          candidates.filter((c) => c !== candidate),
          state,
          result
        );
        state.pop();
      }
    }
  }
}

// 支持自定义目标函数的回溯算法
class GoalBacktracking<T> {
  private isValid: (state: T[], candidate: T) => boolean;
  private getCandidates: (state: T[]) => T[];
  private isGoal: (state: T[]) => boolean;

  constructor(
    isValid: (state: T[], candidate: T) => boolean,
    getCandidates: (state: T[]) => T[],
    isGoal: (state: T[]) => boolean
  ) {
    this.isValid = isValid;
    this.getCandidates = getCandidates;
    this.isGoal = isGoal;
  }

  solve(initialState: T[]): T[][] {
    const result: T[][] = [];
    this.backtrack(initialState, [], result);
    return result;
  }

  private backtrack(candidates: T[], state: T[], result: T[][]): void {
    if (this.isGoal(state)) {
      result.push([...state]);
      return;
    }

    for (const candidate of this.getCandidates(candidates)) {
      if (this.isValid(state, candidate)) {
        state.push(candidate);
        this.backtrack(
          candidates.filter((c) => c !== candidate),
          state,
          result
        );
        state.pop();
      }
    }
  }
}

// 支持自定义剪枝策略的回溯算法
class PruningBacktracking<T> {
  private isValid: (state: T[], candidate: T) => boolean;
  private getCandidates: (state: T[]) => T[];
  private shouldPrune: (state: T[], candidate: T) => boolean;

  constructor(
    isValid: (state: T[], candidate: T) => boolean,
    getCandidates: (state: T[]) => T[],
    shouldPrune: (state: T[], candidate: T) => boolean
  ) {
    this.isValid = isValid;
    this.getCandidates = getCandidates;
    this.shouldPrune = shouldPrune;
  }

  solve(initialState: T[]): T[][] {
    const result: T[][] = [];
    this.backtrack(initialState, [], result);
    return result;
  }

  private backtrack(candidates: T[], state: T[], result: T[][]): void {
    if (candidates.length === 0) {
      result.push([...state]);
      return;
    }

    for (const candidate of this.getCandidates(candidates)) {
      if (this.shouldPrune(state, candidate)) continue;

      if (this.isValid(state, candidate)) {
        state.push(candidate);
        this.backtrack(
          candidates.filter((c) => c !== candidate),
          state,
          result
        );
        state.pop();
      }
    }
  }
}

// 使用示例
const nQueens = new CustomBacktracking<number>(
  (state, candidate) => {
    const row = state.length;
    return !state.some((col, i) => {
      return (
        col === candidate || // 同列
        Math.abs(col - candidate) === Math.abs(i - row)
      ); // 对角线
    });
  },
  (candidates) => candidates
);

console.log(nQueens.solve([0, 1, 2, 3]));

const permutations = new GoalBacktracking<number>(
  (state, candidate) => !state.includes(candidate),
  (candidates) => candidates,
  (state) => state.length === 4
);

console.log(permutations.solve([1, 2, 3, 4]));

const subsets = new PruningBacktracking<number>(
  (state, candidate) => true,
  (candidates) => candidates,
  (state, candidate) => state.length > 0 && candidate < state[state.length - 1]
);

console.log(subsets.solve([1, 2, 3]));
```
