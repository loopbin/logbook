# Docker 故障排查

## 容器问题

### 1. 容器无法启动

```bash
# 查看容器日志
docker logs container_name

# 查看容器详细信息
docker inspect container_name

# 查看容器状态
docker ps -a

# 检查容器配置
docker container inspect container_name
```

### 2. 容器异常退出

```bash
# 查看退出状态码
docker ps -a

# 查看容器日志
docker logs container_name

# 检查系统日志
journalctl -u docker

# 检查容器资源使用
docker stats container_name
```

### 3. 容器网络问题

```bash
# 检查网络连接
docker network inspect bridge

# 测试容器网络
docker exec container_name ping google.com

# 检查 DNS 配置
docker exec container_name cat /etc/resolv.conf

# 查看网络统计
docker network ls
docker network inspect network_name
```

## 镜像问题

### 1. 镜像构建失败

```bash
# 查看构建日志
docker build -t myapp . 2>&1 | tee build.log

# 使用详细输出
docker build --progress=plain -t myapp .

# 检查 Dockerfile 语法
docker build --no-cache -t myapp .

# 分步构建
docker build --target builder -t myapp:builder .
```

### 2. 镜像拉取失败

```bash
# 检查网络连接
ping registry-1.docker.io

# 检查认证信息
docker login

# 清理本地缓存
docker system prune -a

# 使用镜像加速器
docker pull registry.docker-cn.com/library/nginx
```

### 3. 镜像安全问题

```bash
# 扫描镜像漏洞
docker scan myapp:latest

# 检查镜像层
docker history myapp:latest

# 检查镜像配置
docker inspect myapp:latest

# 验证镜像签名
docker trust inspect myapp:latest
```

## 存储问题

### 1. 数据卷问题

```bash
# 检查数据卷
docker volume ls
docker volume inspect volume_name

# 清理未使用数据卷
docker volume prune

# 备份数据卷
docker run --rm -v volume_name:/source -v $(pwd):/backup alpine tar -czf /backup/backup.tar.gz -C /source .

# 恢复数据卷
docker run --rm -v volume_name:/target -v $(pwd):/backup alpine sh -c "cd /target && tar -xzf /backup/backup.tar.gz"
```

### 2. 磁盘空间问题

```bash
# 查看磁盘使用
docker system df

# 清理未使用资源
docker system prune

# 清理特定资源
docker container prune
docker image prune
docker volume prune
docker network prune

# 检查大文件
docker system df -v
```

### 3. 权限问题

```bash
# 检查文件权限
docker exec container_name ls -la /path/to/directory

# 修改文件权限
docker exec container_name chown -R user:group /path/to/directory

# 检查用户权限
docker exec container_name id

# 修改容器用户
docker run --user 1000:1000 image_name
```

## 网络问题

### 1. 容器间通信

```bash
# 检查网络连接
docker network inspect bridge

# 测试容器间通信
docker exec container1 ping container2

# 检查端口映射
docker port container_name

# 检查网络配置
docker network inspect network_name
```

### 2. 端口冲突

```bash
# 检查端口使用
netstat -tulpn | grep LISTEN

# 修改端口映射
docker run -p 8080:80 nginx

# 使用随机端口
docker run -P nginx

# 检查容器端口
docker port container_name
```

### 3. DNS 问题

```bash
# 检查 DNS 配置
docker exec container_name cat /etc/resolv.conf

# 设置自定义 DNS
docker run --dns 8.8.8.8 nginx

# 测试 DNS 解析
docker exec container_name nslookup google.com

# 检查网络连接
docker exec container_name ping 8.8.8.8
```

## 性能问题

### 1. CPU 使用率

```bash
# 监控 CPU 使用
docker stats container_name

# 限制 CPU 使用
docker run --cpus=0.5 nginx

# 检查 CPU 配置
docker inspect container_name | grep -i cpu

# 分析 CPU 使用
docker exec container_name top
```

### 2. 内存使用

```bash
# 监控内存使用
docker stats container_name

# 限制内存使用
docker run --memory=512m nginx

# 检查内存配置
docker inspect container_name | grep -i memory

# 分析内存使用
docker exec container_name free -m
```

### 3. 磁盘 I/O

```bash
# 监控磁盘 I/O
docker stats container_name

# 检查磁盘使用
docker system df

# 分析 I/O 性能
docker exec container_name iostat

# 检查文件系统
docker exec container_name df -h
```

## 常见错误

### 1. 权限错误

```bash
# 错误：Permission denied
# 解决方案：
docker run --user 1000:1000 image_name

# 错误：Cannot connect to the Docker daemon
# 解决方案：
sudo usermod -aG docker $USER
sudo systemctl restart docker

# 错误：Access denied
# 解决方案：
docker login
```

### 2. 网络错误

```bash
# 错误：Connection refused
# 解决方案：
docker network inspect bridge
docker network connect bridge container_name

# 错误：No route to host
# 解决方案：
docker network prune
docker network create new_network

# 错误：DNS resolution failed
# 解决方案：
docker run --dns 8.8.8.8 image_name
```

### 3. 存储错误

```bash
# 错误：No space left on device
# 解决方案：
docker system prune -a
docker volume prune

# 错误：Invalid volume specification
# 解决方案：
docker volume create volume_name
docker run -v volume_name:/data image_name

# 错误：Mount denied
# 解决方案：
docker run --privileged image_name
```

## 调试工具

### 1. 日志分析

```bash
# 查看容器日志
docker logs container_name

# 实时查看日志
docker logs -f container_name

# 查看最后 N 行日志
docker logs --tail 100 container_name

# 查看特定时间段的日志
docker logs --since 2023-01-01T00:00:00 container_name
```

### 2. 性能分析

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

### 3. 网络分析

```bash
# 使用 tcpdump
docker run --net=host -v /var/run/docker.sock:/var/run/docker.sock nicolaka/netshoot tcpdump -i any

# 使用 netstat
docker run --net=host nicolaka/netshoot netstat -tulpn

# 使用 iperf
docker run -it --rm networkstatic/iperf3 -c iperf3-server
```

## 下一步

- 掌握 [性能优化](./performance.md)
- 学习 [安全实践](./security.md)
- 了解 [CI/CD 集成](./cicd.md)
