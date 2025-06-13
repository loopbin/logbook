# Docker 基础入门

## 环境准备

### Windows/Mac 安装

1. 访问 [Docker Desktop 下载页面](https://www.docker.com/products/docker-desktop)
2. 下载对应系统的安装包
3. 运行安装程序，按照向导完成安装
4. 安装完成后，打开终端验证：

```bash
docker --version
docker run hello-world
```

### Linux 安装

以 Ubuntu 为例：

```bash
# 更新包索引
sudo apt-get update

# 安装必要的依赖
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# 添加 Docker 的官方 GPG 密钥
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# 设置稳定版仓库
echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安装 Docker Engine
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io

# 验证安装
sudo docker run hello-world
```

## 核心概念

### 镜像（Image）

- 镜像是一个只读的模板，包含了运行应用所需的所有文件和配置
- 类比：前端项目的 `node_modules` 目录
- 特点：
  - 分层存储
  - 可复用
  - 不可修改

### 容器（Container）

- 容器是镜像的运行实例
- 类比：正在运行的开发服务器（如 `npm run dev`）
- 特点：
  - 可读写
  - 相互隔离
  - 生命周期管理

### Dockerfile

- 用于构建镜像的文本文件
- 类比：项目的 `package.json`
- 包含：
  - 基础镜像
  - 运行环境
  - 应用代码
  - 启动命令

### 数据卷（Volume）

- 用于持久化数据的机制
- 类比：数据库文件
- 特点：
  - 数据持久化
  - 容器间共享
  - 备份和恢复

### 网络（Network）

- 容器间通信的机制
- 类比：前端项目的 API 调用
- 类型：
  - bridge（默认）
  - host
  - none
  - overlay

## 基础命令

### 镜像操作

```bash
# 拉取镜像
docker pull nginx

# 查看本地镜像
docker images

# 删除镜像
docker rmi nginx
```

### 容器操作

```bash
# 运行容器
docker run -d -p 80:80 nginx

# 查看运行中的容器
docker ps

# 查看所有容器
docker ps -a

# 停止容器
docker stop <container_id>

# 启动容器
docker start <container_id>

# 删除容器
docker rm <container_id>
```

### 容器交互

```bash
# 进入容器内部
docker exec -it <container_id> /bin/bash

# 查看容器日志
docker logs <container_id>

# 实时查看日志
docker logs -f <container_id>
```

## 第一个 Docker 应用

让我们创建一个简单的 Node.js 应用：

1. 创建项目目录：

```bash
mkdir docker-demo
cd docker-demo
```

2. 创建 `app.js`：

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello Docker!\n");
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Server running at http://0.0.0.0:3000/");
});
```

3. 创建 `Dockerfile`：

```dockerfile
FROM node:14-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]
```

4. 构建镜像：

```bash
docker build -t my-node-app .
```

5. 运行容器：

```bash
docker run -d -p 3000:3000 my-node-app
```

6. 访问应用：
   打开浏览器访问 `http://localhost:3000`

## 常见问题

### 1. 权限问题

```bash
# 将当前用户添加到 docker 组
sudo usermod -aG docker $USER

# 重新登录使更改生效
```

### 2. 端口占用

```bash
# 查看端口占用
sudo lsof -i :80

# 停止占用端口的进程
sudo kill <PID>
```

### 3. 磁盘空间

```bash
# 清理未使用的镜像
docker system prune -a

# 查看磁盘使用情况
docker system df
```

## 下一步

- 学习 [Dockerfile 编写](./dockerfile.md)
- 了解 [数据持久化](./volumes.md)
- 掌握 [网络管理](./networking.md)
