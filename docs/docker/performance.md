# Docker 性能优化

## 镜像优化

### 1. 多阶段构建

```dockerfile
# 构建阶段
FROM node:14-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

### 2. 层优化

```dockerfile
# 不推荐
FROM ubuntu
RUN apt-get update
RUN apt-get install -y nginx
RUN apt-get install -y php
RUN apt-get install -y mysql

# 推荐
FROM ubuntu
RUN apt-get update && \
    apt-get install -y \
    nginx \
    php \
    mysql && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

### 3. 基础镜像选择

```dockerfile
# 不推荐：使用完整镜像
FROM ubuntu:latest

# 推荐：使用精简镜像
FROM alpine:latest

# 推荐：使用官方优化镜像
FROM node:14-alpine
```

## 容器优化

### 1. 资源限制

```bash
# CPU 限制
docker run -d --name web \
  --cpus=0.5 \
  --cpu-shares=512 \
  nginx

# 内存限制
docker run -d --name web \
  --memory=512m \
  --memory-swap=1g \
  --memory-reservation=256m \
  nginx

# 进程数限制
docker run -d --name web \
  --pids-limit=100 \
  nginx
```

### 2. 存储优化

```bash
# 使用 tmpfs
docker run -d --name web \
  --tmpfs /tmp:rw,noexec,nosuid,size=100m \
  nginx

# 使用只读文件系统
docker run -d --name web \
  --read-only \
  -v /app/data:/app/data:rw \
  nginx

# 使用数据卷
docker run -d --name web \
  -v web-data:/app/data \
  nginx
```

### 3. 网络优化

```bash
# 使用 host 网络
docker run -d --name web \
  --network host \
  nginx

# 使用自定义网络
docker network create --driver bridge \
  --opt com.docker.network.bridge.name=mybridge \
  my-network

# 使用 DNS 配置
docker run -d --name web \
  --dns 8.8.8.8 \
  --dns 8.8.4.4 \
  nginx
```

## 应用优化

### 1. 进程管理

```bash
# 使用 init 系统
docker run -d --name web \
  --init \
  nginx

# 设置健康检查
docker run -d --name web \
  --health-cmd="curl -f http://localhost/health || exit 1" \
  --health-interval=30s \
  --health-timeout=3s \
  --health-retries=3 \
  nginx

# 设置重启策略
docker run -d --name web \
  --restart=unless-stopped \
  nginx
```

### 2. 日志管理

```bash
# 使用日志驱动
docker run -d --name web \
  --log-driver=json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  nginx

# 使用 syslog
docker run -d --name web \
  --log-driver=syslog \
  --log-opt syslog-address=udp://localhost:514 \
  nginx

# 使用日志轮转
docker run -d --name web \
  --log-driver=json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  --log-opt compress=true \
  nginx
```

### 3. 缓存优化

```bash
# 使用构建缓存
docker build --build-arg BUILDKIT_INLINE_CACHE=1 -t myapp .

# 使用镜像缓存
docker pull myapp:latest
docker build --cache-from myapp:latest -t myapp:new .

# 使用数据卷缓存
docker run -d --name web \
  -v web-cache:/app/cache \
  nginx
```

## 系统优化

### 1. Docker 守护进程

```bash
# 配置守护进程
cat > /etc/docker/daemon.json << EOF
{
  "storage-driver": "overlay2",
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "default-ulimits": {
    "nofile": {
      "Name": "nofile",
      "Hard": 64000,
      "Soft": 64000
    }
  }
}
EOF

# 重启守护进程
sudo systemctl restart docker
```

### 2. 系统配置

```bash
# 调整系统限制
cat > /etc/sysctl.d/99-docker.conf << EOF
net.ipv4.ip_forward=1
net.bridge.bridge-nf-call-iptables=1
net.bridge.bridge-nf-call-ip6tables=1
vm.swappiness=0
vm.max_map_count=262144
EOF

# 应用配置
sudo sysctl --system
```

### 3. 存储驱动

```bash
# 检查存储驱动
docker info | grep "Storage Driver"

# 配置 overlay2
cat > /etc/docker/daemon.json << EOF
{
  "storage-driver": "overlay2",
  "storage-opts": [
    "overlay2.size=10G"
  ]
}
EOF

# 重启 Docker
sudo systemctl restart docker
```

## 监控优化

### 1. 资源监控

```bash
# 使用 cAdvisor
docker run -d \
  --name=cadvisor \
  -p 8080:8080 \
  -v /:/rootfs:ro \
  -v /var/run:/var/run:ro \
  -v /sys:/sys:ro \
  -v /var/lib/docker/:/var/lib/docker:ro \
  gcr.io/cadvisor/cadvisor

# 使用 Prometheus
docker run -d \
  --name=prometheus \
  -p 9090:9090 \
  -v /path/to/prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus
```

### 2. 日志监控

```bash
# 使用 ELK Stack
docker-compose up -d elasticsearch logstash kibana

# 使用 Fluentd
docker run -d \
  --name=fluentd \
  -v /var/log:/var/log \
  -v /var/lib/docker/containers:/var/lib/docker/containers \
  fluent/fluentd
```

### 3. 性能分析

```bash
# 使用 Docker Stats
docker stats

# 使用 Docker Top
docker top container_name

# 使用 Docker Events
docker events
```

## 最佳实践

### 1. 镜像构建

```dockerfile
# 使用 .dockerignore
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
*.md

# 使用多阶段构建
FROM node:14-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

### 2. 容器运行

```bash
# 使用资源限制
docker run -d --name web \
  --cpus=0.5 \
  --memory=512m \
  --pids-limit=100 \
  nginx

# 使用健康检查
docker run -d --name web \
  --health-cmd="curl -f http://localhost/health || exit 1" \
  --health-interval=30s \
  nginx

# 使用日志管理
docker run -d --name web \
  --log-driver=json-file \
  --log-opt max-size=10m \
  nginx
```

### 3. 系统维护

```bash
# 定期清理
docker system prune -a

# 更新镜像
docker pull nginx:latest

# 检查系统状态
docker system df
docker system info
```

## 常见问题

### 1. 性能瓶颈

```bash
# 检查 CPU 使用
docker stats container_name

# 检查内存使用
docker stats container_name

# 检查磁盘 I/O
docker exec container_name iostat
```

### 2. 资源竞争

```bash
# 调整 CPU 共享
docker run -d --name web \
  --cpu-shares=512 \
  nginx

# 调整内存限制
docker run -d --name web \
  --memory=512m \
  --memory-swap=1g \
  nginx

# 调整进程数
docker run -d --name web \
  --pids-limit=100 \
  nginx
```

### 3. 网络延迟

```bash
# 使用 host 网络
docker run -d --name web \
  --network host \
  nginx

# 使用自定义网络
docker network create --driver bridge \
  --opt com.docker.network.bridge.name=mybridge \
  my-network

# 使用 DNS 配置
docker run -d --name web \
  --dns 8.8.8.8 \
  nginx
```

## 下一步

- 学习 [安全实践](./security.md)
- 了解 [CI/CD 集成](./cicd.md)
- 掌握 [故障排查](./troubleshooting.md)
