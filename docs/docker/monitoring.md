# Docker 监控和日志

## 容器监控

### 基本监控命令

```bash
# 查看容器资源使用情况
docker stats

# 查看特定容器状态
docker stats container_name

# 查看容器详细信息
docker inspect container_name
```

### 资源限制

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
```

## 日志管理

### 容器日志

```bash
# 查看容器日志
docker logs container_name

# 实时查看日志
docker logs -f container_name

# 查看最后 100 行日志
docker logs --tail 100 container_name

# 查看特定时间段的日志
docker logs --since 2024-01-01T00:00:00 container_name
```

### 日志驱动

```bash
# 使用 JSON 文件驱动
docker run -d --name web \
  --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  nginx

# 使用 syslog 驱动
docker run -d --name web \
  --log-driver syslog \
  --log-opt syslog-address=udp://localhost:514 \
  nginx
```

## 监控工具

### 1. Prometheus + Grafana

```yaml
# docker-compose.yml
version: "3.8"

services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    depends_on:
      - prometheus
    ports:
      - "3000:3000"
    volumes:
      - grafana-data:/var/lib/grafana

volumes:
  grafana-data:
```

### 2. cAdvisor

```yaml
# docker-compose.yml
version: "3.8"

services:
  cadvisor:
    image: gcr.io/cadvisor/cadvisor
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
    ports:
      - "8080:8080"
```

### 3. Node Exporter

```yaml
# docker-compose.yml
version: "3.8"

services:
  node-exporter:
    image: prom/node-exporter
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - "--path.procfs=/host/proc"
      - "--path.sysfs=/host/sys"
      - "--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)"
    ports:
      - "9100:9100"
```

## 日志收集

### 1. ELK Stack

```yaml
# docker-compose.yml
version: "3.8"

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.9.3
    environment:
      - discovery.type=single-node
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch-data:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:7.9.3
    volumes:
      - ./logstash/config:/usr/share/logstash/config
    ports:
      - "5044:5044"
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:7.9.3
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch

volumes:
  elasticsearch-data:
```

### 2. Fluentd

```yaml
# docker-compose.yml
version: "3.8"

services:
  fluentd:
    image: fluent/fluentd
    volumes:
      - ./fluentd/conf:/fluentd/etc
    ports:
      - "24224:24224"
      - "24224:24224/udp"
```

## 告警系统

### 1. Alertmanager

```yaml
# docker-compose.yml
version: "3.8"

services:
  alertmanager:
    image: prom/alertmanager
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml
    ports:
      - "9093:9093"
```

### 2. 告警规则

```yaml
# prometheus/rules/alert.yml
groups:
  - name: docker
    rules:
      - alert: HighCPUUsage
        expr: container_cpu_usage_seconds_total > 0.8
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: High CPU usage
          description: Container {{ $labels.container_name }} has high CPU usage

      - alert: HighMemoryUsage
        expr: container_memory_usage_bytes > 1e9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: High memory usage
          description: Container {{ $labels.container_name }} has high memory usage
```

## 性能优化

### 1. 资源监控

```bash
# 查看容器资源使用情况
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"

# 查看容器 CPU 使用率
docker stats --format "{{.CPUPerc}}" container_name

# 查看容器内存使用率
docker stats --format "{{.MemPerc}}" container_name
```

### 2. 性能分析

```bash
# 使用 cAdvisor 分析
curl http://localhost:8080/api/v1.3/docker/

# 使用 Prometheus 查询
curl -G http://localhost:9090/api/v1/query --data-urlencode 'query=container_cpu_usage_seconds_total'
```

## 最佳实践

### 1. 日志轮转

```bash
# 配置日志轮转
docker run -d --name web \
  --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  nginx
```

### 2. 监控指标

```yaml
# prometheus.yml
scrape_configs:
  - job_name: "docker"
    static_configs:
      - targets: ["cadvisor:8080"]
    metrics_path: /metrics
```

### 3. 告警阈值

```yaml
# alertmanager.yml
route:
  group_by: ["alertname"]
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 1h
  receiver: "web.hook"
receivers:
  - name: "web.hook"
    webhook_configs:
      - url: "http://127.0.0.1:5001/"
```

## 常见问题

### 1. 日志文件过大

```bash
# 清理日志文件
docker system prune -f

# 限制日志大小
docker run -d --name web \
  --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  nginx
```

### 2. 监控数据存储

```yaml
# prometheus.yml
storage:
  tsdb:
    retention:
      time: 15d
      size: 512MB
```

### 3. 告警通知

```yaml
# alertmanager.yml
receivers:
  - name: "email"
    email_configs:
      - to: "admin@example.com"
        from: "alertmanager@example.com"
        smarthost: "smtp.example.com:587"
        auth_username: "alertmanager"
        auth_password: "password"
```

## 下一步

- 学习 [安全实践](./security.md)
- 了解 [CI/CD 集成](./cicd.md)
- 掌握 [故障排查](./troubleshooting.md)
