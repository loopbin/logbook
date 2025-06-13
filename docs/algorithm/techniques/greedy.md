# 贪心算法

## 基本概念

贪心算法是一种在每一步选择中都采取当前状态下最好或最优的选择，从而希望导致结果是最好或最优的算法策略。贪心算法并不总是能得到最优解，但在某些问题上可以得到最优解。

## 经典问题

### 1. 活动选择问题

```typescript
/**
 * 活动选择问题实现
 */
class ActivitySelection {
  /**
   * 活动选择
   * @param activities 活动列表，每个活动包含开始时间和结束时间
   * @returns 选择的活动列表
   */
  static select(
    activities: Array<{ start: number; end: number }>
  ): Array<{ start: number; end: number }> {
    // 按结束时间排序
    const sortedActivities = [...activities].sort((a, b) => a.end - b.end);
    const selected: Array<{ start: number; end: number }> = [];
    let lastEnd = 0;

    for (const activity of sortedActivities) {
      if (activity.start >= lastEnd) {
        selected.push(activity);
        lastEnd = activity.end;
      }
    }

    return selected;
  }
}
```

### 2. 霍夫曼编码

```typescript
/**
 * 霍夫曼编码实现
 */
class HuffmanCoding {
  private static readonly LEFT = "0";
  private static readonly RIGHT = "1";

  /**
   * 霍夫曼树节点
   */
  private static class HuffmanNode {
    char: string;
    frequency: number;
    left: HuffmanNode | null;
    right: HuffmanNode | null;

    constructor(char: string, frequency: number) {
      this.char = char;
      this.frequency = frequency;
      this.left = null;
      this.right = null;
    }
  }

  /**
   * 构建霍夫曼树
   */
  private static buildHuffmanTree(frequencies: Map<string, number>): HuffmanNode {
    const nodes: HuffmanNode[] = [];

    // 创建叶节点
    for (const [char, freq] of frequencies) {
      nodes.push(new HuffmanNode(char, freq));
    }

    // 构建树
    while (nodes.length > 1) {
      // 按频率排序
      nodes.sort((a, b) => a.frequency - b.frequency);

      // 取出频率最小的两个节点
      const left = nodes.shift()!;
      const right = nodes.shift()!;

      // 创建新节点
      const parent = new HuffmanNode("", left.frequency + right.frequency);
      parent.left = left;
      parent.right = right;

      nodes.push(parent);
    }

    return nodes[0];
  }

  /**
   * 生成霍夫曼编码
   */
  private static generateCodes(
    node: HuffmanNode,
    code: string,
    codes: Map<string, string>
  ): void {
    if (!node) return;

    if (!node.left && !node.right) {
      codes.set(node.char, code);
      return;
    }

    this.generateCodes(node.left!, code + this.LEFT, codes);
    this.generateCodes(node.right!, code + this.RIGHT, codes);
  }

  /**
   * 编码
   */
  static encode(text: string): { encoded: string; codes: Map<string, string> } {
    // 计算频率
    const frequencies = new Map<string, number>();
    for (const char of text) {
      frequencies.set(char, (frequencies.get(char) || 0) + 1);
    }

    // 构建霍夫曼树
    const root = this.buildHuffmanTree(frequencies);

    // 生成编码
    const codes = new Map<string, string>();
    this.generateCodes(root, "", codes);

    // 编码文本
    const encoded = text.split("").map(char => codes.get(char)).join("");

    return { encoded, codes };
  }

  /**
   * 解码
   */
  static decode(encoded: string, codes: Map<string, string>): string {
    const reverseCodes = new Map<string, string>();
    for (const [char, code] of codes) {
      reverseCodes.set(code, char);
    }

    let decoded = "";
    let currentCode = "";

    for (const bit of encoded) {
      currentCode += bit;
      if (reverseCodes.has(currentCode)) {
        decoded += reverseCodes.get(currentCode);
        currentCode = "";
      }
    }

    return decoded;
  }
}
```

### 3. 最小生成树（Kruskal 算法）

```typescript
/**
 * 最小生成树（Kruskal算法）实现
 */
class KruskalMST {
  /**
   * 边
   */
  private static class Edge {
    from: number;
    to: number;
    weight: number;

    constructor(from: number, to: number, weight: number) {
      this.from = from;
      this.to = to;
      this.weight = weight;
    }
  }

  /**
   * 并查集
   */
  private static class UnionFind {
    private parent: number[];
    private rank: number[];

    constructor(size: number) {
      this.parent = Array.from({ length: size }, (_, i) => i);
      this.rank = Array(size).fill(0);
    }

    find(x: number): number {
      if (this.parent[x] !== x) {
        this.parent[x] = this.find(this.parent[x]);
      }
      return this.parent[x];
    }

    union(x: number, y: number): void {
      const rootX = this.find(x);
      const rootY = this.find(y);

      if (rootX === rootY) return;

      if (this.rank[rootX] < this.rank[rootY]) {
        this.parent[rootX] = rootY;
      } else if (this.rank[rootX] > this.rank[rootY]) {
        this.parent[rootY] = rootX;
      } else {
        this.parent[rootY] = rootX;
        this.rank[rootX]++;
      }
    }
  }

  /**
   * 找到最小生成树
   */
  static findMST(edges: Edge[], vertexCount: number): Edge[] {
    // 按权重排序
    edges.sort((a, b) => a.weight - b.weight);

    const mst: Edge[] = [];
    const uf = new UnionFind(vertexCount);

    for (const edge of edges) {
      if (uf.find(edge.from) !== uf.find(edge.to)) {
        mst.push(edge);
        uf.union(edge.from, edge.to);
      }
    }

    return mst;
  }
}
```

## 应用场景

1. 活动选择问题
2. 霍夫曼编码
3. 最小生成树
4. 最短路径（Dijkstra 算法）
5. 任务调度

## 练习题

1. 实现一个支持自定义比较器的活动选择算法
2. 实现一个支持自定义权重的霍夫曼编码
3. 实现一个支持自定义边权重的最小生成树算法

## 参考代码

```typescript
// 支持自定义比较器的活动选择算法
class CustomActivitySelection<T> {
  private comparator: (a: T, b: T) => number;
  private getStart: (activity: T) => number;
  private getEnd: (activity: T) => number;

  constructor(
    comparator: (a: T, b: T) => number,
    getStart: (activity: T) => number,
    getEnd: (activity: T) => number
  ) {
    this.comparator = comparator;
    this.getStart = getStart;
    this.getEnd = getEnd;
  }

  select(activities: T[]): T[] {
    const sortedActivities = [...activities].sort(this.comparator);
    const selected: T[] = [];
    let lastEnd = 0;

    for (const activity of sortedActivities) {
      if (this.getStart(activity) >= lastEnd) {
        selected.push(activity);
        lastEnd = this.getEnd(activity);
      }
    }

    return selected;
  }
}

// 支持自定义权重的霍夫曼编码
class CustomHuffmanCoding<T> {
  private static readonly LEFT = "0";
  private static readonly RIGHT = "1";

  private static class HuffmanNode<T> {
    value: T;
    weight: number;
    left: HuffmanNode<T> | null;
    right: HuffmanNode<T> | null;

    constructor(value: T, weight: number) {
      this.value = value;
      this.weight = weight;
      this.left = null;
      this.right = null;
    }
  }

  private static buildHuffmanTree<T>(weights: Map<T, number>): HuffmanNode<T> {
    const nodes: HuffmanNode<T>[] = [];

    for (const [value, weight] of weights) {
      nodes.push(new HuffmanNode(value, weight));
    }

    while (nodes.length > 1) {
      nodes.sort((a, b) => a.weight - b.weight);

      const left = nodes.shift()!;
      const right = nodes.shift()!;

      const parent = new HuffmanNode<T>(null as T, left.weight + right.weight);
      parent.left = left;
      parent.right = right;

      nodes.push(parent);
    }

    return nodes[0];
  }

  private static generateCodes<T>(
    node: HuffmanNode<T>,
    code: string,
    codes: Map<T, string>
  ): void {
    if (!node) return;

    if (!node.left && !node.right) {
      codes.set(node.value, code);
      return;
    }

    this.generateCodes(node.left!, code + this.LEFT, codes);
    this.generateCodes(node.right!, code + this.RIGHT, codes);
  }

  static encode<T>(values: T[], getWeight: (value: T) => number): {
    encoded: string;
    codes: Map<T, string>;
  } {
    const weights = new Map<T, number>();
    for (const value of values) {
      weights.set(value, getWeight(value));
    }

    const root = this.buildHuffmanTree(weights);
    const codes = new Map<T, string>();
    this.generateCodes(root, "", codes);

    const encoded = values.map(value => codes.get(value)).join("");

    return { encoded, codes };
  }

  static decode<T>(encoded: string, codes: Map<T, string>): T[] {
    const reverseCodes = new Map<string, T>();
    for (const [value, code] of codes) {
      reverseCodes.set(code, value);
    }

    const decoded: T[] = [];
    let currentCode = "";

    for (const bit of encoded) {
      currentCode += bit;
      if (reverseCodes.has(currentCode)) {
        decoded.push(reverseCodes.get(currentCode)!);
        currentCode = "";
      }
    }

    return decoded;
  }
}

// 支持自定义边权重的最小生成树算法
class CustomKruskalMST<T> {
  private static class Edge<T> {
    from: T;
    to: T;
    weight: number;

    constructor(from: T, to: T, weight: number) {
      this.from = from;
      this.to = to;
      this.weight = weight;
    }
  }

  private static class UnionFind<T> {
    private parent: Map<T, T>;
    private rank: Map<T, number>;

    constructor(values: T[]) {
      this.parent = new Map();
      this.rank = new Map();

      for (const value of values) {
        this.parent.set(value, value);
        this.rank.set(value, 0);
      }
    }

    find(x: T): T {
      if (this.parent.get(x) !== x) {
        this.parent.set(x, this.find(this.parent.get(x)!));
      }
      return this.parent.get(x)!;
    }

    union(x: T, y: T): void {
      const rootX = this.find(x);
      const rootY = this.find(y);

      if (rootX === rootY) return;

      if (this.rank.get(rootX)! < this.rank.get(rootY)!) {
        this.parent.set(rootX, rootY);
      } else if (this.rank.get(rootX)! > this.rank.get(rootY)!) {
        this.parent.set(rootY, rootX);
      } else {
        this.parent.set(rootY, rootX);
        this.rank.set(rootX, this.rank.get(rootX)! + 1);
      }
    }
  }

  static findMST<T>(edges: Edge<T>[], vertices: T[]): Edge<T>[] {
    edges.sort((a, b) => a.weight - b.weight);

    const mst: Edge<T>[] = [];
    const uf = new UnionFind(vertices);

    for (const edge of edges) {
      if (uf.find(edge.from) !== uf.find(edge.to)) {
        mst.push(edge);
        uf.union(edge.from, edge.to);
      }
    }

    return mst;
  }
}

// 使用示例
const activities = [
  { start: 1, end: 4 },
  { start: 3, end: 5 },
  { start: 0, end: 6 },
  { start: 5, end: 7 },
  { start: 3, end: 8 },
  { start: 5, end: 9 },
  { start: 6, end: 10 },
  { start: 8, end: 11 },
  { start: 8, end: 12 },
  { start: 2, end: 13 },
  { start: 12, end: 14 }
];

const activitySelection = new CustomActivitySelection<typeof activities[0]>(
  (a, b) => a.end - b.end,
  activity => activity.start,
  activity => activity.end
);

console.log(activitySelection.select(activities));

const text = "hello world";
const { encoded, codes } = CustomHuffmanCoding.encode(
  text.split(""),
  char => text.split(char).length - 1
);
console.log(encoded);
console.log(CustomHuffmanCoding.decode(encoded, codes).join(""));

const edges = [
  new CustomKruskalMST.Edge(0, 1, 4),
  new CustomKruskalMST.Edge(0, 7, 8),
  new CustomKruskalMST.Edge(1, 2, 8),
  new CustomKruskalMST.Edge(1, 7, 11),
  new CustomKruskalMST.Edge(2, 3, 7),
  new CustomKruskalMST.Edge(2, 8, 2),
  new CustomKruskalMST.Edge(2, 5, 4),
  new CustomKruskalMST.Edge(3, 4, 9),
  new CustomKruskalMST.Edge(3, 5, 14),
  new CustomKruskalMST.Edge(4, 5, 10),
  new CustomKruskalMST.Edge(5, 6, 2),
  new CustomKruskalMST.Edge(6, 7, 1),
  new CustomKruskalMST.Edge(6, 8, 6),
  new CustomKruskalMST.Edge(7, 8, 7)
];

const mst = CustomKruskalMST.findMST(edges, [0, 1, 2, 3, 4, 5, 6, 7, 8]);
console.log(mst);
```
