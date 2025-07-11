# Dockerfile 编写指南

## 基础指令

### FROM

指定基础镜像

```dockerfile
# 使用官方 Node.js 镜像
FROM node:14-alpine

# 使用官方 Python 镜像
FROM python:3.9-slim
```

### WORKDIR

设置工作目录

```dockerfile
# 设置工作目录为 /app
WORKDIR /app
```

### COPY/ADD

复制文件到容器中

```dockerfile
# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 复制所有文件
COPY . .

# ADD 支持自动解压和远程 URL
ADD https://example.com/file.tar.gz /app/
```

### RUN

执行命令

```dockerfile
# 安装依赖
RUN npm install

# 多个命令合并
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*
```

### ENV

设置环境变量

```dockerfile
# 设置单个环境变量
ENV NODE_ENV=production

# 设置多个环境变量
ENV NODE_ENV=production \
    PORT=3000
```

### EXPOSE

声明端口

```dockerfile
# 声明容器将使用 3000 端口
EXPOSE 3000
```

### CMD/ENTRYPOINT

指定容器启动命令

```dockerfile
# CMD 可以被 docker run 的命令覆盖
CMD ["node", "app.js"]

# ENTRYPOINT 不会被覆盖，但可以与 CMD 配合使用
ENTRYPOINT ["node"]
CMD ["app.js"]
```

## 最佳实践

### 1. 使用官方镜像

```dockerfile
# 推荐
FROM node:14-alpine

# 不推荐
FROM ubuntu:latest
```

### 2. 使用特定版本

```dockerfile
# 推荐
FROM node:14.17.0-alpine

# 不推荐
FROM node:latest
```

### 3. 多阶段构建

```dockerfile
# 构建阶段
FROM node:14-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 运行阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

### 4. 优化层数

```dockerfile
# 不推荐
RUN apt-get update
RUN apt-get install -y curl
RUN rm -rf /var/lib/apt/lists/*

# 推荐
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*
```

### 5. 使用 .dockerignore

```
node_modules
npm-debug.log
.git
.gitignore
.env
```

## 常见应用示例

### Node.js 应用

```dockerfile
FROM node:14-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Python 应用

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
```

### Nginx 静态网站

```dockerfile
FROM nginx:alpine

COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

## 调试技巧

### 1. 构建时调试

```bash
# 查看构建过程
docker build -t myapp . --progress=plain

# 在特定阶段停止
docker build --target builder -t myapp:builder .
```

### 2. 运行时调试

```bash
# 使用交互式 shell
docker run -it --rm myapp /bin/sh

# 查看容器日志
docker logs <container_id>
```

### 3. 检查镜像

```bash
# 查看镜像历史
docker history myapp

# 检查镜像层
docker inspect myapp
```

## 安全考虑

### 1. 使用非 root 用户

```dockerfile
FROM node:14-alpine

# 创建非 root 用户
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY --chown=appuser:appgroup . .

USER appuser

CMD ["node", "app.js"]
```

### 2. 扫描漏洞

```bash
# 使用 Docker Scout
docker scout quickview myapp

# 使用 Trivy
trivy image myapp
```

### 3. 最小化攻击面

```dockerfile
# 只安装必要的包
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*
```

## 性能优化

### 1. 缓存优化

```dockerfile
# 先复制依赖文件
COPY package*.json ./
RUN npm install

# 再复制源代码
COPY . .
```

### 2. 镜像大小优化

```dockerfile
# 使用 alpine 基础镜像
FROM node:14-alpine

# 清理缓存
RUN npm install && \
    npm cache clean --force
```

### 3. 构建速度优化

```dockerfile
# 使用构建缓存
COPY package*.json ./
RUN npm ci

# 使用多阶段构建
FROM node:14-alpine AS builder
# ... 构建步骤

FROM node:14-alpine
COPY --from=builder /app/dist /app
```

## 下一步

- 学习 [数据持久化](./volumes.md)
- 了解 [网络管理](./networking.md)
- 掌握 [容器编排](./compose.md)
