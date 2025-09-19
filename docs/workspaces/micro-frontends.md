# 微前端架构

## 概述

微前端（Micro Frontends）是一种前端架构模式，将大型前端应用拆分为多个独立的小型应用，每个应用可以独立开发、测试、部署和维护。在 React Workspaces 中，微前端架构提供了更好的团队协作和代码组织能力。

## 核心概念

### 1. 应用拆分

- **独立应用**: 每个微前端应用都是独立的 React 应用
- **技术栈独立**: 不同应用可以使用不同的技术栈
- **团队自治**: 每个团队可以独立开发和部署

### 2. 运行时集成

- **容器应用**: 主应用负责集成各个微前端应用
- **动态加载**: 根据路由或用户操作动态加载微前端应用
- **生命周期管理**: 管理微前端应用的挂载和卸载

### 3. 通信机制

- **事件总线**: 应用间通过事件进行通信
- **状态共享**: 共享用户状态和配置信息
- **API 协调**: 统一的 API 调用和错误处理

## 架构模式

### 1. 基于路由的微前端

```typescript
// 主应用路由配置
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 动态导入微前端应用
const AdminApp = lazy(() => import("@workspace/admin-app"));
const UserApp = lazy(() => import("@workspace/user-app"));
const AnalyticsApp = lazy(() => import("@workspace/analytics-app"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="/user/*" element={<UserApp />} />
          <Route path="/analytics/*" element={<AnalyticsApp />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### 2. 基于组件的微前端

```typescript
// 微前端组件包装器
interface IMicroFrontendProps {
  name: string;
  host: string;
  props?: Record<string, any>;
}

function MicroFrontend({ name, host, props }: IMicroFrontendProps) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    // 动态加载微前端应用
    const loadMicroFrontend = async () => {
      try {
        const module = await import(
          /* webpackIgnore: true */ `${host}/remoteEntry.js`
        );
        const component = await module.get(name);
        setComponent(() => component);
      } catch (error) {
        console.error(`Failed to load micro frontend: ${name}`, error);
      }
    };

    loadMicroFrontend();
  }, [name, host]);

  if (!Component) {
    return <div>Loading {name}...</div>;
  }

  return <Component {...props} />;
}
```

### 3. 基于模块联邦的微前端

```typescript
// 主应用配置 (webpack.config.js)
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      remotes: {
        adminApp: "adminApp@http://localhost:3001/remoteEntry.js",
        userApp: "userApp@http://localhost:3002/remoteEntry.js",
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true },
      },
    }),
  ],
};
```

## 状态管理策略

### 1. 共享状态库

```typescript
// packages/shared-state/src/store.ts
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface IGlobalState {
  user: IUser | null;
  theme: "light" | "dark";
  language: string;
  notifications: INotification[];
}

interface IGlobalActions {
  setUser: (user: IUser | null) => void;
  setTheme: (theme: "light" | "dark") => void;
  setLanguage: (language: string) => void;
  addNotification: (notification: INotification) => void;
  removeNotification: (id: string) => void;
}

export const useGlobalStore = create<IGlobalState & IGlobalActions>()(
  subscribeWithSelector((set, get) => ({
    user: null,
    theme: "light",
    language: "zh-CN",
    notifications: [],

    setUser: (user) => set({ user }),
    setTheme: (theme) => set({ theme }),
    setLanguage: (language) => set({ language }),
    addNotification: (notification) =>
      set((state) => ({
        notifications: [...state.notifications, notification],
      })),
    removeNotification: (id) =>
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      })),
  }))
);
```

### 2. 应用间通信

```typescript
// packages/shared-events/src/eventBus.ts
type EventCallback = (data: any, source?: string) => void;

interface IEventBus {
  on(event: string, callback: EventCallback): void;
  off(event: string, callback: EventCallback): void;
  emit(event: string, data: any, source?: string): void;
  once(event: string, callback: EventCallback): void;
}

class EventBus implements IEventBus {
  private events: Map<string, EventCallback[]> = new Map();
  private onceEvents: Map<string, EventCallback[]> = new Map();

  on(event: string, callback: EventCallback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);
  }

  off(event: string, callback: EventCallback) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event: string, data: any, source?: string) {
    // 触发普通事件
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data, source));
    }

    // 触发一次性事件
    const onceCallbacks = this.onceEvents.get(event);
    if (onceCallbacks) {
      onceCallbacks.forEach((callback) => callback(data, source));
      this.onceEvents.delete(event);
    }
  }

  once(event: string, callback: EventCallback) {
    if (!this.onceEvents.has(event)) {
      this.onceEvents.set(event, []);
    }
    this.onceEvents.get(event)!.push(callback);
  }
}

export const eventBus = new EventBus();
```

### 3. 状态同步管理器

```typescript
// packages/shared-sync/src/syncManager.ts
interface ISyncableStore {
  getState(): any;
  setState(state: any): void;
  subscribe(listener: () => void): () => void;
}

export class SyncManager {
  private static instance: SyncManager;
  private stores: Map<string, ISyncableStore> = new Map();
  private subscriptions: Map<string, () => void> = new Map();

  static getInstance() {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  registerStore(name: string, store: ISyncableStore) {
    this.stores.set(name, store);

    // 订阅状态变化
    const unsubscribe = store.subscribe(() => {
      this.broadcastStateChange(name, store.getState());
    });

    this.subscriptions.set(name, unsubscribe);
  }

  unregisterStore(name: string) {
    const unsubscribe = this.subscriptions.get(name);
    if (unsubscribe) {
      unsubscribe();
      this.subscriptions.delete(name);
    }
    this.stores.delete(name);
  }

  private broadcastStateChange(storeName: string, state: any) {
    eventBus.emit("state:changed", { storeName, state }, storeName);
  }

  syncState(storeName: string, state: any) {
    const store = this.stores.get(storeName);
    if (store) {
      store.setState(state);
    }
  }
}
```

## 应用生命周期管理

### 1. 生命周期钩子

```typescript
// packages/shared-lifecycle/src/types.ts
export interface IMicroFrontendLifecycle {
  beforeMount?: () => Promise<void> | void;
  afterMount?: () => Promise<void> | void;
  beforeUnmount?: () => Promise<void> | void;
  afterUnmount?: () => Promise<void> | void;
}

export interface IMicroFrontendConfig {
  name: string;
  entry: string;
  lifecycle?: IMicroFrontendLifecycle;
  dependencies?: string[];
}
```

### 2. 生命周期管理器

```typescript
// packages/shared-lifecycle/src/lifecycleManager.ts
import { IMicroFrontendConfig, IMicroFrontendLifecycle } from "./types";

export class LifecycleManager {
  private apps: Map<string, IMicroFrontendConfig> = new Map();
  private mountedApps: Set<string> = new Set();

  registerApp(config: IMicroFrontendConfig) {
    this.apps.set(config.name, config);
  }

  async mountApp(name: string) {
    const app = this.apps.get(name);
    if (!app) {
      throw new Error(`App ${name} not found`);
    }

    if (this.mountedApps.has(name)) {
      console.warn(`App ${name} is already mounted`);
      return;
    }

    try {
      // 执行挂载前钩子
      if (app.lifecycle?.beforeMount) {
        await app.lifecycle.beforeMount();
      }

      // 标记为已挂载
      this.mountedApps.add(name);

      // 执行挂载后钩子
      if (app.lifecycle?.afterMount) {
        await app.lifecycle.afterMount();
      }

      console.log(`App ${name} mounted successfully`);
    } catch (error) {
      console.error(`Failed to mount app ${name}:`, error);
      throw error;
    }
  }

  async unmountApp(name: string) {
    const app = this.apps.get(name);
    if (!app) {
      throw new Error(`App ${name} not found`);
    }

    if (!this.mountedApps.has(name)) {
      console.warn(`App ${name} is not mounted`);
      return;
    }

    try {
      // 执行卸载前钩子
      if (app.lifecycle?.beforeUnmount) {
        await app.lifecycle.beforeUnmount();
      }

      // 标记为已卸载
      this.mountedApps.delete(name);

      // 执行卸载后钩子
      if (app.lifecycle?.afterUnmount) {
        await app.lifecycle.afterUnmount();
      }

      console.log(`App ${name} unmounted successfully`);
    } catch (error) {
      console.error(`Failed to unmount app ${name}:`, error);
      throw error;
    }
  }

  isAppMounted(name: string): boolean {
    return this.mountedApps.has(name);
  }

  getMountedApps(): string[] {
    return Array.from(this.mountedApps);
  }
}
```

## 路由管理

### 1. 统一路由配置

```typescript
// packages/shared-routing/src/router.ts
import { createBrowserRouter, RouteObject } from "react-router-dom";

interface IMicroFrontendRoute {
  path: string;
  app: string;
  component: React.LazyExoticComponent<React.ComponentType>;
  children?: IMicroFrontendRoute[];
}

export class MicroFrontendRouter {
  private routes: IMicroFrontendRoute[] = [];
  private router: ReturnType<typeof createBrowserRouter> | null = null;

  addRoute(route: IMicroFrontendRoute) {
    this.routes.push(route);
  }

  addRoutes(routes: IMicroFrontendRoute[]) {
    this.routes.push(...routes);
  }

  createRouter() {
    const routeObjects: RouteObject[] = this.routes.map((route) => ({
      path: route.path,
      element: <route.component />,
      children: route.children?.map((child) => ({
        path: child.path,
        element: <child.component />,
      })),
    }));

    this.router = createBrowserRouter(routeObjects);
    return this.router;
  }

  getRoutes() {
    return this.routes;
  }
}
```

### 2. 动态路由注册

```typescript
// packages/shared-routing/src/dynamicRouter.ts
import { useNavigate, useLocation } from "react-router-dom";

export function useMicroFrontendNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateToApp = (appName: string, path: string = "") => {
    const fullPath = `/${appName}${path}`;
    navigate(fullPath);
  };

  const getCurrentApp = () => {
    const pathSegments = location.pathname.split("/");
    return pathSegments[1] || "";
  };

  const isInApp = (appName: string) => {
    return getCurrentApp() === appName;
  };

  return {
    navigateToApp,
    getCurrentApp,
    isInApp,
    currentPath: location.pathname,
  };
}
```

## 样式管理

### 1. CSS 隔离策略

```typescript
// packages/shared-styles/src/cssIsolation.ts
export class CSSIsolation {
  private static instance: CSSIsolation;
  private styleScopes: Map<string, string> = new Map();

  static getInstance() {
    if (!CSSIsolation.instance) {
      CSSIsolation.instance = new CSSIsolation();
    }
    return CSSIsolation.instance;
  }

  createScope(appName: string): string {
    const scope = `mf-${appName}-${Date.now()}`;
    this.styleScopes.set(appName, scope);
    return scope;
  }

  getScope(appName: string): string | undefined {
    return this.styleScopes.get(appName);
  }

  injectStyles(appName: string, styles: string) {
    const scope = this.getScope(appName);
    if (!scope) {
      throw new Error(`No scope found for app: ${appName}`);
    }

    const styleElement = document.createElement("style");
    styleElement.setAttribute("data-micro-frontend", appName);
    styleElement.textContent = this.scopeStyles(styles, scope);
    document.head.appendChild(styleElement);
  }

  private scopeStyles(styles: string, scope: string): string {
    // 简单的 CSS 作用域化
    return styles.replace(/([^{}]+){/g, `.${scope} $1{`);
  }

  cleanupStyles(appName: string) {
    const styleElements = document.querySelectorAll(
      `[data-micro-frontend="${appName}"]`
    );
    styleElements.forEach((element) => element.remove());
    this.styleScopes.delete(appName);
  }
}
```

### 2. 主题系统

```typescript
// packages/shared-styles/src/theme.ts
interface ITheme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontSize: {
      small: string;
      base: string;
      large: string;
      heading: string;
    };
  };
}

export class ThemeManager {
  private static instance: ThemeManager;
  private currentTheme: ITheme;
  private themes: Map<string, ITheme> = new Map();

  constructor() {
    this.currentTheme = this.getDefaultTheme();
    this.themes.set("default", this.currentTheme);
  }

  static getInstance() {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  addTheme(name: string, theme: ITheme) {
    this.themes.set(name, theme);
  }

  setTheme(name: string) {
    const theme = this.themes.get(name);
    if (theme) {
      this.currentTheme = theme;
      this.applyTheme(theme);
      eventBus.emit("theme:changed", { theme: name });
    }
  }

  getCurrentTheme(): ITheme {
    return this.currentTheme;
  }

  private applyTheme(theme: ITheme) {
    const root = document.documentElement;

    // 应用 CSS 变量
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, value);
    });
  }

  private getDefaultTheme(): ITheme {
    return {
      colors: {
        primary: "#007bff",
        secondary: "#6c757d",
        background: "#ffffff",
        text: "#212529",
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "3rem",
      },
      typography: {
        fontSize: {
          small: "0.875rem",
          base: "1rem",
          large: "1.25rem",
          heading: "2rem",
        },
      },
    };
  }
}
```

## 性能优化

### 1. 懒加载策略

```typescript
// packages/shared-loading/src/lazyLoader.ts
interface ILazyLoadConfig {
  timeout: number;
  retryCount: number;
  retryDelay: number;
}

export class LazyLoader {
  private static instance: LazyLoader;
  private cache: Map<string, any> = new Map();
  private loading: Map<string, Promise<any>> = new Map();

  static getInstance() {
    if (!LazyLoader.instance) {
      LazyLoader.instance = new LazyLoader();
    }
    return LazyLoader.instance;
  }

  async load<T>(
    key: string,
    loader: () => Promise<T>,
    config: Partial<ILazyLoadConfig> = {}
  ): Promise<T> {
    const { timeout = 10000, retryCount = 3, retryDelay = 1000 } = config;

    // 检查缓存
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    // 检查是否正在加载
    if (this.loading.has(key)) {
      return this.loading.get(key);
    }

    // 创建加载 Promise
    const loadPromise = this.loadWithRetry(
      loader,
      retryCount,
      retryDelay,
      timeout
    );
    this.loading.set(key, loadPromise);

    try {
      const result = await loadPromise;
      this.cache.set(key, result);
      this.loading.delete(key);
      return result;
    } catch (error) {
      this.loading.delete(key);
      throw error;
    }
  }

  private async loadWithRetry<T>(
    loader: () => Promise<T>,
    retryCount: number,
    retryDelay: number,
    timeout: number
  ): Promise<T> {
    let lastError: Error;

    for (let i = 0; i <= retryCount; i++) {
      try {
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("Load timeout")), timeout);
        });

        const result = await Promise.race([loader(), timeoutPromise]);
        return result;
      } catch (error) {
        lastError = error as Error;

        if (i < retryCount) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }
    }

    throw lastError!;
  }

  clearCache() {
    this.cache.clear();
  }

  removeFromCache(key: string) {
    this.cache.delete(key);
  }
}
```

### 2. 预加载策略

```typescript
// packages/shared-loading/src/preloader.ts
export class Preloader {
  private static instance: Preloader;
  private preloadedApps: Set<string> = new Set();

  static getInstance() {
    if (!Preloader.instance) {
      Preloader.instance = new Preloader();
    }
    return Preloader.instance;
  }

  preloadApp(appName: string, loader: () => Promise<any>) {
    if (this.preloadedApps.has(appName)) {
      return;
    }

    // 在空闲时间预加载
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => {
        this.loadApp(appName, loader);
      });
    } else {
      // 降级到 setTimeout
      setTimeout(() => {
        this.loadApp(appName, loader);
      }, 1000);
    }
  }

  private async loadApp(appName: string, loader: () => Promise<any>) {
    try {
      await loader();
      this.preloadedApps.add(appName);
      console.log(`App ${appName} preloaded successfully`);
    } catch (error) {
      console.warn(`Failed to preload app ${appName}:`, error);
    }
  }

  isPreloaded(appName: string): boolean {
    return this.preloadedApps.has(appName);
  }

  getPreloadedApps(): string[] {
    return Array.from(this.preloadedApps);
  }
}
```

## 最佳实践

### 1. 应用设计原则

- **单一职责**: 每个微前端应用专注于特定功能
- **松耦合**: 应用间通过标准接口通信
- **高内聚**: 相关功能组织在同一个应用中
- **可扩展**: 支持动态添加和移除应用

### 2. 性能考虑

- **按需加载**: 只在需要时加载微前端应用
- **缓存策略**: 缓存已加载的应用和资源
- **预加载**: 预测用户行为，提前加载可能需要的应用
- **资源优化**: 共享公共依赖，减少重复加载

### 3. 错误处理

- **优雅降级**: 单个应用失败不影响整体功能
- **错误边界**: 使用 React Error Boundary 捕获错误
- **重试机制**: 自动重试失败的加载操作
- **用户反馈**: 提供清晰的错误信息和恢复建议

### 4. 测试策略

- **单元测试**: 每个应用独立进行单元测试
- **集成测试**: 测试应用间的交互和通信
- **端到端测试**: 测试完整的用户流程
- **性能测试**: 测试加载时间和资源使用

## 总结

微前端架构为大型 React 应用提供了强大的组织能力：

1. **团队自治**: 不同团队可以独立开发和部署
2. **技术栈灵活**: 支持多种技术栈和框架
3. **渐进式迁移**: 可以逐步迁移现有应用
4. **性能优化**: 支持按需加载和缓存策略
5. **可维护性**: 简化复杂应用的维护工作

选择合适的微前端架构模式，结合 React Workspaces 和状态管理策略，可以构建出高性能、可维护的大型前端应用。
