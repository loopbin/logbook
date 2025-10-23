# 主流微前端实现方案

微前端架构允许团队独立开发、部署和维护前端应用的不同部分。以下是当前主流的微前端实现方案：

## 1. Single-SPA

### 概述

Single-SPA 是一个用于构建微前端的 JavaScript 框架，它允许你在同一个页面上使用多个框架。

### 核心特性

- **框架无关**：支持 React、Vue、Angular 等任何框架
- **路由驱动**：基于路由的微前端加载
- **生命周期管理**：提供完整的应用生命周期钩子
- **代码分割**：支持按需加载

### 实现原理

```js
// 注册微应用
import { registerApplication, start } from "single-spa";

registerApplication({
  name: "app1",
  app: () => System.import("app1"),
  activeWhen: "/app1",
});

registerApplication({
  name: "app2",
  app: () => System.import("app2"),
  activeWhen: "/app2",
});

start();
```

### 生命周期

```js
// 微应用需要导出的生命周期函数
export const bootstrap = async () => {
  console.log("应用启动");
};

export const mount = async (props) => {
  console.log("应用挂载", props);
};

export const unmount = async (props) => {
  console.log("应用卸载", props);
};
```

### 优缺点

**优点：**

- 框架无关，灵活性高
- 社区活跃，生态丰富
- 学习成本相对较低

**缺点：**

- 需要手动处理样式隔离
- 需要手动处理 JS 沙箱
- 配置相对复杂

## 2. qiankun

### 概述

qiankun 是基于 Single-SPA 的微前端实现库，由蚂蚁金服团队开发，提供了开箱即用的微前端解决方案。

### 核心特性

- **基于 Single-SPA**：继承了 Single-SPA 的所有特性
- **HTML Entry**：支持 HTML 入口，无需改造现有应用
- **JS 沙箱**：提供完整的 JavaScript 隔离
- **样式隔离**：支持多种样式隔离方案
- **预加载**：支持应用预加载

### 实现原理

```js
// 主应用配置
import { registerMicroApps, start } from "qiankun";

registerMicroApps([
  {
    name: "reactApp",
    entry: "//localhost:3000",
    container: "#subapp-viewport",
    activeRule: "/react",
  },
  {
    name: "vueApp",
    entry: "//localhost:3001",
    container: "#subapp-viewport",
    activeRule: "/vue",
  },
]);

start();
```

### 沙箱机制

qiankun 提供了三种沙箱实现：

- **SnapshotSandbox**：快照沙箱（兼容性最好）
- **LegacySandbox**：单实例沙箱
- **ProxySandbox**：代理沙箱（推荐）

### 样式隔离

```js
// 严格样式隔离（Shadow DOM）
registerMicroApps(apps, {
  sandbox: { strictStyleIsolation: true },
});

// 实验性样式隔离（CSS 前缀）
registerMicroApps(apps, {
  sandbox: { experimentalStyleIsolation: true },
});
```

### 优缺点

**优点：**

- 开箱即用，配置简单
- 完整的隔离方案
- 支持 HTML Entry
- 中文文档完善

**缺点：**

- 基于 Single-SPA，存在一些限制
- 对某些第三方库兼容性不佳

### qiankun 工作原理详解

qiankun 的核心工作原理基于 HTML Entry 和沙箱隔离机制，主要包含以下几个关键步骤：

#### 1. HTML Entry 解析过程

```js
// qiankun 内部实现的核心流程
const importHTML = async (url) => {
  // 1. 获取 HTML 内容
  const html = await fetch(url).then((res) => res.text());

  // 2. 解析 HTML，提取资源
  const template = document.createElement("div");
  template.innerHTML = html;

  // 3. 提取 script 标签
  const scripts = template.querySelectorAll("script");
  const styles = template.querySelectorAll('link[rel="stylesheet"]');

  // 4. 处理样式资源
  const styleSheets = await Promise.all(
    Array.from(styles).map((link) => {
      return fetch(link.href).then((res) => res.text());
    })
  );

  // 5. 处理脚本资源
  const scriptsText = await Promise.all(
    Array.from(scripts).map((script) => {
      return script.src
        ? fetch(script.src).then((res) => res.text())
        : script.innerHTML;
    })
  );

  return {
    template: template.innerHTML,
    scripts: scriptsText,
    styles: styleSheets,
  };
};
```

#### 2. 子应用加载执行流程

```js
// 子应用加载的完整流程
const loadApp = async (appConfig) => {
  const { name, entry, container } = appConfig;

  // 步骤1: 解析 HTML Entry
  const { template, scripts, styles } = await importHTML(entry);

  // 步骤2: 创建沙箱环境
  const sandbox = new ProxySandbox(name);
  sandbox.start();

  // 步骤3: 样式隔离处理
  const scopedCSS = scopedCSS(template, styles);

  // 步骤4: 创建容器
  const containerElement = document.querySelector(container);
  containerElement.innerHTML = scopedCSS;

  // 步骤5: 执行脚本
  const execScripts = async () => {
    const execScript = (scriptText) => {
      // 在沙箱环境中执行脚本
      const execScriptWithSandbox = `
        (function(window, self, globalThis){
          ${scriptText}
        }).bind(window)(${sandbox.proxy}, ${sandbox.proxy}, ${sandbox.proxy});
      `;
      return new Function(execScriptWithSandbox)();
    };

    // 按顺序执行所有脚本
    for (const script of scripts) {
      await execScript(script);
    }
  };

  // 步骤6: 获取生命周期函数
  const lifecycle = await execScripts();

  return {
    mount: lifecycle.mount,
    unmount: lifecycle.unmount,
    bootstrap: lifecycle.bootstrap,
  };
};
```

#### 3. 沙箱隔离机制

qiankun 提供了三种沙箱实现，其中 ProxySandbox 是最推荐的：

```js
// ProxySandbox 实现原理
class ProxySandbox {
  constructor(name) {
    this.name = name;
    this.proxy = null;
    this.running = false;
    this.sandboxRunning = false;
    this.active = false;

    // 创建代理对象
    this.proxy = new Proxy(window, {
      get: (target, prop) => {
        // 优先从沙箱环境获取
        if (this.sandboxRunning && this.proxy.hasOwnProperty(prop)) {
          return this.proxy[prop];
        }
        // 从全局 window 获取
        return target[prop];
      },

      set: (target, prop, value) => {
        if (this.sandboxRunning) {
          // 在沙箱环境中设置属性
          this.proxy[prop] = value;
          return true;
        }
        // 设置到全局 window
        target[prop] = value;
        return true;
      },

      has: (target, prop) => {
        return prop in target || prop in this.proxy;
      },

      deleteProperty: (target, prop) => {
        if (this.sandboxRunning) {
          delete this.proxy[prop];
          return true;
        }
        delete target[prop];
        return true;
      },
    });
  }

  start() {
    this.sandboxRunning = true;
    this.active = true;
  }

  stop() {
    this.sandboxRunning = false;
    this.active = false;
  }
}
```

#### 4. 样式隔离机制

```js
// 样式隔离实现
const scopedCSS = (template, styles) => {
  const scopedTemplate = template.replace(
    /<style[^>]*>([\s\S]*?)<\/style>/gi,
    (match, css) => {
      // 为每个 CSS 规则添加作用域前缀
      const scopedCSS = css.replace(
        /([^{}]+){([^{}]*)}/g,
        (match, selector, rules) => {
          const scopedSelector = selector
            .split(",")
            .map((s) => `[data-qiankun="${appName}"] ${s.trim()}`)
            .join(", ");
          return `${scopedSelector} { ${rules} }`;
        }
      );
      return `<style>${scopedCSS}</style>`;
    }
  );

  return scopedTemplate;
};
```

#### 5. 生命周期管理

```js
// 子应用生命周期执行
const mountApp = async (app) => {
  try {
    // 1. 启动沙箱
    app.sandbox.start();

    // 2. 执行 bootstrap
    if (app.lifecycle.bootstrap) {
      await app.lifecycle.bootstrap();
    }

    // 3. 执行 mount
    if (app.lifecycle.mount) {
      await app.lifecycle.mount({
        container: app.container,
        props: app.props,
      });
    }

    app.status = "mounted";
  } catch (error) {
    console.error(`应用 ${app.name} 挂载失败:`, error);
  }
};

const unmountApp = async (app) => {
  try {
    // 1. 执行 unmount
    if (app.lifecycle.unmount) {
      await app.lifecycle.unmount();
    }

    // 2. 停止沙箱
    app.sandbox.stop();

    // 3. 清理 DOM
    app.container.innerHTML = "";

    app.status = "unmounted";
  } catch (error) {
    console.error(`应用 ${app.name} 卸载失败:`, error);
  }
};
```

#### 6. 路由匹配与切换

```js
// 路由匹配机制
const matchRoute = (pathname) => {
  return apps.filter((app) => {
    if (typeof app.activeRule === "string") {
      return pathname.startsWith(app.activeRule);
    }
    if (typeof app.activeRule === "function") {
      return app.activeRule(pathname);
    }
    if (app.activeRule instanceof RegExp) {
      return app.activeRule.test(pathname);
    }
    return false;
  });
};

// 路由变化监听
const listenRouteChange = () => {
  window.addEventListener("popstate", handleRouteChange);
  window.addEventListener("pushstate", handleRouteChange);
  window.addEventListener("replacestate", handleRouteChange);

  // 重写 history 方法
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    originalPushState.apply(history, args);
    handleRouteChange();
  };

  history.replaceState = function (...args) {
    originalReplaceState.apply(history, args);
    handleRouteChange();
  };
};

const handleRouteChange = () => {
  const pathname = window.location.pathname;
  const matchedApps = matchRoute(pathname);

  // 卸载当前应用
  currentApp && unmountApp(currentApp);

  // 挂载新应用
  if (matchedApps.length > 0) {
    currentApp = matchedApps[0];
    mountApp(currentApp);
  }
};
```

#### 7. 预加载机制

```js
// 应用预加载
const prefetchApps = (apps) => {
  apps.forEach((app) => {
    if (app.prefetch) {
      // 预加载应用资源
      importHTML(app.entry).then(({ scripts, styles }) => {
        // 缓存资源
        app.cache = { scripts, styles };
      });
    }
  });
};
```

### 核心优势

1. **HTML Entry**: 无需改造现有应用，直接使用 HTML 作为入口
2. **沙箱隔离**: 完整的 JS 执行环境隔离，避免全局污染
3. **样式隔离**: 支持多种样式隔离方案，避免样式冲突
4. **生命周期管理**: 完整的应用生命周期管理
5. **预加载优化**: 支持应用预加载，提升用户体验

qiankun 通过重写 Element.prototype 上的 appendChild 和 insertBefore 等方法，拦截所有插入 `<script>` 的操作，通过 fetch 加载 src 指定的脚本文件，然后用 new Function() 运行，来把 window 指定到自己创建的 Proxy 对象上，以构建一个沙箱环境。

## 3. Module Federation

### 概述

Module Federation 是 Webpack 5 提供的原生微前端解决方案，允许在运行时动态加载其他应用的模块。

### 核心特性

- **原生支持**：Webpack 5 原生功能
- **运行时集成**：无需构建时依赖
- **共享依赖**：支持依赖共享
- **类型安全**：支持 TypeScript

### 实现原理

```js
// webpack.config.js - 主应用
const ModuleFederationPlugin = require("@module-federation/webpack");

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "shell",
      remotes: {
        app1: "app1@http://localhost:3001/remoteEntry.js",
        app2: "app2@http://localhost:3002/remoteEntry.js",
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true },
      },
    }),
  ],
};
```

```js
// webpack.config.js - 微应用
const ModuleFederationPlugin = require("@module-federation/webpack");

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "app1",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App",
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true },
      },
    }),
  ],
};
```

### 使用方式

```js
// 动态导入远程模块
const RemoteApp = React.lazy(() => import("app1/App"));

function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <RemoteApp />
      </Suspense>
    </div>
  );
}
```

### 优缺点

**优点：**

- Webpack 原生支持
- 运行时集成
- 依赖共享机制
- 性能优秀

**缺点：**

- 需要 Webpack 5
- 学习成本较高
- 生态相对较新

## 4. EMP (Emp Micro Frontend)

### 概述

EMP 是字节跳动开源的微前端解决方案，基于 Module Federation 构建，提供了更完善的开发体验。

### 核心特性

- **基于 Module Federation**：继承了 Module Federation 的所有特性
- **TypeScript 支持**：完整的 TypeScript 支持
- **开发工具**：提供完善的开发工具链
- **热更新**：支持微应用热更新

### 实现原理

```js
// emp.config.js
module.exports = {
  name: "shell",
  remotes: {
    app1: "app1@http://localhost:3001/emp.js",
  },
  shared: {
    react: { singleton: true },
    "react-dom": { singleton: true },
  },
};
```

### 开发工具

```bash
# 安装 EMP CLI
npm install -g @efox/emp-cli

# 创建微前端项目
emp create my-micro-frontend

# 启动开发服务器
emp dev
```

### 优缺点

**优点：**

- 基于 Module Federation
- 完善的 TypeScript 支持
- 开发工具链完善
- 字节跳动团队维护

**缺点：**

- 相对较新，生态不够成熟
- 依赖 Webpack 5

## 5. Garfish

### 概述

Garfish 是字节跳动开源的微前端框架，提供了完整的微前端解决方案。

### 核心特性

- **多框架支持**：支持 React、Vue、Angular 等
- **沙箱隔离**：完整的 JS 和 CSS 隔离
- **插件系统**：丰富的插件生态
- **性能优化**：内置性能优化方案

### 实现原理

```js
// 主应用配置
import Garfish from "@garfish/core";

Garfish.run({
  apps: [
    {
      name: "app1",
      entry: "http://localhost:3000",
      activeWhen: "/app1",
    },
  ],
});
```

### 沙箱机制

```js
// 配置沙箱
Garfish.run({
  apps: [
    {
      name: "app1",
      entry: "http://localhost:3000",
      sandbox: {
        strictIsolation: true, // 严格隔离
        experimentalStyleIsolation: true, // 样式隔离
      },
    },
  ],
});
```

### 优缺点

**优点：**

- 完整的微前端解决方案
- 沙箱隔离完善
- 插件系统丰富
- 性能优化

**缺点：**

- 相对较新
- 学习成本较高

## 6. 其他方案

### iframe 方案

```html
<!-- 简单的 iframe 集成 -->
<iframe src="http://localhost:3000" width="100%" height="600px"></iframe>
```

**优点：** 完全隔离，实现简单
**缺点：** 性能差，通信复杂，SEO 不友好

### Web Components

```js
// 自定义元素
class MicroApp extends HTMLElement {
  connectedCallback() {
    this.innerHTML = "<div>微应用内容</div>";
  }
}

customElements.define("micro-app", MicroApp);
```

**优点：** 原生支持，标准化
**缺点：** 浏览器兼容性，生态不够成熟

## 方案选择建议

### 技术栈考虑

- **React 生态**：推荐 qiankun 或 Module Federation
- **Vue 生态**：推荐 qiankun 或 Garfish
- **多框架混合**：推荐 Single-SPA 或 qiankun

### 项目规模考虑

- **小型项目**：iframe 或 Web Components
- **中型项目**：qiankun 或 Module Federation
- **大型项目**：Garfish 或自研方案

### 团队能力考虑

- **初级团队**：qiankun（开箱即用）
- **中级团队**：Module Federation（需要 Webpack 知识）
- **高级团队**：Single-SPA 或自研方案

## 总结

微前端方案选择需要综合考虑技术栈、项目规模、团队能力等因素。目前主流方案各有优势：

- **qiankun**：适合大多数场景，开箱即用
- **Module Federation**：适合 Webpack 5 项目，性能优秀
- **Single-SPA**：适合需要高度定制的场景
- **Garfish**：适合大型项目，功能完善

选择方案时建议先进行技术验证，确保方案能够满足项目需求。
