# 浏览器缓存类型详解

## HTTP 缓存

### 强缓存（Strong Cache）

强缓存是指浏览器直接从本地缓存中获取资源，不发送 HTTP 请求到服务器。

#### 控制字段

**Cache-Control**

```http
Cache-Control: max-age=3600        # 缓存3600秒
Cache-Control: no-cache            # 需要验证缓存
Cache-Control: no-store            # 不缓存
Cache-Control: private             # 仅客户端缓存
Cache-Control: public              # 可被代理服务器缓存
Cache-Control: immutable           # 资源永不变更
```

**Expires**

```http
Expires: Wed, 21 Oct 2024 07:28:00 GMT
```

#### 优先级

- `Cache-Control` > `Expires`
- `Cache-Control: no-cache` 会忽略 `Expires`

### 协商缓存（Negotiated Cache）

协商缓存需要浏览器发送请求到服务器，服务器判断资源是否更新。

#### ETag 机制

```http
# 请求头
If-None-Match: "abc123"

# 响应头
ETag: "abc123"
```

#### Last-Modified 机制

```http
# 请求头
If-Modified-Since: Wed, 21 Oct 2024 07:28:00 GMT

# 响应头
Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT
```

#### 响应状态码

- `200 OK`：资源已更新，返回新内容
- `304 Not Modified`：资源未更新，使用缓存

## 浏览器缓存层级

### Memory Cache（内存缓存）

- **位置**：浏览器内存
- **特点**：速度最快，容量有限
- **生命周期**：页面关闭时清除
- **适用**：CSS、JS、图片等静态资源

### Disk Cache（磁盘缓存）

- **位置**：硬盘存储
- **特点**：容量大，速度较慢
- **生命周期**：持久化存储
- **适用**：大文件、长期缓存资源

### HTTP Cache（HTTP 缓存）

- **位置**：浏览器缓存系统
- **特点**：遵循 HTTP 缓存规则
- **生命周期**：根据 HTTP 头部控制
- **适用**：所有 HTTP 资源

## 应用缓存

### Service Worker 缓存

现代浏览器的离线缓存方案，提供更精细的缓存控制。

#### 缓存策略

```javascript
// Cache First策略
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Network First策略
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// Stale While Revalidate策略
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        caches.open("v1").then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });
      return response || fetchPromise;
    })
  );
});
```

### Application Cache（已废弃）

HTML5 的离线缓存方案，已被 Service Worker 替代。

## 缓存存储位置

### Chrome 浏览器

- **内存缓存**：Chrome 进程内存
- **磁盘缓存**：`~/Library/Caches/Google/Chrome/Default/Cache/`
- **Service Worker**：`~/Library/Application Support/Google/Chrome/Default/Service Worker/`

### Firefox 浏览器

- **内存缓存**：Firefox 进程内存
- **磁盘缓存**：`~/Library/Caches/Firefox/Profiles/[profile]/cache2/`
- **Service Worker**：`~/Library/Application Support/Firefox/Profiles/[profile]/storage/`

### Safari 浏览器

- **内存缓存**：Safari 进程内存
- **磁盘缓存**：`~/Library/Caches/com.apple.Safari/`
- **Service Worker**：`~/Library/WebKit/ServiceWorkers/`

## 缓存优先级

1. **Service Worker 缓存**（如果存在）
2. **Memory Cache**
3. **Disk Cache**
4. **网络请求**

## 缓存失效机制

### 自动失效

- 超过`max-age`时间
- 超过`Expires`时间
- 浏览器存储空间不足

### 手动失效

- 用户清除浏览器缓存
- 开发者工具中禁用缓存
- 强制刷新（Ctrl+F5）

### 版本控制失效

- URL 参数变化（如`?v=1.0.1`）
- 文件名哈希变化（如`app.abc123.js`）
- ETag 值变化

## 缓存大小限制

### 浏览器限制

- **Chrome**：约 80%可用磁盘空间
- **Firefox**：约 50%可用磁盘空间
- **Safari**：约 1GB

### 单个资源限制

- **Memory Cache**：通常几 MB
- **Disk Cache**：通常几 GB
- **Service Worker**：通常几 GB

## 跨域缓存

### 同源策略

- 缓存遵循同源策略
- 不同域的资源独立缓存
- CORS 影响缓存行为

### 共享缓存

- CDN 缓存可跨域共享
- 代理服务器缓存
- 浏览器厂商缓存优化
