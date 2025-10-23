# 缓存问题排查和调试

## 常见缓存问题

### 1. 缓存不生效

#### 问题表现

- 资源没有从缓存加载
- 每次都发送网络请求
- 页面加载速度慢

#### 排查步骤

**检查 HTTP 头部**

```bash
# 使用curl检查响应头
curl -I https://example.com/style.css

# 期望看到：
Cache-Control: max-age=31536000
ETag: "abc123"
Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT
```

**检查浏览器开发者工具**

1. 打开 Network 面板
2. 查看资源状态：
   - `200 OK`：从网络加载
   - `304 Not Modified`：使用缓存
   - `(from memory cache)`：从内存缓存
   - `(from disk cache)`：从磁盘缓存

**检查 Service Worker**

```javascript
// 检查Service Worker是否注册
navigator.serviceWorker.getRegistrations().then((registrations) => {
  console.log("Service Workers:", registrations);
});

// 检查缓存内容
caches.keys().then((cacheNames) => {
  console.log("Cache names:", cacheNames);
  cacheNames.forEach((cacheName) => {
    caches.open(cacheName).then((cache) => {
      cache.keys().then((requests) => {
        console.log(`Cache ${cacheName}:`, requests);
      });
    });
  });
});
```

#### 解决方案

```http
# 确保设置正确的缓存头
Cache-Control: max-age=3600
ETag: "version123"
Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT
```

### 2. 缓存不更新

#### 问题表现

- 修改资源后用户看不到更新
- 强制刷新才能看到新内容
- 版本号更新但缓存未失效

#### 排查步骤

**检查版本控制**

```html
<!-- 确保版本号变化 -->
<link rel="stylesheet" href="style.css?v=1.0.2" />
<script src="app.js?v=1.0.2"></script>
```

**检查 ETag**

```bash
# 检查ETag是否变化
curl -I https://example.com/style.css
# 第一次请求
ETag: "abc123"

# 修改文件后再次请求
curl -I https://example.com/style.css
# 应该看到新的ETag
ETag: "def456"
```

**检查 Service Worker 更新**

```javascript
// 检查Service Worker版本
self.addEventListener("install", (event) => {
  console.log("New Service Worker installed");
});

self.addEventListener("activate", (event) => {
  console.log("New Service Worker activated");
});
```

#### 解决方案

```javascript
// 强制更新Service Worker
self.addEventListener("message", (event) => {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});

// 清理旧缓存
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

### 3. 缓存过期问题

#### 问题表现

- 资源过期但仍在缓存中
- 用户看到过期内容
- 缓存时间设置不合理

#### 排查步骤

**检查缓存时间设置**

```http
# 检查当前设置
Cache-Control: max-age=3600

# 检查是否过期
# 计算：当前时间 - 缓存时间 > max-age
```

**检查浏览器缓存状态**

```javascript
// 检查缓存时间
const checkCacheAge = async (url) => {
  const response = await fetch(url, { method: "HEAD" });
  const cacheControl = response.headers.get("Cache-Control");
  const maxAge = cacheControl.match(/max-age=(\d+)/)?.[1];

  if (maxAge) {
    console.log(`Cache expires in ${maxAge} seconds`);
  }
};
```

#### 解决方案

```http
# 设置合理的缓存时间
# 静态资源：长期缓存
Cache-Control: max-age=31536000, immutable

# 动态内容：短期缓存
Cache-Control: max-age=300

# 实时数据：不缓存
Cache-Control: no-cache, must-revalidate
```

### 4. 跨域缓存问题

#### 问题表现

- 跨域资源无法缓存
- CORS 影响缓存行为
- 不同域的资源缓存策略不一致

#### 排查步骤

**检查 CORS 设置**

```http
# 检查CORS头部
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type
```

**检查跨域请求**

```javascript
// 检查跨域请求是否成功
fetch("https://api.example.com/data", {
  mode: "cors",
  credentials: "include",
})
  .then((response) => {
    console.log("CORS request successful:", response);
  })
  .catch((error) => {
    console.error("CORS request failed:", error);
  });
```

#### 解决方案

```http
# 服务器设置CORS头部
Access-Control-Allow-Origin: https://yourdomain.com
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```

### 5. 存储空间问题

#### 问题表现

- 缓存被自动清理
- 存储空间不足
- 大文件无法缓存

#### 排查步骤

**检查存储配额**

```javascript
// 检查存储使用情况
navigator.storage.estimate().then((estimate) => {
  const used = estimate.usage;
  const available = estimate.quota;
  const percentage = (used / available) * 100;

  console.log(`Storage used: ${used} bytes`);
  console.log(`Storage available: ${available} bytes`);
  console.log(`Usage percentage: ${percentage.toFixed(2)}%`);
});
```

**检查缓存大小**

```javascript
// 检查缓存大小
const checkCacheSize = async () => {
  const cacheNames = await caches.keys();
  let totalSize = 0;

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();

    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }

  console.log(`Total cache size: ${totalSize} bytes`);
};
```

#### 解决方案

```javascript
// 清理旧缓存
const cleanupOldCache = async () => {
  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(
    (name) => name !== CACHE_NAME && name.startsWith("old-cache-")
  );

  await Promise.all(oldCaches.map((cacheName) => caches.delete(cacheName)));
};

// 限制缓存大小
const limitCacheSize = async (maxSize) => {
  const cache = await caches.open(CACHE_NAME);
  const requests = await cache.keys();

  if (requests.length > maxSize) {
    // 删除最旧的缓存
    const oldRequests = requests.slice(0, requests.length - maxSize);
    await Promise.all(oldRequests.map((request) => cache.delete(request)));
  }
};
```

## 调试工具和方法

### 1. 浏览器开发者工具

#### Network 面板

- 查看资源加载状态
- 检查缓存命中情况
- 分析加载时间

#### Application 面板

- 查看 Service Worker 状态
- 检查缓存内容
- 管理存储空间

#### Console 面板

```javascript
// 调试缓存状态
console.log("Cache status:", await caches.keys());

// 调试Service Worker
navigator.serviceWorker.getRegistrations().then((registrations) => {
  console.log("Service Workers:", registrations);
});
```

### 2. 命令行工具

#### curl 调试

```bash
# 检查HTTP头部
curl -I https://example.com/style.css

# 检查ETag
curl -H "If-None-Match: abc123" -I https://example.com/style.css

# 检查Last-Modified
curl -H "If-Modified-Since: Wed, 21 Oct 2024 07:28:00 GMT" -I https://example.com/style.css
```

#### 网络分析工具

```bash
# 使用tcpdump分析网络请求
sudo tcpdump -i any -n port 80

# 使用wireshark分析HTTP请求
# 过滤条件：http
```

### 3. 性能监控

#### 缓存命中率监控

```javascript
// 监控缓存命中率
const cacheMonitor = {
  hits: 0,
  misses: 0,

  recordHit() {
    this.hits++;
    this.logStats();
  },

  recordMiss() {
    this.misses++;
    this.logStats();
  },

  get hitRate() {
    return this.hits / (this.hits + this.misses);
  },

  logStats() {
    console.log(`Cache hit rate: ${(this.hitRate * 100).toFixed(2)}%`);
  },
};

// 在Service Worker中使用
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        cacheMonitor.recordHit();
        return response;
      } else {
        cacheMonitor.recordMiss();
        return fetch(event.request);
      }
    })
  );
});
```

#### 性能指标监控

```javascript
// 监控缓存性能
const performanceMonitor = {
  startTime: 0,

  start() {
    this.startTime = performance.now();
  },

  end() {
    const duration = performance.now() - this.startTime;
    console.log(`Cache operation took ${duration.toFixed(2)}ms`);
    return duration;
  },
};

// 使用示例
performanceMonitor.start();
const response = await caches.match(request);
performanceMonitor.end();
```

### 4. 自动化测试

#### 缓存测试脚本

```javascript
// 测试缓存功能
const testCache = async () => {
  const testUrl = "https://example.com/test.css";

  // 清除缓存
  await caches.delete("test-cache");

  // 第一次请求（应该从网络加载）
  const start1 = performance.now();
  const response1 = await fetch(testUrl);
  const time1 = performance.now() - start1;

  // 缓存响应
  const cache = await caches.open("test-cache");
  await cache.put(testUrl, response1.clone());

  // 第二次请求（应该从缓存加载）
  const start2 = performance.now();
  const response2 = await cache.match(testUrl);
  const time2 = performance.now() - start2;

  console.log(`Network request: ${time1.toFixed(2)}ms`);
  console.log(`Cache request: ${time2.toFixed(2)}ms`);
  console.log(
    `Speed improvement: ${(((time1 - time2) / time1) * 100).toFixed(2)}%`
  );
};
```

#### 缓存一致性测试

```javascript
// 测试缓存一致性
const testCacheConsistency = async () => {
  const testUrl = "https://example.com/data.json";

  // 获取网络版本
  const networkResponse = await fetch(testUrl);
  const networkData = await networkResponse.json();

  // 获取缓存版本
  const cacheResponse = await caches.match(testUrl);
  const cacheData = await cacheResponse.json();

  // 比较数据
  const isConsistent =
    JSON.stringify(networkData) === JSON.stringify(cacheData);
  console.log(`Cache consistency: ${isConsistent ? "OK" : "FAILED"}`);

  if (!isConsistent) {
    console.log("Network data:", networkData);
    console.log("Cache data:", cacheData);
  }
};
```

## 常见错误和解决方案

### 1. 缓存策略错误

#### 错误：所有资源都使用相同缓存策略

```http
# 错误做法
Cache-Control: max-age=3600  # 对所有资源使用相同时间

# 正确做法
# HTML文件
Cache-Control: no-cache, must-revalidate

# CSS/JS文件
Cache-Control: max-age=31536000, immutable

# 图片文件
Cache-Control: max-age=2592000
```

#### 错误：忽略版本控制

```html
<!-- 错误做法 -->
<link rel="stylesheet" href="style.css" />

<!-- 正确做法 -->
<link rel="stylesheet" href="style.css?v=1.0.1" />
```

### 2. Service Worker 错误

#### 错误：不处理缓存更新

```javascript
// 错误做法
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open("v1").then((cache) => cache.addAll(urlsToCache)));
});

// 正确做法
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open("v1").then((cache) => cache.addAll(urlsToCache)));
  self.skipWaiting(); // 立即激活新版本
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== "v1") {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

### 3. 安全错误

#### 错误：缓存敏感数据

```javascript
// 错误做法
const cacheSensitiveData = async (data) => {
  const cache = await caches.open("user-data");
  await cache.put("/user/profile", new Response(JSON.stringify(data)));
};

// 正确做法
const handleSensitiveData = async (data) => {
  // 不缓存敏感数据，直接使用
  return data;
};
```

## 最佳实践总结

### 1. 缓存策略选择

- 静态资源：Cache First + 长期缓存
- 动态内容：Network First + 短期缓存
- 实时数据：Network Only + 不缓存

### 2. 版本控制

- 使用文件名哈希或 URL 参数
- 确保版本变化时缓存失效
- 监控版本更新状态

### 3. 监控和调试

- 定期检查缓存命中率
- 监控存储空间使用情况
- 使用开发者工具调试问题

### 4. 错误处理

- 实现缓存失败降级方案
- 处理网络不可用情况
- 提供离线页面支持

### 5. 性能优化

- 预加载关键资源
- 使用 CDN 加速
- 优化缓存策略
