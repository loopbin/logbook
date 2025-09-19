# React Workspaces

## 概述

React Workspaces 是一种项目组织方式，允许在单个代码库中管理多个相关的 React 应用或包。它基于 Yarn Workspaces 或 npm Workspaces，提供统一的依赖管理和构建流程。

## 使用场景

### 1. 微前端架构

- **特点**: 多个独立的应用在同一个页面中运行
- **优势**: 技术栈独立，团队协作灵活
- **适用**: 大型企业应用，多团队协作项目

### 2. 组件库开发

- **特点**: 开发可复用的 React 组件库
- **优势**: 统一版本管理，简化发布流程
- **适用**: 设计系统，开源组件库

### 3. 全栈应用

- **特点**: 前后端代码在同一个仓库中
- **优势**: 代码共享，统一部署
- **适用**: 全栈项目，API 和前端紧密耦合

### 4. 多包项目

- **特点**: 将大型应用拆分为多个包
- **优势**: 模块化开发，独立版本管理
- **适用**: 插件系统，可扩展应用

## 配置方法

### Yarn Workspaces

```json
// package.json (根目录)
{
  "name": "my-workspace",
  "private": true,
  "workspaces": ["packages/*", "apps/*"],
  "scripts": {
    "build": "yarn workspaces run build",
    "dev": "yarn workspaces run dev",
    "test": "yarn workspaces run test"
  }
}
```

### npm Workspaces

```json
// package.json (根目录)
{
  "name": "my-workspace",
  "private": true,
  "workspaces": ["packages/*", "apps/*"],
  "scripts": {
    "build": "npm run build --workspaces",
    "dev": "npm run dev --workspaces",
    "test": "npm run test --workspaces"
  }
}
```

## 目录结构示例

```
my-workspace/
├── package.json
├── lerna.json (可选)
├── packages/
│   ├── ui-components/
│   │   ├── package.json
│   │   ├── src/
│   │   └── dist/
│   ├── utils/
│   │   ├── package.json
│   │   ├── src/
│   │   └── dist/
│   └── hooks/
│       ├── package.json
│       ├── src/
│       └── dist/
├── apps/
│   ├── web-app/
│   │   ├── package.json
│   │   ├── src/
│   │   └── public/
│   ├── admin-panel/
│   │   ├── package.json
│   │   ├── src/
│   │   └── public/
│   └── mobile-app/
│       ├── package.json
│       ├── src/
│       └── public/
└── shared/
    ├── types/
    ├── constants/
    └── utils/
```

## 状态管理策略

### 1. 共享状态库

```typescript
// packages/shared-state/src/store.ts
import { create } from "zustand";

interface ISharedState {
  user: IUser | null;
  theme: "light" | "dark";
  setUser: (user: IUser) => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useSharedStore = create<ISharedState>((set) => ({
  user: null,
  theme: "light",
  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme }),
}));
```

### 2. 应用间通信

```typescript
// packages/shared-events/src/eventBus.ts
type EventCallback = (data: any) => void;

class EventBus {
  private events: Map<string, EventCallback[]> = new Map();

  on(event: string, callback: EventCallback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);
  }

  emit(event: string, data: any) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }
}

export const eventBus = new EventBus();
```

### 3. 状态同步

```typescript
// packages/shared-sync/src/syncManager.ts
import { useSharedStore } from "../shared-state";

export class SyncManager {
  private static instance: SyncManager;
  private stores: Map<string, any> = new Map();

  static getInstance() {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  registerStore(name: string, store: any) {
    this.stores.set(name, store);
  }

  syncState(storeName: string, state: any) {
    const store = this.stores.get(storeName);
    if (store) {
      store.setState(state);
    }
  }
}
```

## 构建和部署

### 1. 统一构建脚本

```json
// package.json
{
  "scripts": {
    "build:all": "yarn workspaces run build",
    "build:packages": "yarn workspaces --filter=./packages/* run build",
    "build:apps": "yarn workspaces --filter=./apps/* run build",
    "dev:all": "concurrently \"yarn workspace web-app dev\" \"yarn workspace admin-panel dev\"",
    "test:all": "yarn workspaces run test",
    "lint:all": "yarn workspaces run lint"
  }
}
```

### 2. 依赖管理

```json
// packages/ui-components/package.json
{
  "name": "@my-workspace/ui-components",
  "version": "1.0.0",
  "dependencies": {
    "@my-workspace/utils": "workspace:*",
    "@my-workspace/hooks": "workspace:*"
  }
}
```

## 最佳实践

### 1. 包命名规范

- **应用**: `@workspace/app-name`
- **包**: `@workspace/package-name`
- **共享**: `@workspace/shared-*`

### 2. 依赖管理

- 根目录管理所有依赖版本
- 子包使用 `workspace:*` 引用本地包
- 避免循环依赖

### 3. 类型共享

```typescript
// packages/shared-types/src/index.ts
export interface IUser {
  id: string;
  name: string;
  email: string;
}

export interface IApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
```

### 4. 环境配置

```typescript
// packages/shared-config/src/config.ts
export const config = {
  api: {
    baseUrl: process.env.REACT_APP_API_URL || "http://localhost:3000",
    timeout: 5000,
  },
  features: {
    enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === "true",
  },
};
```

## 工具支持

### 1. Lerna

- 统一版本管理
- 发布流程自动化
- 依赖关系管理

### 2. Nx

- 构建系统优化
- 缓存和并行构建
- 依赖图分析

### 3. Turborepo

- 增量构建
- 远程缓存
- 并行任务执行

## 性能优化

### 1. 按需加载

```typescript
// 动态导入包
const AdminPanel = lazy(() => import("@my-workspace/admin-panel"));
const MobileApp = lazy(() => import("@my-workspace/mobile-app"));
```

### 2. 代码分割

```typescript
// 基于路由的代码分割
const routes = [
  {
    path: "/admin",
    component: lazy(() => import("@my-workspace/admin-panel")),
  },
  {
    path: "/mobile",
    component: lazy(() => import("@my-workspace/mobile-app")),
  },
];
```

### 3. 共享依赖

- 将常用依赖提升到根目录
- 使用 webpack 的 `externals` 配置
- 利用模块联邦 (Module Federation)

## 总结

React Workspaces 为大型 React 项目提供了强大的组织能力：

1. **模块化**: 将复杂项目拆分为可管理的模块
2. **复用性**: 共享代码和组件，减少重复开发
3. **协作性**: 多团队并行开发，提高开发效率
4. **维护性**: 统一依赖管理，简化维护工作
5. **扩展性**: 支持微前端架构，适应业务增长

选择合适的 Workspaces 配置和工具，可以显著提升大型 React 项目的开发体验和维护效率。
