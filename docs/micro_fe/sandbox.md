# js 沙箱实现机制

常见沙箱实现思路有三种：

- SnapshotSandbox（快照沙箱）
- LegacySandbox（单实例沙箱）
- ProxySandbox (代理沙箱)

## 快照沙箱

快照沙箱是微前端里最直观的 JS 隔离方式之一：

挂载应用前 → 对 window 对象做一次“快照”，保存所有属性及其值。
应用运行中 → 子应用可以随意修改全局变量。
卸载应用时 → 把 window 恢复到挂载前的快照状态（新增的删掉、改过的还原）。

缺点：
能恢复全局变量，但性能差，还不支持并行运行。

```js
/**
 * 快照沙箱
 * - 挂载前：拍快照（浅拷贝 window 属性）
 * - 卸载时：恢复快照（删除新增，还原修改）
 */
function createSnapshotSandbox() {
  const rawWindow = window;
  let snapshot = null; // 存储拍下来的全局状态
  let modifiedProps = {}; // 存储运行过程中被修改的属性

  return {
    // 激活：拍下当前 window 状态
    activate() {
      snapshot = {};
      for (const key in rawWindow) {
        try {
          snapshot[key] = rawWindow[key];
        } catch (_) {
          // 某些属性可能不可访问，忽略即可
        }
      }
    },

    // 记录全局修改（手动写变量时调用）
    set(key, value) {
      modifiedProps[key] = rawWindow[key];
      rawWindow[key] = value;
    },

    // 失活：恢复 window 到快照
    deactivate() {
      for (const key in rawWindow) {
        if (!(key in snapshot)) {
          // 卸载后删除新增的
          delete rawWindow[key];
        } else if (rawWindow[key] !== snapshot[key]) {
          // 还原被修改的
          rawWindow[key] = snapshot[key];
        }
      }
      modifiedProps = {};
    },
  };
}
```

使用示例：

```js
const sandbox = createSnapshotSandbox();

sandbox.activate(); // 挂载前，拍快照
window.foo = 123; // 模拟子应用写全局
console.log(window.foo); // 123

sandbox.deactivate(); // 卸载后恢复
console.log(window.foo); // undefined（被删除）
```

## 单实例沙箱

```js
class LegacySandbox {
  constructor(name) {
    this.name = name;

    this.addedPropsMap = new Map(); // 记录新增的全局属性
    this.modifiedPropsOriginalMap = new Map(); // 记录修改前的原始值
    this.currentUpdatedPropsValueMap = new Map(); // 记录当前子应用改动后的值
  }

  // 激活：恢复上次的运行环境
  activate() {
    this.currentUpdatedPropsValueMap.forEach((v, p) => {
      window[p] = v;
    });
  }

  // 失活：清理全局变量
  deactivate() {
    // 删除新增属性
    this.addedPropsMap.forEach((_, p) => {
      delete window[p];
    });
    // 恢复修改过的属性
    this.modifiedPropsOriginalMap.forEach((v, p) => {
      window[p] = v;
    });
  }

  // 设置全局变量时调用
  setWindowProp(prop, value) {
    if (!window.hasOwnProperty(prop)) {
      // 新增属性
      this.addedPropsMap.set(prop, value);
    } else if (!this.modifiedPropsOriginalMap.has(prop)) {
      // 第一次修改，记录原始值
      this.modifiedPropsOriginalMap.set(prop, window[prop]);
    }
    // 记录最新值
    this.currentUpdatedPropsValueMap.set(prop, value);
    window[prop] = value;
  }
}
```

使用

```js
const sandbox = new LegacySandbox("app1");

sandbox.activate(); // 激活应用
sandbox.setWindowProp("foo", 123);
console.log(window.foo); // 123

sandbox.deactivate(); // 卸载应用
console.log(window.foo); // undefined（被删除）
```

## 代理沙箱

ProxySandbox 是 qiankun 沙箱的“终极形态”，现代浏览器环境下的主力方案。前面说的两种沙箱存在下面的问题

- SnapshotSandbox：全量快照，对比恢复，性能差。
- LegacySandbox：单实例（只能一个子应用同时运行），多个并行时会冲突。

为了解决 `性能 + 并行运行` 的问题，引入了 `ProxySandbox。`
它的核心是 ES6 的 `Proxy`，拦截对 window 的访问：

给每个子应用创建一个「假的 window」对象（称为 fakeWindow）。
fakeWindow 的原型指向真正的 window，这样子应用能正常访问到全局属性。
子应用对全局变量的 修改、删除、新增 都只会作用在 fakeWindow 上，而不会污染真实的 window。
不同子应用有不同的 fakeWindow，天然实现多实例隔离。

```js
// 1. 创建 ProxySandbox
function createProxySandbox() {
  // 创建一个空对象 没有原型链。
  const fakeWindow = Object.create(null);
  return new Proxy(fakeWindow, {
    get(target, prop) {
      if (prop in target) {
        return target[prop]; // 优先取子应用自己的
      }
      return window[prop]; // 否则取宿主的全局
    },
    set(target, prop, value) {
      target[prop] = value; // 写只写在 fakeWindow 上
      return true;
    },
  });
}

// 2. 模拟子应用执行环境
function runInSandbox(code, sandbox) {
  const wrapper = new Function(
    "window",
    `
    with(window) {
      ${code}
    }
  `
  );
  wrapper(sandbox); // 关键：传入 proxy
}

// 3. 使用
const sandbox1 = createProxySandbox();
const sandbox2 = createProxySandbox();

runInSandbox(
  `window.foo = "app1"; console.log("app1 foo =", window.foo);`,
  sandbox1
);
runInSandbox(
  `window.foo = "app2"; console.log("app2 foo =", window.foo);`,
  sandbox2
);

console.log("真实 window.foo =", window.foo); // undefined，没有污染
```

### new Proxy(fakeWindow, handler)

这里的逻辑简化一下主演干了下面的事情：

- get
  读属性时触发。优先取 fakeWindow，否则兜底真实 window。
  👉 写过的值会“遮挡”宿主值。
- set
  写属性时触发。只写入 fakeWindow，不污染真实 window。
- has
  with 语句查找变量时触发。返回 prop in fakeWindow || prop in window。
  👉 确保像 console、document 这些全局在子应用里能被正常访问。
- deleteProperty
  删除属性时触发。只删 fakeWindow 的内容，不影响真实 window。

### runInSandbox 是如何把子应用“绑”到 proxy 的

```js
const wrapper = new Function(
  "window",
  `  with(window) {
    ${code}
  }`
);
wrapper(proxy);
```

new Function("window", "with(window){ ... }") 创建了一个函数，函数参数名是 window。
wrapper(proxy) 把我们造的 proxy 作为形参 window 传入。
with(window) { ... } 会把这个 window（即 proxy）加入当前作用域链，所以代码里的未限定标识符（比如 foo 、 location 、 document ）会先在 proxy 上被查找/操作。
结合上面的 get/set/has，所有读取/写入都会被代理到 handler，从而实现拦截。

## CSS 隔离原理

qiankun 没有强制启用某种隔离，而是给开发者提供了几种选择：

- 默认：无强隔离， 子应用样式直接插入主应用 head，容易污染，但性能最好。
- StrictStyleIsolation（严格隔离）： 使用 Shadow DOM 把子应用包裹起来。

```js
registerMicroApps(apps, {
  sandbox: { strictStyleIsolation: true },
});
```

这种方式的优点是彻底隔离，但某些全局样式/第三方库不兼容

- ExperimentalStyleIsolation（实验性隔离）： 给子应用容器加 data-qiankun="xxx" 属性，然后动态给所有 CSS 规则加前缀。

```js
registerMicroApps(apps, {
  sandbox: { experimentalStyleIsolation: true },
});
```

这种范式类似 Vue 的 scoped CSS，兼容性比 Shadow DOM 更好。
