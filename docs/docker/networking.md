# Docker 网络管理

## 网络基础

Docker 通过网络实现容器之间、容器与外部的通信。每个容器默认连接到一个网络，常见为 bridge 网络。合理配置网络有助于提升安全性和灵活性。

## 常见网络类型

### 1. bridge（默认）

- 适用于单机多容器通信，容器间可通过名称互通。

```bash
# 创建自定义 bridge 网络
docker network create my-bridge

# 运行容器并连接到自定义网络
docker run -d --name app1 --network my-bridge nginx
```

### 2. host

- 容器与宿主机共享网络命名空间，适合对网络性能要求极高的场景。

```bash
# 使用 host 网络
docker run -d --name my-app --network host nginx
```

### 3. none

- 容器无网络连接，适合极致隔离场景。

```bash
# 使用 none 网络
docker run -d --name isolated --network none nginx
```

### 4. overlay

- 用于多主机集群（Swarm/K8s），实现跨主机容器通信。

```bash
# 仅在 Swarm 模式下可用
# docker network create -d overlay my-overlay
```

## 网络命令

### 创建网络

```bash
# 创建 bridge 网络
docker network create my-bridge

# 创建 overlay 网络（Swarm）
docker network create -d overlay my-overlay
```

### 查看网络

```bash
# 查看所有网络
docker network ls

# 查看网络详情
docker network inspect my-bridge
```

### 删除网络

```bash
# 删除网络
docker network rm my-bridge
```

### 容器连接/断开网络

````bash
# 连接容器到网络
docker network connect my-bridge my-app

# 从网络断开容器
docker network disconnect my-bridge my-app
```

## 网络配置与端口映射

### 端口映射

```bash
# 将宿主机端口 8080 映射到容器 80 端口
docker run -d -p 8080:80 nginx

# 映射指定 IP 和端口
docker run -d -p 127.0.0.1:8080:80 nginx
````

### 指定容器别名

```bash
# 在自定义网络中为容器指定别名
docker run -d --name web --network my-bridge --network-alias myweb nginx
```

## 实际应用场景

### 1. 多容器通信

```bash
# 创建自定义网络
docker network create app-net

# 启动服务端容器
docker run -d --name backend --network app-net my-backend

# 启动客户端容器，可通过容器名 backend 访问服务
docker run -d --name frontend --network app-net my-frontend
```

### 2. 网络隔离

```bash
# 为不同环境创建不同网络
docker network create dev-net
docker network create prod-net

# 各自环境的容器仅能访问本网络内的服务
```

### 3. 端口映射示例

```bash
# 仅暴露需要的端口，提升安全性
docker run -d -p 3306:3306 mysql:8.0
```

## 网络调试与排查

### 查看网络详情

```bash
# 查看网络结构和连接的容器
docker network inspect app-net
```

### 容器内网络测试

```bash
# 进入容器，使用 ping 或 curl 测试网络
# 需容器内有相关工具

docker exec -it frontend sh
ping backend
curl http://backend:端口
```

## 最佳实践

### 1. 网络命名规范

- 使用有意义的网络名称，便于管理。

### 2. 安全隔离

- 仅将需要通信的容器放入同一网络。
- 避免所有容器都在默认 bridge 网络。

### 3. 性能建议

- 对高性能需求场景可考虑 host 网络。
- 合理使用 overlay 网络实现跨主机通信。

## 常见问题

### 1. 端口冲突

```bash
# 宿主机端口已被占用，需更换映射端口
# 错误示例：Bind for 0.0.0.0:80 failed: port is already allocated
```

### 2. 网络不可达

```bash
# 检查容器是否在同一网络
# 检查防火墙和安全组设置
```

## 下一步

- 学习 [数据卷管理](./volumes.md)
- 了解 [容器编排](./compose.md)
- 掌握 [监控和日志](./monitoring.md)
