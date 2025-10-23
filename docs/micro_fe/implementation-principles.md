# 微前端实现原理详细讲解

本文深入分析主流微前端方案的实现原理，从底层机制到具体实现细节。

## 1. Single-SPA 实现原理

### 1.1 核心架构

Single-SPA 的核心思想是将整个应用拆分为多个微应用，每个微应用都是一个独立的 JavaScript 模块，通过路由控制加载和卸载。

```js
// Single-SPA 核心架构
class SingleSpa {
  constructor() {
    this.apps = new Map(); // 存储注册的应用
    this.routingEvents = []; // 路由事件监听器
    this.isStarted = false; // 是否已启动
  }

  // 注册应用
  registerApplication(config) {
    const { name, app, activeWhen, customProps } = config;

    this.apps.set(name, {
      name,
      loadApp: app,
      activeWhen,
      customProps,
      status: "NOT_LOADED", // 应用状态
      bootstrap: null,
      mount: null,
      unmount: null,
    });
  }

  // 启动 Single-SPA
  start() {
    this.isStarted = true;
    this.reroute(); // 重新路由
  }
}
```

### 1.2 路由匹配机制

Single-SPA 通过监听路由变化来决定哪些应用应该被激活。

```js
// 路由匹配实现
class RoutingService {
  constructor() {
    this.routingEvents = [];
    this.setupRouting();
  }

  setupRouting() {
    // 监听 popstate 事件（浏览器前进后退）
    window.addEventListener("popstate", this.reroute.bind(this));

    // 监听 pushState 和 replaceState
    this.overrideHistoryMethods();
  }

  overrideHistoryMethods() {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      this.reroute();
    };

    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      this.reroute();
    };
  }

  // 检查应用是否应该激活
  shouldBeActive(app) {
    const { activeWhen } = app;

    if (typeof activeWhen === "function") {
      return activeWhen(window.location);
    }

    if (typeof activeWhen === "string") {
      return window.location.pathname.startsWith(activeWhen);
    }

    if (Array.isArray(activeWhen)) {
      return activeWhen.some((rule) => {
        if (typeof rule === "string") {
          return window.location.pathname.startsWith(rule);
        }
        return rule(window.location);
      });
    }

    return false;
  }
}
```

### 1.3 应用生命周期管理

Single-SPA 定义了完整的应用生命周期，每个微应用都需要实现这些生命周期函数。

```js
// 应用生命周期管理
class AppLifecycle {
  constructor(app) {
    this.app = app;
  }

  // 加载应用
  async loadApp() {
    if (this.app.status !== "NOT_LOADED") {
      return this.app;
    }

    try {
      this.app.status = "LOADING_SOURCE_CODE";

      // 动态导入应用模块
      const appExports = await this.app.loadApp();

      // 验证生命周期函数
      this.validateLifecycleFunctions(appExports);

      // 保存生命周期函数
      this.app.bootstrap = appExports.bootstrap;
      this.app.mount = appExports.mount;
      this.app.unmount = appExports.unmount;

      this.app.status = "NOT_BOOTSTRAPPED";
      return this.app;
    } catch (error) {
      this.app.status = "LOAD_ERROR";
      throw error;
    }
  }

  // 启动应用
  async bootstrapApp() {
    if (this.app.status !== "NOT_BOOTSTRAPPED") {
      return this.app;
    }

    try {
      this.app.status = "BOOTSTRAPPING";

      // 调用应用的 bootstrap 函数
      await this.app.bootstrap(this.app.customProps);

      this.app.status = "NOT_MOUNTED";
      return this.app;
    } catch (error) {
      this.app.status = "BOOTSTRAP_ERROR";
      throw error;
    }
  }

  // 挂载应用
  async mountApp() {
    if (this.app.status !== "NOT_MOUNTED") {
      return this.app;
    }

    try {
      this.app.status = "MOUNTING";

      // 调用应用的 mount 函数
      await this.app.mount({
        ...this.app.customProps,
        domElement: this.getContainerElement(),
        singleSpa: this.getSingleSpaInstance(),
      });

      this.app.status = "MOUNTED";
      return this.app;
    } catch (error) {
      this.app.status = "MOUNT_ERROR";
      throw error;
    }
  }

  // 卸载应用
  async unmountApp() {
    if (this.app.status !== "MOUNTED") {
      return this.app;
    }

    try {
      this.app.status = "UNMOUNTING";

      // 调用应用的 unmount 函数
      await this.app.unmount({
        ...this.app.customProps,
        domElement: this.getContainerElement(),
        singleSpa: this.getSingleSpaInstance(),
      });

      this.app.status = "NOT_MOUNTED";
      return this.app;
    } catch (error) {
      this.app.status = "UNMOUNT_ERROR";
      throw error;
    }
  }

  // 验证生命周期函数
  validateLifecycleFunctions(appExports) {
    const requiredFunctions = ["bootstrap", "mount", "unmount"];

    requiredFunctions.forEach((funcName) => {
      if (typeof appExports[funcName] !== "function") {
        throw new Error(`应用必须导出 ${funcName} 函数`);
      }
    });
  }
}
```

### 1.4 重新路由机制

Single-SPA 的核心是重新路由机制，它负责决定哪些应用应该被激活或停用。

```js
// 重新路由实现
class RerouteService {
  constructor(apps, routingService) {
    this.apps = apps;
    this.routingService = routingService;
    this.isRerouting = false;
  }

  async reroute() {
    if (this.isRerouting) {
      return;
    }

    this.isRerouting = true;

    try {
      // 获取当前应该激活的应用
      const appsToLoad = this.getAppsToLoad();
      const appsToMount = this.getAppsToMount();
      const appsToUnmount = this.getAppsToUnmount();

      // 并行处理应用状态变更
      await Promise.all([
        this.loadApps(appsToLoad),
        this.unmountApps(appsToUnmount),
        this.mountApps(appsToMount),
      ]);
    } finally {
      this.isRerouting = false;
    }
  }

  // 获取需要加载的应用
  getAppsToLoad() {
    return Array.from(this.apps.values()).filter((app) => {
      return (
        app.status === "NOT_LOADED" && this.routingService.shouldBeActive(app)
      );
    });
  }

  // 获取需要挂载的应用
  getAppsToMount() {
    return Array.from(this.apps.values()).filter((app) => {
      return (
        app.status === "NOT_MOUNTED" && this.routingService.shouldBeActive(app)
      );
    });
  }

  // 获取需要卸载的应用
  getAppsToUnmount() {
    return Array.from(this.apps.values()).filter((app) => {
      return (
        app.status === "MOUNTED" && !this.routingService.shouldBeActive(app)
      );
    });
  }

  // 加载应用
  async loadApps(apps) {
    return Promise.all(
      apps.map((app) => {
        const lifecycle = new AppLifecycle(app);
        return lifecycle.loadApp();
      })
    );
  }

  // 挂载应用
  async mountApps(apps) {
    return Promise.all(
      apps.map(async (app) => {
        const lifecycle = new AppLifecycle(app);
        await lifecycle.bootstrapApp();
        return lifecycle.mountApp();
      })
    );
  }

  // 卸载应用
  async unmountApps(apps) {
    return Promise.all(
      apps.map((app) => {
        const lifecycle = new AppLifecycle(app);
        return lifecycle.unmountApp();
      })
    );
  }
}
```

## 2. qiankun 实现原理

### 2.1 整体架构

qiankun 基于 Single-SPA 构建，但在 Single-SPA 的基础上增加了沙箱隔离、样式隔离、HTML Entry 等功能。

```js
// qiankun 核心架构
class Qiankun {
  constructor() {
    this.singleSpa = new SingleSpa();
    this.sandboxManager = new SandboxManager();
    this.styleManager = new StyleManager();
    this.htmlEntryLoader = new HtmlEntryLoader();
  }

  // 注册微应用
  registerMicroApps(apps, options = {}) {
    apps.forEach((app) => {
      this.singleSpa.registerApplication({
        name: app.name,
        app: () => this.loadMicroApp(app, options),
        activeWhen: app.activeRule,
        customProps: app.props,
      });
    });
  }

  // 加载微应用
  async loadMicroApp(app, options) {
    const { entry, container } = app;

    // 1. 加载 HTML Entry
    const htmlContent = await this.htmlEntryLoader.load(entry);

    // 2. 解析 HTML 内容
    const { scripts, styles, html } = this.htmlEntryLoader.parse(htmlContent);

    // 3. 创建沙箱
    const sandbox = this.sandboxManager.createSandbox(
      app.name,
      options.sandbox
    );

    // 4. 加载样式
    const styleElements = await this.styleManager.loadStyles(
      styles,
      options.sandbox
    );

    // 5. 加载脚本
    const scriptExports = await this.loadScripts(scripts, sandbox);

    return {
      bootstrap: async () => {
        // 启动沙箱
        sandbox.activate();
      },
      mount: async () => {
        // 挂载应用
        const containerElement = document.querySelector(container);
        containerElement.innerHTML = html;

        // 激活样式
        styleElements.forEach((style) => {
          document.head.appendChild(style);
        });
      },
      unmount: async () => {
        // 卸载应用
        const containerElement = document.querySelector(container);
        containerElement.innerHTML = "";

        // 移除样式
        styleElements.forEach((style) => {
          if (style.parentNode) {
            style.parentNode.removeChild(style);
          }
        });

        // 停用沙箱
        sandbox.deactivate();
      },
    };
  }
}
```

### 2.2 HTML Entry 加载机制

qiankun 支持 HTML Entry，可以直接加载 HTML 文件作为微应用的入口。

```js
// HTML Entry 加载器
class HtmlEntryLoader {
  constructor() {
    this.cache = new Map();
  }

  // 加载 HTML 内容
  async load(entry) {
    if (this.cache.has(entry)) {
      return this.cache.get(entry);
    }

    try {
      const response = await fetch(entry);
      const htmlContent = await response.text();

      this.cache.set(entry, htmlContent);
      return htmlContent;
    } catch (error) {
      throw new Error(`加载 HTML Entry 失败: ${entry}`);
    }
  }

  // 解析 HTML 内容
  parse(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    // 提取脚本
    const scripts = Array.from(doc.querySelectorAll("script")).map(
      (script) => ({
        src: script.src,
        text: script.textContent,
        async: script.async,
        defer: script.defer,
      })
    );

    // 提取样式
    const styles = Array.from(
      doc.querySelectorAll('link[rel="stylesheet"], style')
    ).map((style) => ({
      href: style.href,
      text: style.textContent,
      type: style.type || "text/css",
    }));

    // 提取 HTML 内容
    const html = doc.body ? doc.body.innerHTML : "";

    return { scripts, styles, html };
  }
}
```

### 2.3 脚本加载机制

qiankun 需要动态加载微应用的 JavaScript 代码，并在沙箱环境中执行。

```js
// 脚本加载器
class ScriptLoader {
  constructor() {
    this.loadedScripts = new Set();
  }

  // 加载脚本
  async loadScripts(scripts, sandbox) {
    const scriptExports = {};

    for (const script of scripts) {
      if (script.src) {
        // 外部脚本
        const scriptContent = await this.loadExternalScript(script.src);
        const exports = this.executeScript(scriptContent, sandbox);
        Object.assign(scriptExports, exports);
      } else if (script.text) {
        // 内联脚本
        const exports = this.executeScript(script.text, sandbox);
        Object.assign(scriptExports, exports);
      }
    }

    return scriptExports;
  }

  // 加载外部脚本
  async loadExternalScript(src) {
    if (this.loadedScripts.has(src)) {
      return "";
    }

    try {
      const response = await fetch(src);
      const scriptContent = await response.text();

      this.loadedScripts.add(src);
      return scriptContent;
    } catch (error) {
      throw new Error(`加载脚本失败: ${src}`);
    }
  }

  // 执行脚本
  executeScript(scriptContent, sandbox) {
    // 创建执行环境
    const fakeWindow = sandbox.getFakeWindow();

    // 使用 with 语句将 fakeWindow 加入作用域链
    const wrappedScript = `
      with (window) {
        ${scriptContent}
      }
    `;

    // 创建函数并执行
    const scriptFunction = new Function("window", wrappedScript);
    scriptFunction(fakeWindow);

    // 返回导出的内容
    return fakeWindow.__webpack_exports__ || fakeWindow.exports || {};
  }
}
```

## 3. Module Federation 实现原理

### 3.1 核心概念

Module Federation 的核心思想是在运行时动态加载远程模块，实现微前端的模块化集成。

```js
// Module Federation 核心架构
class ModuleFederation {
  constructor() {
    this.remotes = new Map(); // 远程模块映射
    this.exposes = new Map(); // 暴露的模块
    this.shared = new Map(); // 共享依赖
  }

  // 注册远程模块
  registerRemote(name, url) {
    this.remotes.set(name, {
      name,
      url,
      loaded: false,
      container: null,
    });
  }

  // 加载远程模块
  async loadRemote(name) {
    const remote = this.remotes.get(name);
    if (!remote) {
      throw new Error(`远程模块 ${name} 未注册`);
    }

    if (remote.loaded) {
      return remote.container;
    }

    try {
      // 加载远程入口文件
      const container = await this.loadRemoteEntry(remote.url);

      // 初始化容器
      await this.initContainer(container);

      remote.container = container;
      remote.loaded = true;

      return container;
    } catch (error) {
      throw new Error(`加载远程模块失败: ${name}`);
    }
  }

  // 获取远程模块
  async getRemoteModule(remoteName, moduleName) {
    const container = await this.loadRemote(remoteName);
    return container.get(moduleName);
  }
}
```

### 3.2 远程入口加载

Module Federation 通过加载远程入口文件来获取远程模块的信息。

```js
// 远程入口加载器
class RemoteEntryLoader {
  constructor() {
    this.cache = new Map();
  }

  // 加载远程入口
  async loadRemoteEntry(url) {
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }

    try {
      // 动态创建 script 标签
      const script = document.createElement("script");
      script.src = url;
      script.type = "text/javascript";

      // 等待脚本加载完成
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });

      // 获取全局变量（通常是模块名）
      const globalName = this.extractGlobalName(url);
      const container = window[globalName];

      if (!container) {
        throw new Error(`远程入口文件未正确暴露容器: ${url}`);
      }

      this.cache.set(url, container);
      return container;
    } catch (error) {
      throw new Error(`加载远程入口失败: ${url}`);
    }
  }

  // 提取全局变量名
  extractGlobalName(url) {
    // 从 URL 中提取模块名
    const match = url.match(/\/([^\/]+)\/remoteEntry\.js$/);
    return match ? match[1] : "remote";
  }
}
```

### 3.3 容器初始化

远程容器需要初始化才能使用，这个过程包括共享依赖的设置和模块的注册。

```js
// 容器初始化器
class ContainerInitializer {
  constructor(sharedDependencies) {
    this.sharedDependencies = sharedDependencies;
  }

  // 初始化容器
  async initContainer(container) {
    if (container.__initialized) {
      return container;
    }

    try {
      // 初始化容器
      await container.init(this.sharedDependencies);

      // 标记为已初始化
      container.__initialized = true;

      return container;
    } catch (error) {
      throw new Error(`初始化容器失败: ${error.message}`);
    }
  }

  // 获取模块
  async getModule(container, moduleName) {
    try {
      // 获取模块工厂
      const moduleFactory = await container.get(moduleName);

      // 创建模块实例
      const module = await moduleFactory();

      return module;
    } catch (error) {
      throw new Error(`获取模块失败: ${moduleName}`);
    }
  }
}
```

### 3.4 共享依赖机制

Module Federation 支持共享依赖，避免重复加载相同的库。

```js
// 共享依赖管理器
class SharedDependencyManager {
  constructor() {
    this.sharedModules = new Map();
    this.loadedModules = new Map();
  }

  // 注册共享模块
  registerSharedModule(name, config) {
    this.sharedModules.set(name, {
      name,
      version: config.version,
      singleton: config.singleton || false,
      eager: config.eager || false,
      requiredVersion: config.requiredVersion,
    });
  }

  // 获取共享模块
  async getSharedModule(name) {
    const sharedModule = this.sharedModules.get(name);
    if (!sharedModule) {
      throw new Error(`共享模块 ${name} 未注册`);
    }

    if (this.loadedModules.has(name)) {
      return this.loadedModules.get(name);
    }

    try {
      // 加载模块
      const module = await this.loadModule(name, sharedModule);

      this.loadedModules.set(name, module);
      return module;
    } catch (error) {
      throw new Error(`加载共享模块失败: ${name}`);
    }
  }

  // 加载模块
  async loadModule(name, config) {
    // 根据配置加载模块
    if (config.eager) {
      return await this.loadEagerModule(name);
    } else {
      return await this.loadLazyModule(name);
    }
  }

  // 加载急切模块
  async loadEagerModule(name) {
    // 立即加载模块
    return await import(name);
  }

  // 加载懒加载模块
  async loadLazyModule(name) {
    // 按需加载模块
    return await import(name);
  }
}
```

## 4. 沙箱隔离原理

### 4.1 沙箱架构

沙箱是微前端中实现 JavaScript 隔离的核心机制，确保不同微应用之间的全局变量不会相互污染。

```js
// 沙箱基类
class BaseSandbox {
  constructor(name) {
    this.name = name;
    this.active = false;
  }

  // 激活沙箱
  activate() {
    this.active = true;
  }

  // 停用沙箱
  deactivate() {
    this.active = false;
  }

  // 获取沙箱环境
  getSandboxEnvironment() {
    throw new Error("子类必须实现 getSandboxEnvironment 方法");
  }
}
```

### 4.2 快照沙箱实现

快照沙箱通过保存和恢复全局状态来实现隔离。

```js
// 快照沙箱实现
class SnapshotSandbox extends BaseSandbox {
  constructor(name) {
    super(name);
    this.snapshot = null; // 快照
    this.modifiedProps = new Map(); // 修改的属性
  }

  // 激活沙箱
  activate() {
    if (this.active) {
      return;
    }

    // 保存当前全局状态
    this.snapshot = this.createSnapshot();
    this.active = true;
  }

  // 停用沙箱
  deactivate() {
    if (!this.active) {
      return;
    }

    // 恢复全局状态
    this.restoreSnapshot();
    this.active = false;
  }

  // 创建快照
  createSnapshot() {
    const snapshot = {};

    for (const key in window) {
      try {
        snapshot[key] = window[key];
      } catch (error) {
        // 某些属性可能不可访问
      }
    }

    return snapshot;
  }

  // 恢复快照
  restoreSnapshot() {
    for (const key in window) {
      if (!(key in this.snapshot)) {
        // 删除新增的属性
        delete window[key];
      } else if (window[key] !== this.snapshot[key]) {
        // 恢复修改的属性
        window[key] = this.snapshot[key];
      }
    }
  }

  // 设置全局属性
  setGlobalProperty(key, value) {
    if (!this.active) {
      return;
    }

    // 记录修改
    if (!(key in this.snapshot)) {
      this.modifiedProps.set(key, undefined);
    } else if (!this.modifiedProps.has(key)) {
      this.modifiedProps.set(key, this.snapshot[key]);
    }

    // 设置属性
    window[key] = value;
  }

  // 获取沙箱环境
  getSandboxEnvironment() {
    return {
      window: new Proxy(window, {
        set: (target, key, value) => {
          this.setGlobalProperty(key, value);
          return true;
        },
        get: (target, key) => {
          return target[key];
        },
      }),
    };
  }
}
```

### 4.3 代理沙箱实现

代理沙箱使用 Proxy 创建假的 window 对象，实现更高效的隔离。

```js
// 代理沙箱实现
class ProxySandbox extends BaseSandbox {
  constructor(name) {
    super(name);
    this.fakeWindow = Object.create(null); // 假的 window 对象
    this.proxy = null;
  }

  // 激活沙箱
  activate() {
    if (this.active) {
      return;
    }

    // 创建代理
    this.proxy = this.createProxy();
    this.active = true;
  }

  // 停用沙箱
  deactivate() {
    if (!this.active) {
      return;
    }

    this.active = false;
  }

  // 创建代理
  createProxy() {
    return new Proxy(this.fakeWindow, {
      get: (target, key) => {
        // 优先从 fakeWindow 获取
        if (key in target) {
          return target[key];
        }

        // 否则从真实 window 获取
        return window[key];
      },

      set: (target, key, value) => {
        // 只写入 fakeWindow
        target[key] = value;
        return true;
      },

      has: (target, key) => {
        // 检查属性是否存在
        return key in target || key in window;
      },

      deleteProperty: (target, key) => {
        // 只删除 fakeWindow 中的属性
        if (key in target) {
          delete target[key];
          return true;
        }
        return false;
      },

      ownKeys: (target) => {
        // 返回所有属性键
        const keys = Object.keys(target);
        const windowKeys = Object.keys(window);
        return [...new Set([...keys, ...windowKeys])];
      },

      getOwnPropertyDescriptor: (target, key) => {
        // 获取属性描述符
        if (key in target) {
          return Object.getOwnPropertyDescriptor(target, key);
        }
        return Object.getOwnPropertyDescriptor(window, key);
      },
    });
  }

  // 获取沙箱环境
  getSandboxEnvironment() {
    return {
      window: this.proxy,
    };
  }
}
```

### 4.4 沙箱管理器

沙箱管理器负责创建和管理多个沙箱实例。

```js
// 沙箱管理器
class SandboxManager {
  constructor() {
    this.sandboxes = new Map();
    this.activeSandbox = null;
  }

  // 创建沙箱
  createSandbox(name, options = {}) {
    const { type = "proxy", strictIsolation = false } = options;

    let sandbox;

    switch (type) {
      case "snapshot":
        sandbox = new SnapshotSandbox(name);
        break;
      case "proxy":
        sandbox = new ProxySandbox(name);
        break;
      default:
        throw new Error(`不支持的沙箱类型: ${type}`);
    }

    this.sandboxes.set(name, sandbox);
    return sandbox;
  }

  // 激活沙箱
  activateSandbox(name) {
    const sandbox = this.sandboxes.get(name);
    if (!sandbox) {
      throw new Error(`沙箱 ${name} 不存在`);
    }

    // 停用当前活跃的沙箱
    if (this.activeSandbox && this.activeSandbox !== sandbox) {
      this.activeSandbox.deactivate();
    }

    // 激活新沙箱
    sandbox.activate();
    this.activeSandbox = sandbox;
  }

  // 停用沙箱
  deactivateSandbox(name) {
    const sandbox = this.sandboxes.get(name);
    if (!sandbox) {
      return;
    }

    sandbox.deactivate();

    if (this.activeSandbox === sandbox) {
      this.activeSandbox = null;
    }
  }

  // 销毁沙箱
  destroySandbox(name) {
    const sandbox = this.sandboxes.get(name);
    if (!sandbox) {
      return;
    }

    sandbox.deactivate();
    this.sandboxes.delete(name);

    if (this.activeSandbox === sandbox) {
      this.activeSandbox = null;
    }
  }
}
```

## 5. 样式隔离原理

### 5.1 样式隔离策略

微前端中的样式隔离主要有三种策略：无隔离、严格隔离和实验性隔离。

```js
// 样式隔离管理器
class StyleIsolationManager {
  constructor() {
    this.loadedStyles = new Map();
    this.styleElements = new Map();
  }

  // 加载样式
  async loadStyles(styles, options = {}) {
    const { strictIsolation = false, experimentalIsolation = false } = options;

    const styleElements = [];

    for (const style of styles) {
      let styleElement;

      if (strictIsolation) {
        // 严格隔离：使用 Shadow DOM
        styleElement = await this.loadStyleWithShadowDOM(style);
      } else if (experimentalIsolation) {
        // 实验性隔离：添加前缀
        styleElement = await this.loadStyleWithPrefix(style);
      } else {
        // 无隔离：直接加载
        styleElement = await this.loadStyleDirectly(style);
      }

      styleElements.push(styleElement);
    }

    return styleElements;
  }

  // 直接加载样式
  async loadStyleDirectly(style) {
    if (style.href) {
      // 外部样式文件
      const linkElement = document.createElement("link");
      linkElement.rel = "stylesheet";
      linkElement.href = style.href;
      return linkElement;
    } else {
      // 内联样式
      const styleElement = document.createElement("style");
      styleElement.textContent = style.text;
      return styleElement;
    }
  }

  // 使用 Shadow DOM 加载样式
  async loadStyleWithShadowDOM(style) {
    const styleElement = await this.loadStyleDirectly(style);

    // 创建 Shadow DOM 容器
    const shadowContainer = document.createElement("div");
    shadowContainer.style.display = "contents";

    // 创建 Shadow Root
    const shadowRoot = shadowContainer.attachShadow({ mode: "open" });

    // 将样式添加到 Shadow Root
    shadowRoot.appendChild(styleElement);

    return shadowContainer;
  }

  // 使用前缀加载样式
  async loadStyleWithPrefix(style) {
    let styleContent = style.text;

    if (style.href) {
      // 加载外部样式文件
      const response = await fetch(style.href);
      styleContent = await response.text();
    }

    // 添加前缀
    const prefixedContent = this.addStylePrefix(styleContent);

    const styleElement = document.createElement("style");
    styleElement.textContent = prefixedContent;

    return styleElement;
  }

  // 添加样式前缀
  addStylePrefix(styleContent) {
    // 解析 CSS 规则
    const rules = this.parseCSSRules(styleContent);

    // 为每个规则添加前缀
    const prefixedRules = rules.map((rule) => {
      return this.addPrefixToRule(rule);
    });

    return prefixedRules.join("\n");
  }

  // 解析 CSS 规则
  parseCSSRules(styleContent) {
    const rules = [];
    const regex = /([^{}]+)\{([^{}]+)\}/g;
    let match;

    while ((match = regex.exec(styleContent)) !== null) {
      rules.push({
        selector: match[1].trim(),
        declarations: match[2].trim(),
      });
    }

    return rules;
  }

  // 为规则添加前缀
  addPrefixToRule(rule) {
    const { selector, declarations } = rule;

    // 分割选择器
    const selectors = selector.split(",").map((s) => s.trim());

    // 为每个选择器添加前缀
    const prefixedSelectors = selectors.map((sel) => {
      return this.addPrefixToSelector(sel);
    });

    return `${prefixedSelectors.join(", ")} { ${declarations} }`;
  }

  // 为选择器添加前缀
  addPrefixToSelector(selector) {
    // 生成唯一前缀
    const prefix = `[data-qiankun="${this.generateUniqueId()}"]`;

    // 处理不同的选择器类型
    if (selector.startsWith("html") || selector.startsWith("body")) {
      return selector;
    }

    if (selector.startsWith(":")) {
      return selector;
    }

    // 添加前缀
    return `${prefix} ${selector}`;
  }

  // 生成唯一 ID
  generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
  }
}
```

### 5.2 样式清理机制

当微应用卸载时，需要清理相关的样式，避免样式污染。

```js
// 样式清理器
class StyleCleaner {
  constructor() {
    this.appStyles = new Map();
  }

  // 注册应用样式
  registerAppStyles(appName, styleElements) {
    this.appStyles.set(appName, styleElements);
  }

  // 清理应用样式
  cleanAppStyles(appName) {
    const styleElements = this.appStyles.get(appName);
    if (!styleElements) {
      return;
    }

    styleElements.forEach((styleElement) => {
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    });

    this.appStyles.delete(appName);
  }

  // 清理所有样式
  cleanAllStyles() {
    this.appStyles.forEach((styleElements, appName) => {
      this.cleanAppStyles(appName);
    });
  }
}
```

## 6. Garfish 实现原理

### 6.1 核心架构

Garfish 是字节跳动开源的微前端框架，提供了完整的微前端解决方案。其核心架构包括应用管理器、沙箱管理器、插件系统等。

```js
// Garfish 核心架构
class Garfish {
  constructor(options = {}) {
    this.options = options;
    this.apps = new Map(); // 应用实例映射
    this.activeApps = new Set(); // 活跃应用集合
    this.plugins = new Map(); // 插件映射
    this.sandboxManager = new SandboxManager();
    this.loader = new AppLoader();
    this.router = new Router();
    this.eventBus = new EventBus();

    // 初始化插件
    this.initPlugins();
  }

  // 运行 Garfish
  async run(options) {
    const { apps = [], basename = "/" } = options;

    // 注册应用
    apps.forEach((app) => {
      this.registerApp(app);
    });

    // 启动路由
    this.router.start(basename);

    // 触发启动事件
    this.eventBus.emit("start", { apps });
  }

  // 注册应用
  registerApp(appConfig) {
    const { name, entry, activeWhen, props = {} } = appConfig;

    const app = {
      name,
      entry,
      activeWhen,
      props,
      status: "NOT_LOADED",
      instance: null,
      container: null,
      sandbox: null,
    };

    this.apps.set(name, app);

    // 注册路由规则
    this.router.registerRoute(name, activeWhen);
  }

  // 加载应用
  async loadApp(appName) {
    const app = this.apps.get(appName);
    if (!app) {
      throw new Error(`应用 ${appName} 未注册`);
    }

    if (app.status !== "NOT_LOADED") {
      return app;
    }

    try {
      app.status = "LOADING";

      // 1. 创建沙箱
      app.sandbox = this.sandboxManager.createSandbox(appName, {
        strictIsolation: true,
        experimentalStyleIsolation: true,
      });

      // 2. 加载应用资源
      const appInstance = await this.loader.loadApp(app.entry, app.sandbox);

      // 3. 初始化应用
      await this.initApp(app, appInstance);

      app.status = "LOADED";
      return app;
    } catch (error) {
      app.status = "LOAD_ERROR";
      throw error;
    }
  }

  // 激活应用
  async activateApp(appName) {
    const app = this.apps.get(appName);
    if (!app) {
      return;
    }

    if (app.status === "NOT_LOADED") {
      await this.loadApp(appName);
    }

    if (app.status === "LOADED") {
      try {
        app.status = "ACTIVATING";

        // 激活沙箱
        app.sandbox.activate();

        // 挂载应用
        await this.mountApp(app);

        app.status = "ACTIVE";
        this.activeApps.add(appName);

        // 触发激活事件
        this.eventBus.emit("appActivated", { appName, app });
      } catch (error) {
        app.status = "ACTIVATE_ERROR";
        throw error;
      }
    }
  }

  // 停用应用
  async deactivateApp(appName) {
    const app = this.apps.get(appName);
    if (!app || app.status !== "ACTIVE") {
      return;
    }

    try {
      app.status = "DEACTIVATING";

      // 卸载应用
      await this.unmountApp(app);

      // 停用沙箱
      app.sandbox.deactivate();

      app.status = "LOADED";
      this.activeApps.delete(appName);

      // 触发停用事件
      this.eventBus.emit("appDeactivated", { appName, app });
    } catch (error) {
      app.status = "DEACTIVATE_ERROR";
      throw error;
    }
  }

  // 初始化应用
  async initApp(app, appInstance) {
    app.instance = appInstance;

    // 验证生命周期函数
    this.validateLifecycleFunctions(appInstance);

    // 调用 bootstrap
    if (appInstance.bootstrap) {
      await appInstance.bootstrap(app.props);
    }
  }

  // 挂载应用
  async mountApp(app) {
    const { instance, props } = app;

    // 创建容器
    const container = this.createContainer(app.name);
    app.container = container;

    // 调用 mount
    await instance.mount({
      ...props,
      container,
      basename: this.options.basename,
    });
  }

  // 卸载应用
  async unmountApp(app) {
    const { instance } = app;

    if (instance.unmount) {
      await instance.unmount();
    }

    // 清理容器
    if (app.container) {
      app.container.innerHTML = "";
    }
  }

  // 创建容器
  createContainer(appName) {
    const containerId = `garfish-app-${appName}`;
    let container = document.getElementById(containerId);

    if (!container) {
      container = document.createElement("div");
      container.id = containerId;
      container.setAttribute("data-garfish-app", appName);
      document.body.appendChild(container);
    }

    return container;
  }

  // 验证生命周期函数
  validateLifecycleFunctions(appInstance) {
    const requiredFunctions = ["mount"];

    requiredFunctions.forEach((funcName) => {
      if (typeof appInstance[funcName] !== "function") {
        throw new Error(`应用必须导出 ${funcName} 函数`);
      }
    });
  }

  // 初始化插件
  initPlugins() {
    const defaultPlugins = [
      new DefaultPlugin(),
      new ErrorPlugin(),
      new PerformancePlugin(),
    ];

    defaultPlugins.forEach((plugin) => {
      this.use(plugin);
    });
  }

  // 使用插件
  use(plugin) {
    const pluginName = plugin.name || plugin.constructor.name;
    this.plugins.set(pluginName, plugin);

    // 初始化插件
    if (plugin.init) {
      plugin.init(this);
    }
  }
}
```

### 6.2 应用加载器

Garfish 的应用加载器负责加载和解析微应用的资源。

```js
// 应用加载器
class AppLoader {
  constructor() {
    this.cache = new Map();
    this.loadingPromises = new Map();
  }

  // 加载应用
  async loadApp(entry, sandbox) {
    if (this.cache.has(entry)) {
      return this.cache.get(entry);
    }

    if (this.loadingPromises.has(entry)) {
      return this.loadingPromises.get(entry);
    }

    const loadingPromise = this.loadAppResource(entry, sandbox);
    this.loadingPromises.set(entry, loadingPromise);

    try {
      const appInstance = await loadingPromise;
      this.cache.set(entry, appInstance);
      return appInstance;
    } finally {
      this.loadingPromises.delete(entry);
    }
  }

  // 加载应用资源
  async loadAppResource(entry, sandbox) {
    try {
      // 1. 加载 HTML 入口
      const htmlContent = await this.loadHtmlEntry(entry);

      // 2. 解析 HTML 内容
      const { scripts, styles, html } = this.parseHtml(htmlContent);

      // 3. 加载样式
      const styleElements = await this.loadStyles(styles);

      // 4. 加载脚本
      const appInstance = await this.loadScripts(scripts, sandbox);

      return {
        ...appInstance,
        styles: styleElements,
        html,
      };
    } catch (error) {
      throw new Error(`加载应用资源失败: ${entry}`);
    }
  }

  // 加载 HTML 入口
  async loadHtmlEntry(entry) {
    try {
      const response = await fetch(entry);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.text();
    } catch (error) {
      throw new Error(`加载 HTML 入口失败: ${entry}`);
    }
  }

  // 解析 HTML
  parseHtml(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    // 提取脚本
    const scripts = Array.from(doc.querySelectorAll("script")).map(
      (script) => ({
        src: script.src,
        text: script.textContent,
        async: script.async,
        defer: script.defer,
        type: script.type,
      })
    );

    // 提取样式
    const styles = Array.from(
      doc.querySelectorAll("link[rel='stylesheet'], style")
    ).map((style) => ({
      href: style.href,
      text: style.textContent,
      type: style.type || "text/css",
    }));

    // 提取 HTML 内容
    const html = doc.body ? doc.body.innerHTML : "";

    return { scripts, styles, html };
  }

  // 加载样式
  async loadStyles(styles) {
    const styleElements = [];

    for (const style of styles) {
      let styleElement;

      if (style.href) {
        // 外部样式文件
        styleElement = document.createElement("link");
        styleElement.rel = "stylesheet";
        styleElement.href = style.href;
      } else {
        // 内联样式
        styleElement = document.createElement("style");
        styleElement.textContent = style.text;
      }

      styleElements.push(styleElement);
    }

    return styleElements;
  }

  // 加载脚本
  async loadScripts(scripts, sandbox) {
    const appExports = {};

    for (const script of scripts) {
      let scriptContent;

      if (script.src) {
        // 外部脚本
        scriptContent = await this.loadExternalScript(script.src);
      } else {
        // 内联脚本
        scriptContent = script.text;
      }

      // 执行脚本
      const exports = this.executeScript(scriptContent, sandbox);
      Object.assign(appExports, exports);
    }

    return appExports;
  }

  // 加载外部脚本
  async loadExternalScript(src) {
    try {
      const response = await fetch(src);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.text();
    } catch (error) {
      throw new Error(`加载外部脚本失败: ${src}`);
    }
  }

  // 执行脚本
  executeScript(scriptContent, sandbox) {
    const fakeWindow = sandbox.getFakeWindow();

    // 使用 with 语句将 fakeWindow 加入作用域链
    const wrappedScript = `
      with (window) {
        ${scriptContent}
      }
    `;

    // 创建函数并执行
    const scriptFunction = new Function("window", wrappedScript);
    scriptFunction(fakeWindow);

    // 返回导出的内容
    return fakeWindow.__webpack_exports__ || fakeWindow.exports || {};
  }
}
```

### 6.3 路由管理

Garfish 的路由管理器负责处理应用的路由匹配和切换。

```js
// 路由管理器
class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.listeners = [];
    this.isStarted = false;
  }

  // 启动路由
  start(basename = "/") {
    if (this.isStarted) {
      return;
    }

    this.basename = basename;
    this.isStarted = true;

    // 监听路由变化
    this.setupRouteListener();

    // 初始路由匹配
    this.handleRouteChange();
  }

  // 注册路由
  registerRoute(appName, activeWhen) {
    this.routes.set(appName, {
      appName,
      activeWhen,
      isActive: false,
    });
  }

  // 设置路由监听器
  setupRouteListener() {
    // 监听 popstate 事件
    window.addEventListener("popstate", this.handleRouteChange.bind(this));

    // 监听 pushState 和 replaceState
    this.overrideHistoryMethods();
  }

  // 重写 History 方法
  overrideHistoryMethods() {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      this.handleRouteChange();
    };

    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      this.handleRouteChange();
    };
  }

  // 处理路由变化
  handleRouteChange() {
    const currentPath = this.getCurrentPath();
    const activeRoutes = this.getActiveRoutes(currentPath);

    // 更新路由状态
    this.updateRouteStates(activeRoutes);

    // 通知监听器
    this.notifyListeners(activeRoutes);
  }

  // 获取当前路径
  getCurrentPath() {
    const pathname = window.location.pathname;
    return pathname.startsWith(this.basename)
      ? pathname.slice(this.basename.length)
      : pathname;
  }

  // 获取活跃路由
  getActiveRoutes(currentPath) {
    const activeRoutes = [];

    this.routes.forEach((route) => {
      const isActive = this.matchRoute(route.activeWhen, currentPath);
      if (isActive) {
        activeRoutes.push(route.appName);
      }
    });

    return activeRoutes;
  }

  // 匹配路由
  matchRoute(activeWhen, currentPath) {
    if (typeof activeWhen === "function") {
      return activeWhen({ pathname: currentPath });
    }

    if (typeof activeWhen === "string") {
      return currentPath.startsWith(activeWhen);
    }

    if (Array.isArray(activeWhen)) {
      return activeWhen.some((rule) => {
        if (typeof rule === "string") {
          return currentPath.startsWith(rule);
        }
        return rule({ pathname: currentPath });
      });
    }

    return false;
  }

  // 更新路由状态
  updateRouteStates(activeRoutes) {
    this.routes.forEach((route) => {
      route.isActive = activeRoutes.includes(route.appName);
    });
  }

  // 通知监听器
  notifyListeners(activeRoutes) {
    this.listeners.forEach((listener) => {
      try {
        listener(activeRoutes);
      } catch (error) {
        console.error("路由监听器执行失败:", error);
      }
    });
  }

  // 添加路由监听器
  addListener(listener) {
    this.listeners.push(listener);
  }

  // 移除路由监听器
  removeListener(listener) {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }
}
```

### 6.4 插件系统

Garfish 的插件系统提供了丰富的扩展能力。

```js
// 插件基类
class BasePlugin {
  constructor(name) {
    this.name = name;
  }

  // 初始化插件
  init(garfish) {
    this.garfish = garfish;
  }

  // 应用加载前
  beforeLoad(app) {
    // 子类实现
  }

  // 应用加载后
  afterLoad(app) {
    // 子类实现
  }

  // 应用激活前
  beforeActivate(app) {
    // 子类实现
  }

  // 应用激活后
  afterActivate(app) {
    // 子类实现
  }

  // 应用停用前
  beforeDeactivate(app) {
    // 子类实现
  }

  // 应用停用后
  afterDeactivate(app) {
    // 子类实现
  }
}

// 默认插件
class DefaultPlugin extends BasePlugin {
  constructor() {
    super("default");
  }

  init(garfish) {
    super.init(garfish);

    // 监听应用生命周期事件
    this.setupLifecycleHooks();
  }

  setupLifecycleHooks() {
    this.garfish.eventBus.on("appActivated", (data) => {
      this.afterActivate(data.app);
    });

    this.garfish.eventBus.on("appDeactivated", (data) => {
      this.afterDeactivate(data.app);
    });
  }
}

// 错误处理插件
class ErrorPlugin extends BasePlugin {
  constructor() {
    super("error");
  }

  init(garfish) {
    super.init(garfish);

    // 监听错误事件
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    // 全局错误处理
    window.addEventListener("error", (event) => {
      this.handleError(event.error, event);
    });

    // Promise 错误处理
    window.addEventListener("unhandledrejection", (event) => {
      this.handleError(event.reason, event);
    });
  }

  handleError(error, event) {
    console.error("Garfish 错误:", error);

    // 触发错误事件
    this.garfish.eventBus.emit("error", {
      error,
      event,
      timestamp: Date.now(),
    });
  }
}

// 性能监控插件
class PerformancePlugin extends BasePlugin {
  constructor() {
    super("performance");
    this.metrics = new Map();
  }

  init(garfish) {
    super.init(garfish);

    // 监听性能事件
    this.setupPerformanceMonitoring();
  }

  setupPerformanceMonitoring() {
    this.garfish.eventBus.on("appActivated", (data) => {
      this.recordAppActivation(data.appName);
    });

    this.garfish.eventBus.on("appDeactivated", (data) => {
      this.recordAppDeactivation(data.appName);
    });
  }

  recordAppActivation(appName) {
    const startTime = performance.now();
    this.metrics.set(`${appName}_activation_start`, startTime);
  }

  recordAppDeactivation(appName) {
    const endTime = performance.now();
    const startTime = this.metrics.get(`${appName}_activation_start`);

    if (startTime) {
      const duration = endTime - startTime;
      this.metrics.set(`${appName}_activation_duration`, duration);

      // 触发性能事件
      this.garfish.eventBus.emit("performance", {
        appName,
        metric: "activation_duration",
        value: duration,
        timestamp: Date.now(),
      });
    }
  }
}
```

### 6.5 沙箱实现

Garfish 的沙箱实现提供了多种隔离策略。

```js
// Garfish 沙箱实现
class GarfishSandbox {
  constructor(name, options = {}) {
    this.name = name;
    this.options = options;
    this.active = false;
    this.fakeWindow = null;
    this.proxy = null;
  }

  // 激活沙箱
  activate() {
    if (this.active) {
      return;
    }

    this.fakeWindow = this.createFakeWindow();
    this.proxy = this.createProxy();
    this.active = true;
  }

  // 停用沙箱
  deactivate() {
    if (!this.active) {
      return;
    }

    this.active = false;
    this.cleanup();
  }

  // 创建假的 window 对象
  createFakeWindow() {
    const fakeWindow = Object.create(null);

    // 复制必要的全局属性
    const essentialProps = [
      "console",
      "document",
      "location",
      "navigator",
      "history",
      "localStorage",
      "sessionStorage",
      "fetch",
      "XMLHttpRequest",
    ];

    essentialProps.forEach((prop) => {
      if (prop in window) {
        fakeWindow[prop] = window[prop];
      }
    });

    return fakeWindow;
  }

  // 创建代理
  createProxy() {
    return new Proxy(this.fakeWindow, {
      get: (target, key) => {
        // 优先从 fakeWindow 获取
        if (key in target) {
          return target[key];
        }

        // 否则从真实 window 获取
        return window[key];
      },

      set: (target, key, value) => {
        // 只写入 fakeWindow
        target[key] = value;
        return true;
      },

      has: (target, key) => {
        return key in target || key in window;
      },

      deleteProperty: (target, key) => {
        if (key in target) {
          delete target[key];
          return true;
        }
        return false;
      },

      ownKeys: (target) => {
        const keys = Object.keys(target);
        const windowKeys = Object.keys(window);
        return [...new Set([...keys, ...windowKeys])];
      },

      getOwnPropertyDescriptor: (target, key) => {
        if (key in target) {
          return Object.getOwnPropertyDescriptor(target, key);
        }
        return Object.getOwnPropertyDescriptor(window, key);
      },
    });
  }

  // 获取假的 window 对象
  getFakeWindow() {
    return this.proxy;
  }

  // 清理
  cleanup() {
    this.fakeWindow = null;
    this.proxy = null;
  }
}
```

## 7. 通信机制原理

### 7.1 应用间通信

微前端应用之间需要通信机制来共享数据和状态。

```js
// 应用间通信管理器
class AppCommunicationManager {
  constructor() {
    this.eventBus = new EventBus();
    this.sharedState = new Map();
    this.subscribers = new Map();
  }

  // 发送消息
  sendMessage(from, to, message) {
    const event = {
      from,
      to,
      message,
      timestamp: Date.now(),
    };

    this.eventBus.emit("message", event);
  }

  // 订阅消息
  subscribe(appName, callback) {
    if (!this.subscribers.has(appName)) {
      this.subscribers.set(appName, []);
    }

    this.subscribers.get(appName).push(callback);
  }

  // 取消订阅
  unsubscribe(appName, callback) {
    const callbacks = this.subscribers.get(appName);
    if (!callbacks) {
      return;
    }

    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  // 设置共享状态
  setSharedState(key, value) {
    this.sharedState.set(key, value);
    this.eventBus.emit("stateChange", { key, value });
  }

  // 获取共享状态
  getSharedState(key) {
    return this.sharedState.get(key);
  }
}
```

### 7.2 事件总线实现

事件总线是应用间通信的核心机制。

```js
// 事件总线实现
class EventBus {
  constructor() {
    this.events = new Map();
  }

  // 监听事件
  on(eventName, callback) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }

    this.events.get(eventName).push(callback);
  }

  // 触发事件
  emit(eventName, data) {
    const callbacks = this.events.get(eventName);
    if (!callbacks) {
      return;
    }

    callbacks.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`事件回调执行失败: ${eventName}`, error);
      }
    });
  }

  // 移除监听
  off(eventName, callback) {
    const callbacks = this.events.get(eventName);
    if (!callbacks) {
      return;
    }

    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  // 一次性监听
  once(eventName, callback) {
    const onceCallback = (data) => {
      callback(data);
      this.off(eventName, onceCallback);
    };

    this.on(eventName, onceCallback);
  }
}
```

## 总结

微前端的实现原理涉及多个方面：

1. **路由管理**：通过监听路由变化来控制微应用的加载和卸载
2. **生命周期管理**：定义完整的应用生命周期，确保应用状态正确转换
3. **沙箱隔离**：使用不同的沙箱策略实现 JavaScript 隔离
4. **样式隔离**：通过多种策略实现 CSS 隔离
5. **模块加载**：动态加载远程模块和依赖
6. **通信机制**：提供应用间通信能力

每种方案都有其独特的实现方式，但核心思想都是通过技术手段实现应用的独立开发和部署，同时保证应用间的隔离和通信。
