# Docker 常规操作

## 容器操作

### 查看容器

```bash
# 查看运行中的容器
docker ps

# 查看所有容器（包括已停止的）
docker ps -a
```

### 启动/停止容器

```bash
# 启动容器
docker start <container_id>

# 停止容器
docker stop <container_id>

# 重启容器
docker restart <container_id>
```

### 删除容器

```bash
# 删除已停止的容器
docker rm <container_id>

# 强制删除运行中的容器
docker rm -f <container_id>
```

## 镜像操作

### 查看镜像

```bash
# 列出本地镜像
docker images
```

### 拉取镜像

```bash
# 拉取最新版本
docker pull <image_name>

# 拉取指定版本
docker pull <image_name>:<tag>
```

### 删除镜像

```bash
# 删除镜像
docker rmi <image_id>

# 强制删除镜像
docker rmi -f <image_id>
```

## 网络操作

### 查看网络

```bash
# 列出所有网络
docker network ls
```

### 创建网络

```bash
# 创建自定义网络
docker network create <network_name>
```

### 连接容器到网络

```bash
# 将容器连接到网络
docker network connect <network_name> <container_id>
```

## 数据卷操作

### 创建数据卷

```bash
# 创建数据卷
docker volume create <volume_name>
```

### 查看数据卷

```bash
# 列出所有数据卷
docker volume ls
```

### 删除数据卷

```bash
# 删除数据卷
docker volume rm <volume_name>
```

## 常用命令组合

### 清理未使用的资源

```bash
# 清理未使用的容器、网络、镜像和构建缓存
docker system prune
```

### 查看容器日志

```bash
# 查看容器日志
docker logs <container_id>

# 实时查看容器日志
docker logs -f <container_id>
```

### 进入容器内部

```bash
# 进入运行中的容器
docker exec -it <container_id> /bin/bash
```
