# 图

## 基本概念

图是一种非线性数据结构，由顶点（Vertex）和边（Edge）组成。图可以是有向的或无向的，边可以有权重或无权。图的基本操作包括遍历、最短路径查找、最小生成树等。

## 图的表示

```typescript
/**
 * 图的邻接表表示
 */
class Graph {
  private vertices: number;
  private adjList: Map<number, number[]>;

  constructor(vertices: number) {
    this.vertices = vertices;
    this.adjList = new Map();
    for (let i = 0; i < vertices; i++) {
      this.adjList.set(i, []);
    }
  }

  /**
   * 添加边
   */
  addEdge(v: number, w: number): void {
    this.adjList.get(v)?.push(w);
    this.adjList.get(w)?.push(v);
  }

  /**
   * 深度优先搜索
   */
  dfs(startVertex: number): number[] {
    const visited: boolean[] = new Array(this.vertices).fill(false);
    const result: number[] = [];

    const dfsUtil = (vertex: number) => {
      visited[vertex] = true;
      result.push(vertex);

      const neighbors = this.adjList.get(vertex) || [];
      for (const neighbor of neighbors) {
        if (!visited[neighbor]) {
          dfsUtil(neighbor);
        }
      }
    };

    dfsUtil(startVertex);
    return result;
  }

  /**
   * 广度优先搜索
   */
  bfs(startVertex: number): number[] {
    const visited: boolean[] = new Array(this.vertices).fill(false);
    const result: number[] = [];
    const queue: number[] = [startVertex];
    visited[startVertex] = true;

    while (queue.length > 0) {
      const vertex = queue.shift()!;
      result.push(vertex);

      const neighbors = this.adjList.get(vertex) || [];
      for (const neighbor of neighbors) {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          queue.push(neighbor);
        }
      }
    }

    return result;
  }
}
```

## 最短路径算法

```typescript
/**
 * Dijkstra算法实现
 */
class Dijkstra {
  private graph: number[][];
  private vertices: number;

  constructor(graph: number[][]) {
    this.graph = graph;
    this.vertices = graph.length;
  }

  /**
   * 找到最短路径
   */
  findShortestPath(start: number): number[] {
    const dist: number[] = new Array(this.vertices).fill(Infinity);
    const visited: boolean[] = new Array(this.vertices).fill(false);
    dist[start] = 0;

    for (let i = 0; i < this.vertices - 1; i++) {
      const u = this.minDistance(dist, visited);
      visited[u] = true;

      for (let v = 0; v < this.vertices; v++) {
        if (
          !visited[v] &&
          this.graph[u][v] !== 0 &&
          dist[u] !== Infinity &&
          dist[u] + this.graph[u][v] < dist[v]
        ) {
          dist[v] = dist[u] + this.graph[u][v];
        }
      }
    }

    return dist;
  }

  /**
   * 找到未访问的最小距离顶点
   */
  private minDistance(dist: number[], visited: boolean[]): number {
    let min = Infinity;
    let minIndex = -1;

    for (let v = 0; v < this.vertices; v++) {
      if (!visited[v] && dist[v] <= min) {
        min = dist[v];
        minIndex = v;
      }
    }

    return minIndex;
  }
}

/**
 * Floyd-Warshall算法实现
 */
class FloydWarshall {
  private graph: number[][];
  private vertices: number;

  constructor(graph: number[][]) {
    this.graph = graph;
    this.vertices = graph.length;
  }

  /**
   * 找到所有顶点对之间的最短路径
   */
  findShortestPaths(): number[][] {
    const dist: number[][] = this.graph.map((row) => [...row]);

    for (let k = 0; k < this.vertices; k++) {
      for (let i = 0; i < this.vertices; i++) {
        for (let j = 0; j < this.vertices; j++) {
          if (
            dist[i][k] !== Infinity &&
            dist[k][j] !== Infinity &&
            dist[i][k] + dist[k][j] < dist[i][j]
          ) {
            dist[i][j] = dist[i][k] + dist[k][j];
          }
        }
      }
    }

    return dist;
  }
}
```

## 最小生成树算法

```typescript
/**
 * Kruskal算法实现
 */
class Kruskal {
  private vertices: number;
  private edges: [number, number, number][];

  constructor(vertices: number) {
    this.vertices = vertices;
    this.edges = [];
  }

  /**
   * 添加边
   */
  addEdge(u: number, v: number, weight: number): void {
    this.edges.push([u, v, weight]);
  }

  /**
   * 找到最小生成树
   */
  findMST(): [number, number, number][] {
    this.edges.sort((a, b) => a[2] - b[2]);
    const parent: number[] = Array.from({ length: this.vertices }, (_, i) => i);
    const result: [number, number, number][] = [];

    const find = (i: number): number => {
      if (parent[i] !== i) {
        parent[i] = find(parent[i]);
      }
      return parent[i];
    };

    const union = (x: number, y: number): void => {
      parent[find(x)] = find(y);
    };

    for (const [u, v, weight] of this.edges) {
      if (find(u) !== find(v)) {
        result.push([u, v, weight]);
        union(u, v);
      }
    }

    return result;
  }
}

/**
 * Prim算法实现
 */
class Prim {
  private graph: number[][];
  private vertices: number;

  constructor(graph: number[][]) {
    this.graph = graph;
    this.vertices = graph.length;
  }

  /**
   * 找到最小生成树
   */
  findMST(): [number, number, number][] {
    const parent: number[] = new Array(this.vertices).fill(-1);
    const key: number[] = new Array(this.vertices).fill(Infinity);
    const mstSet: boolean[] = new Array(this.vertices).fill(false);
    key[0] = 0;

    for (let count = 0; count < this.vertices - 1; count++) {
      const u = this.minKey(key, mstSet);
      mstSet[u] = true;

      for (let v = 0; v < this.vertices; v++) {
        if (this.graph[u][v] && !mstSet[v] && this.graph[u][v] < key[v]) {
          parent[v] = u;
          key[v] = this.graph[u][v];
        }
      }
    }

    const result: [number, number, number][] = [];
    for (let i = 1; i < this.vertices; i++) {
      result.push([parent[i], i, this.graph[parent[i]][i]]);
    }
    return result;
  }

  /**
   * 找到未访问的最小键值顶点
   */
  private minKey(key: number[], mstSet: boolean[]): number {
    let min = Infinity;
    let minIndex = -1;

    for (let v = 0; v < this.vertices; v++) {
      if (!mstSet[v] && key[v] < min) {
        min = key[v];
        minIndex = v;
      }
    }

    return minIndex;
  }
}
```

## 应用场景

1. 社交网络
2. 地图导航
3. 网络路由
4. 任务调度
5. 依赖关系分析

## 练习题

1. 实现一个支持有向图的图类
2. 实现一个支持带权图的图类
3. 实现一个支持负权边的图类

## 参考代码

```typescript
// 有向图实现
class DirectedGraph {
  private vertices: number;
  private adjList: Map<number, number[]>;

  constructor(vertices: number) {
    this.vertices = vertices;
    this.adjList = new Map();
    for (let i = 0; i < vertices; i++) {
      this.adjList.set(i, []);
    }
  }

  addEdge(from: number, to: number): void {
    this.adjList.get(from)?.push(to);
  }

  hasCycle(): boolean {
    const visited: boolean[] = new Array(this.vertices).fill(false);
    const recStack: boolean[] = new Array(this.vertices).fill(false);

    const isCyclicUtil = (vertex: number): boolean => {
      visited[vertex] = true;
      recStack[vertex] = true;

      const neighbors = this.adjList.get(vertex) || [];
      for (const neighbor of neighbors) {
        if (!visited[neighbor]) {
          if (isCyclicUtil(neighbor)) {
            return true;
          }
        } else if (recStack[neighbor]) {
          return true;
        }
      }

      recStack[vertex] = false;
      return false;
    };

    for (let i = 0; i < this.vertices; i++) {
      if (!visited[i]) {
        if (isCyclicUtil(i)) {
          return true;
        }
      }
    }

    return false;
  }
}

// 带权图实现
class WeightedGraph {
  private vertices: number;
  private adjList: Map<number, [number, number][]>;

  constructor(vertices: number) {
    this.vertices = vertices;
    this.adjList = new Map();
    for (let i = 0; i < vertices; i++) {
      this.adjList.set(i, []);
    }
  }

  addEdge(from: number, to: number, weight: number): void {
    this.adjList.get(from)?.push([to, weight]);
    this.adjList.get(to)?.push([from, weight]);
  }

  getEdges(): [number, number, number][] {
    const edges: [number, number, number][] = [];
    for (let i = 0; i < this.vertices; i++) {
      const neighbors = this.adjList.get(i) || [];
      for (const [to, weight] of neighbors) {
        if (i < to) {
          edges.push([i, to, weight]);
        }
      }
    }
    return edges;
  }
}

// 支持负权边的图实现
class NegativeWeightGraph {
  private vertices: number;
  private edges: [number, number, number][];

  constructor(vertices: number) {
    this.vertices = vertices;
    this.edges = [];
  }

  addEdge(from: number, to: number, weight: number): void {
    this.edges.push([from, to, weight]);
  }

  bellmanFord(start: number): number[] {
    const dist: number[] = new Array(this.vertices).fill(Infinity);
    dist[start] = 0;

    for (let i = 0; i < this.vertices - 1; i++) {
      for (const [from, to, weight] of this.edges) {
        if (dist[from] !== Infinity && dist[from] + weight < dist[to]) {
          dist[to] = dist[from] + weight;
        }
      }
    }

    // 检查负环
    for (const [from, to, weight] of this.edges) {
      if (dist[from] !== Infinity && dist[from] + weight < dist[to]) {
        throw new Error("图中存在负环");
      }
    }

    return dist;
  }
}

// 使用示例
const graph = new Graph(5);
graph.addEdge(0, 1);
graph.addEdge(0, 2);
graph.addEdge(1, 3);
graph.addEdge(2, 4);
console.log(graph.dfs(0)); // [0, 1, 3, 2, 4]
console.log(graph.bfs(0)); // [0, 1, 2, 3, 4]

const dijkstra = new Dijkstra([
  [0, 4, 0, 0, 0],
  [4, 0, 8, 0, 0],
  [0, 8, 0, 7, 0],
  [0, 0, 7, 0, 9],
  [0, 0, 0, 9, 0],
]);
console.log(dijkstra.findShortestPath(0)); // [0, 4, 12, 19, 28]

const kruskal = new Kruskal(4);
kruskal.addEdge(0, 1, 10);
kruskal.addEdge(0, 2, 6);
kruskal.addEdge(0, 3, 5);
kruskal.addEdge(1, 3, 15);
kruskal.addEdge(2, 3, 4);
console.log(kruskal.findMST()); // [[2, 3, 4], [0, 3, 5], [0, 1, 10]]
```
