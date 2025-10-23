# 缓存策略和最佳实践

## 缓存策略

### 1. Cache First（缓存优先）

优先使用缓存，缓存未命中时才请求网络。

#### 适用场景

- 静态资源（CSS、JS、图片）
- 不经常变化的资源
- 离线优先的应用

#### 实现示例

```javascript
// Service Worker实现
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// HTTP头部设置
Cache-Control: max-age=31536000, immutable
```

### 2. Network First（网络优先）

优先使用网络请求，网络失败时使用缓存。

#### 适用场景

- 动态内容
- 实时数据
- 需要最新信息的场景

#### 实现示例

```javascript
// Service Worker实现
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // 网络请求成功，更新缓存
        const responseClone = response.clone();
        caches.open('v1').then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // 网络失败，使用缓存
        return caches.match(event.request);
      })
  );
});

// HTTP头部设置
Cache-Control: no-cache, must-revalidate
```

### 3. Stale While Revalidate（过期重新验证）

使用缓存的同时在后台更新资源。

#### 适用场景

- 平衡性能和新鲜度
- 用户体验优先的场景
- 可接受短暂过期数据的场景

#### 实现示例

```javascript
// Service Worker实现
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        const fetchPromise = fetch(event.request)
          .then(networkResponse => {
            caches.open('v1').then(cache => {
              cache.put(event.request, networkResponse.clone());
            });
            return networkResponse;
          });
        return response || fetchPromise;
      })
  );
});

// HTTP头部设置
Cache-Control: max-age=3600, stale-while-revalidate=86400
```

### 4. Network Only（仅网络）

只使用网络请求，不使用缓存。

#### 适用场景

- 敏感数据
- 实时性要求极高的场景
- 需要强制刷新的场景

#### 实现示例

```javascript
// Service Worker实现
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});

// HTTP头部设置
Cache-Control: no-store, no-cache, must-revalidate
```

### 5. Cache Only（仅缓存）

只使用缓存，不请求网络。

#### 适用场景

- 离线应用
- 完全静态的资源
- 网络不可用时的降级方案

#### 实现示例

```javascript
// Service Worker实现
self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request));
});

// HTTP头部设置
Cache-Control: max-age=31536000, immutable
```

## 最佳实践

### 1. 资源分类缓存

#### 静态资源

```http
# HTML文件
Cache-Control: no-cache, must-revalidate

# CSS/JS文件（带版本号）
Cache-Control: max-age=31536000, immutable

# 图片资源
Cache-Control: max-age=2592000

# 字体文件
Cache-Control: max-age=31536000, immutable
```

#### 动态内容

```http
# API接口
Cache-Control: no-cache, must-revalidate

# 用户数据
Cache-Control: private, no-cache, must-revalidate

# 实时数据
Cache-Control: no-store, no-cache, must-revalidate
```

### 2. 版本控制策略

#### URL 参数版本控制

```html
<link rel="stylesheet" href="style.css?v=1.0.1" />
<script src="app.js?v=1.0.1"></script>
```

#### 文件名哈希版本控制

```html
<link rel="stylesheet" href="style.a1b2c3d4.css" />
<script src="app.e5f6g7h8.js"></script>
```

#### ETag 版本控制

```http
ETag: "abc123def456"
If-None-Match: "abc123def456"
```

### 3. 缓存预热

#### 预加载关键资源

```html
<link rel="preload" href="critical.css" as="style" />
<link rel="preload" href="app.js" as="script" />
<link rel="preload" href="hero-image.jpg" as="image" />
```

#### Service Worker 预缓存

```javascript
const CACHE_NAME = "v1";
const urlsToCache = [
  "/",
  "/styles/main.css",
  "/scripts/main.js",
  "/images/logo.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});
```

### 4. 缓存更新策略

#### 渐进式更新

```javascript
// 检查更新
self.addEventListener("message", (event) => {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});

// 激活新版本
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

#### 强制更新

```javascript
// 检查版本
const checkUpdate = async () => {
  const response = await fetch("/version.json");
  const { version } = await response.json();

  if (version !== currentVersion) {
    // 提示用户更新
    showUpdateNotification();
  }
};
```

### 5. 缓存监控

#### 缓存命中率监控

```javascript
// 统计缓存命中率
const cacheStats = {
  hits: 0,
  misses: 0,
  get hitRate() {
    return this.hits / (this.hits + this.misses);
  },
};

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        cacheStats.hits++;
      } else {
        cacheStats.misses++;
      }
      return response || fetch(event.request);
    })
  );
});
```

#### 性能监控

```javascript
// 监控缓存性能
const performanceObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.name.includes("cache")) {
      console.log("Cache performance:", entry);
    }
  });
});

performanceObserver.observe({ entryTypes: ["measure"] });
```

### 6. 错误处理

#### 缓存失败处理

```javascript
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request)
        .then((response) => {
          // 检查响应是否有效
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // 缓存响应
          const responseToCache = response.clone();
          caches
            .open("v1")
            .then((cache) => cache.put(event.request, responseToCache));

          return response;
        })
        .catch(() => {
          // 网络失败，返回离线页面
          return caches.match("/offline.html");
        });
    })
  );
});
```

### 7. 安全考虑

#### 敏感数据不缓存

```http
# 用户认证信息
Cache-Control: private, no-store, no-cache, must-revalidate

# 支付信息
Cache-Control: no-store, no-cache, must-revalidate, max-age=0
```

#### HTTPS 缓存

```http
# 强制HTTPS缓存
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### 8. 移动端优化

#### 移动端缓存策略

```javascript
// 检测网络状态
const isOnline = navigator.onLine;
const connection = navigator.connection;

if (connection && connection.effectiveType === "slow-2g") {
  // 慢网络使用更激进的缓存策略
  useAggressiveCaching();
} else {
  // 正常网络使用标准缓存策略
  useStandardCaching();
}
```

#### 存储空间管理

```javascript
// 检查存储配额
navigator.storage.estimate().then((estimate) => {
  const used = estimate.usage;
  const available = estimate.quota;
  const percentage = (used / available) * 100;

  if (percentage > 80) {
    // 清理旧缓存
    cleanupOldCache();
  }
});
```

## 缓存策略选择指南

### 资源类型 → 策略映射

| 资源类型 | 推荐策略      | 缓存时间 | 理由               |
| -------- | ------------- | -------- | ------------------ |
| HTML     | Network First | 短期     | 需要最新内容       |
| CSS/JS   | Cache First   | 长期     | 静态资源，版本控制 |
| 图片     | Cache First   | 中期     | 不常变化，文件较大 |
| API 数据 | Network First | 短期     | 动态内容           |
| 字体     | Cache First   | 长期     | 静态资源，版本控制 |
| 视频     | Cache First   | 长期     | 文件大，不常变化   |

### 业务场景 → 策略映射

| 业务场景 | 推荐策略               | 特殊考虑         |
| -------- | ---------------------- | ---------------- |
| 新闻网站 | Network First          | 内容实时性重要   |
| 电商网站 | Stale While Revalidate | 平衡性能和新鲜度 |
| 博客网站 | Cache First            | 内容相对静态     |
| 实时聊天 | Network Only           | 实时性要求极高   |
| 离线应用 | Cache Only             | 离线优先         |
