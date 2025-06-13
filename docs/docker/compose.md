# Docker Compose 容器编排

## 基础概念

### 什么是 Docker Compose

- 用于定义和运行多容器 Docker 应用的工具
- 使用 YAML 文件配置应用服务
- 一个命令即可创建和启动所有服务

### 核心概念

- 服务（Service）：一个应用容器
- 项目（Project）：一组关联的服务
- 配置文件：`docker-compose.yml`

## 安装配置

### 安装 Docker Compose

```bash
# 使用 pip 安装
pip install docker-compose

# 使用 curl 安装
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### 验证安装

```bash
docker-compose --version
```

## 基本使用

### 配置文件结构

```yaml
version: "3.8"

services:
  web:
    image: nginx
    ports:
      - "80:80"
    volumes:
      - ./src:/usr/share/nginx/html
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: secret
    volumes:
      - mysql-data:/var/lib/mysql

volumes:
  mysql-data:
```

### 常用命令

```bash
# 启动服务
docker-compose up

# 后台启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 查看服务状态
docker-compose ps

# 查看服务日志
docker-compose logs

# 重启服务
docker-compose restart
```

## 配置详解

### 服务配置

```yaml
services:
  web:
    # 镜像配置
    image: nginx:latest
    build: ./web
    build:
      context: ./web
      dockerfile: Dockerfile
      args:
        - NODE_ENV=production

    # 容器配置
    container_name: my-web
    restart: always
    depends_on:
      - db
      - redis

    # 环境变量
    environment:
      - NODE_ENV=production
      - DB_HOST=db
    env_file:
      - ./config/.env

    # 端口映射
    ports:
      - "80:80"
      - "443:443"

    # 数据卷
    volumes:
      - ./src:/app/src
      - static-data:/app/static

    # 网络配置
    networks:
      - frontend
      - backend

    # 健康检查
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### 网络配置

```yaml
networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true
```

### 数据卷配置

```yaml
volumes:
  mysql-data:
    driver: local
  static-data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /path/to/data
```

## 实际应用场景

### 1. 开发环境

```yaml
version: "3.8"

services:
  web:
    build: ./web
    volumes:
      - ./web:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    command: npm run dev

  db:
    image: postgres:13
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - postgres-data:/var/lib/postgresql/data

  redis:
    image: redis:6
    ports:
      - "6379:6379"

volumes:
  postgres-data:
```

### 2. 生产环境

```yaml
version: "3.8"

services:
  web:
    build: ./web
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    depends_on:
      - db
      - redis
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure

  db:
    image: postgres:13
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    deploy:
      placement:
        constraints: [node.role == manager]

  redis:
    image: redis:6
    volumes:
      - redis-data:/data
    deploy:
      placement:
        constraints: [node.role == manager]

volumes:
  postgres-data:
  redis-data:
```

### 3. 测试环境

```yaml
version: "3.8"

services:
  web:
    build: ./web
    environment:
      - NODE_ENV=test
    command: npm test
    depends_on:
      - db
      - redis

  db:
    image: postgres:13
    environment:
      POSTGRES_PASSWORD: test
    volumes:
      - postgres-test-data:/var/lib/postgresql/data

  redis:
    image: redis:6
    volumes:
      - redis-test-data:/data

volumes:
  postgres-test-data:
  redis-test-data:
```

## 最佳实践

### 1. 环境变量管理

```yaml
# docker-compose.yml
version: "3.8"

services:
  web:
    env_file:
      - ./config/.env
      - ./config/.env.${NODE_ENV}
```

### 2. 服务依赖

```yaml
services:
  web:
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
```

### 3. 资源限制

```yaml
services:
  web:
    deploy:
      resources:
        limits:
          cpus: "0.50"
          memory: 512M
        reservations:
          cpus: "0.25"
          memory: 256M
```

### 4. 健康检查

```yaml
services:
  web:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## 常见问题

### 1. 服务启动顺序

```yaml
services:
  web:
    depends_on:
      - db
      - redis
    command: >
      sh -c "
        echo 'Waiting for services...' &&
        sleep 10 &&
        npm start
      "
```

### 2. 数据持久化

```yaml
services:
  db:
    volumes:
      - type: volume
        source: db-data
        target: /var/lib/postgresql/data
        volume:
          nocopy: true
```

### 3. 网络问题

```yaml
services:
  web:
    networks:
      - frontend
      - backend
    dns:
      - 8.8.8.8
      - 8.8.4.4
```

## 调试技巧

### 1. 查看服务日志

```bash
# 查看所有服务日志
docker-compose logs

# 查看特定服务日志
docker-compose logs web

# 实时查看日志
docker-compose logs -f web
```

### 2. 进入容器

```bash
# 进入 web 服务容器
docker-compose exec web sh

# 进入 db 服务容器
docker-compose exec db psql -U postgres
```

### 3. 服务调试

```bash
# 查看服务状态
docker-compose ps

# 查看服务配置
docker-compose config

# 查看服务依赖
docker-compose config --services
```

## 下一步

- 学习 [监控和日志](./monitoring.md)
- 了解 [安全实践](./security.md)
- 掌握 [CI/CD 集成](./cicd.md)
