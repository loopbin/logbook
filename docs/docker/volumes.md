# Docker 数据持久化

## 数据卷（Volumes）

### 创建数据卷

```bash
# 创建数据卷
docker volume create my-volume

# 查看数据卷列表
docker volume ls

# 查看数据卷详情
docker volume inspect my-volume
```

### 使用数据卷

```bash
# 运行容器时挂载数据卷
docker run -d \
  --name my-container \
  -v my-volume:/app/data \
  nginx

# 使用绝对路径挂载
docker run -d \
  --name my-container \
  -v /host/path:/container/path \
  nginx
```

### 管理数据卷

```bash
# 删除数据卷
docker volume rm my-volume

# 删除未使用的数据卷
docker volume prune
```

## 绑定挂载（Bind Mounts）

### 基本用法

```bash
# 挂载本地目录
docker run -d \
  --name my-container \
  -v $(pwd)/src:/app/src \
  nginx

# 挂载单个文件
docker run -d \
  --name my-container \
  -v $(pwd)/config.json:/app/config.json \
  nginx
```

### 权限设置

```bash
# 设置只读挂载
docker run -d \
  --name my-container \
  -v $(pwd)/src:/app/src:ro \
  nginx

# 设置读写挂载（默认）
docker run -d \
  --name my-container \
  -v $(pwd)/src:/app/src:rw \
  nginx
```

## tmpfs 挂载

### 内存文件系统

```bash
# 使用 tmpfs 挂载
docker run -d \
  --name my-container \
  --tmpfs /app/tmp \
  nginx

# 设置 tmpfs 选项
docker run -d \
  --name my-container \
  --tmpfs /app/tmp:rw,noexec,nosuid,size=100m \
  nginx
```

## 实际应用场景

### 1. 数据库持久化

```bash
# MySQL 数据持久化
docker run -d \
  --name mysql \
  -v mysql-data:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=secret \
  mysql:8.0

# PostgreSQL 数据持久化
docker run -d \
  --name postgres \
  -v postgres-data:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=secret \
  postgres:13
```

### 2. 配置文件管理

```bash
# Nginx 配置
docker run -d \
  --name nginx \
  -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf \
  -v $(pwd)/conf.d:/etc/nginx/conf.d \
  nginx

# Node.js 应用配置
docker run -d \
  --name node-app \
  -v $(pwd)/.env:/app/.env \
  -v $(pwd)/config:/app/config \
  node:14
```

### 3. 日志管理

```bash
# 应用日志
docker run -d \
  --name my-app \
  -v $(pwd)/logs:/app/logs \
  my-app

# 系统日志
docker run -d \
  --name syslog \
  -v /var/log:/var/log \
  syslog-ng
```

## 数据备份和恢复

### 备份数据卷

```bash
# 备份 MySQL 数据
docker run --rm \
  -v mysql-data:/source \
  -v $(pwd)/backup:/backup \
  alpine tar -czf /backup/mysql-backup.tar.gz -C /source .

# 备份 PostgreSQL 数据
docker run --rm \
  -v postgres-data:/source \
  -v $(pwd)/backup:/backup \
  alpine tar -czf /backup/postgres-backup.tar.gz -C /source .
```

### 恢复数据

```bash
# 恢复 MySQL 数据
docker run --rm \
  -v mysql-data:/target \
  -v $(pwd)/backup:/backup \
  alpine sh -c "rm -rf /target/* && tar -xzf /backup/mysql-backup.tar.gz -C /target"

# 恢复 PostgreSQL 数据
docker run --rm \
  -v postgres-data:/target \
  -v $(pwd)/backup:/backup \
  alpine sh -c "rm -rf /target/* && tar -xzf /backup/postgres-backup.tar.gz -C /target"
```

## 最佳实践

### 1. 数据卷命名

```bash
# 使用有意义的名称
docker volume create app-data
docker volume create db-data
docker volume create logs-data
```

### 2. 权限管理

```bash
# 设置适当的权限
docker run -d \
  --name my-app \
  -v app-data:/app/data:rw \
  -v config-data:/app/config:ro \
  my-app
```

### 3. 数据隔离

```bash
# 为不同环境使用不同的数据卷
docker volume create dev-data
docker volume create prod-data
```

### 4. 定期备份

```bash
# 创建备份脚本
#!/bin/bash
BACKUP_DIR="/backup"
DATE=$(date +%Y%m%d)

# 备份 MySQL 数据
docker run --rm \
  -v mysql-data:/source \
  -v $BACKUP_DIR:/backup \
  alpine tar -czf /backup/mysql-$DATE.tar.gz -C /source .

# 备份 PostgreSQL 数据
docker run --rm \
  -v postgres-data:/source \
  -v $BACKUP_DIR:/backup \
  alpine tar -czf /backup/postgres-$DATE.tar.gz -C /source .
```

## 常见问题

### 1. 权限问题

```bash
# 修改数据卷权限
docker run --rm \
  -v my-volume:/data \
  alpine chown -R 1000:1000 /data
```

### 2. 空间问题

```bash
# 查看数据卷使用情况
docker system df -v

# 清理未使用的数据卷
docker volume prune
```

### 3. 性能问题

```bash
# 使用本地 SSD 存储
docker run -d \
  --name my-app \
  -v /ssd/data:/app/data \
  my-app
```

## 下一步

- 学习 [网络管理](./networking.md)
- 了解 [容器编排](./compose.md)
- 掌握 [监控和日志](./monitoring.md)
