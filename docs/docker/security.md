# Docker 安全实践

## 容器安全

### 1. 非 root 用户运行

```dockerfile
# 创建非 root 用户
FROM node:14-alpine

# 创建用户和组
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 设置工作目录
WORKDIR /app

# 复制文件并设置权限
COPY --chown=appuser:appgroup . .

# 切换到非 root 用户
USER appuser

# 启动应用
CMD ["node", "app.js"]
```

### 2. 最小化攻击面

```dockerfile
# 使用多阶段构建
FROM node:14-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 使用轻量级基础镜像
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 只暴露必要端口
EXPOSE 80

# 使用非 root 用户
USER nginx
```

### 3. 资源限制

```bash
# 限制 CPU 使用
docker run -d --name web \
  --cpus=0.5 \
  nginx

# 限制内存使用
docker run -d --name web \
  --memory=512m \
  --memory-swap=1g \
  nginx

# 限制进程数
docker run -d --name web \
  --pids-limit=100 \
  nginx
```

## 镜像安全

### 1. 基础镜像选择

```dockerfile
# 推荐：使用官方镜像
FROM node:14-alpine

# 不推荐：使用非官方镜像
FROM someuser/node:14
```

### 2. 镜像扫描

```bash
# 使用 Docker Scout
docker scout quickview myapp

# 使用 Trivy
trivy image myapp

# 使用 Clair
clair-scanner --ip 172.17.0.1 myapp
```

### 3. 镜像签名

```bash
# 启用 Docker Content Trust
export DOCKER_CONTENT_TRUST=1

# 签名镜像
docker trust sign myapp:latest

# 验证签名
docker trust inspect myapp:latest
```

## 网络安全

### 1. 网络隔离

```bash
# 创建内部网络
docker network create --internal isolated-network

# 使用内部网络运行容器
docker run -d --name web \
  --network isolated-network \
  nginx
```

### 2. 端口暴露

```bash
# 只暴露必要端口
docker run -d --name web \
  -p 80:80 \
  --publish-all=false \
  nginx

# 限制端口访问
docker run -d --name web \
  -p 127.0.0.1:80:80 \
  nginx
```

### 3. 网络策略

```yaml
# docker-compose.yml
version: "3.8"

services:
  web:
    networks:
      - frontend
      - backend
    dns:
      - 8.8.8.8
      - 8.8.4.4

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true
```

## 数据安全

### 1. 数据卷权限

```bash
# 设置只读挂载
docker run -d --name web \
  -v $(pwd)/config:/app/config:ro \
  nginx

# 设置特定用户权限
docker run -d --name web \
  -v $(pwd)/data:/app/data:rw \
  --user 1000:1000 \
  nginx
```

### 2. 敏感数据管理

```bash
# 使用 Docker Secrets
echo "mysecret" | docker secret create db_password -

# 在服务中使用
docker service create \
  --name web \
  --secret db_password \
  nginx
```

### 3. 数据加密

```bash
# 使用加密数据卷
docker volume create \
  --driver local \
  --opt type=encrypted \
  --opt key=mykey \
  encrypted-data
```

## 运行时安全

### 1. 容器隔离

```bash
# 使用只读文件系统
docker run -d --name web \
  --read-only \
  nginx

# 禁用容器间通信
docker run -d --name web \
  --network none \
  nginx
```

### 2. 系统调用限制

```bash
# 限制系统调用
docker run -d --name web \
  --security-opt seccomp=unconfined \
  nginx

# 使用自定义 seccomp 配置
docker run -d --name web \
  --security-opt seccomp=/path/to/seccomp.json \
  nginx
```

### 3. 能力控制

```bash
# 移除所有能力
docker run -d --name web \
  --cap-drop=ALL \
  nginx

# 添加必要能力
docker run -d --name web \
  --cap-drop=ALL \
  --cap-add=NET_BIND_SERVICE \
  nginx
```

## 最佳实践

### 1. 安全扫描

```bash
# 定期扫描镜像
docker scout quickview myapp

# 扫描运行中的容器
docker scout cves myapp

# 检查配置
docker scout config myapp
```

### 2. 更新策略

```bash
# 使用特定版本
FROM node:14.17.0-alpine

# 定期更新基础镜像
docker pull node:14-alpine

# 使用多阶段构建
FROM node:14-alpine AS builder
# ... 构建步骤
FROM node:14-alpine
COPY --from=builder /app/dist /app
```

### 3. 监控和审计

```bash
# 启用 Docker 审计日志
dockerd --audit-log-path=/var/log/docker/audit.log

# 监控容器行为
docker events

# 检查容器配置
docker inspect web
```

## 常见问题

### 1. 权限问题

```bash
# 修改数据卷权限
docker run --rm \
  -v my-volume:/data \
  alpine chown -R 1000:1000 /data

# 设置容器用户
docker run -d --name web \
  --user 1000:1000 \
  nginx
```

### 2. 网络问题

```bash
# 检查网络连接
docker network inspect bridge

# 限制网络访问
docker run -d --name web \
  --network isolated-network \
  --dns 8.8.8.8 \
  nginx
```

### 3. 资源问题

```bash
# 监控资源使用
docker stats web

# 设置资源限制
docker run -d --name web \
  --cpus=0.5 \
  --memory=512m \
  nginx
```

## 下一步

- 学习 [CI/CD 集成](./cicd.md)
- 了解 [故障排查](./troubleshooting.md)
- 掌握 [性能优化](./performance.md)
