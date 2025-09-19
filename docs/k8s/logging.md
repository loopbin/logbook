# Kubernetes 日志管理详解

## 概述

Kubernetes 日志管理提供了集中化日志收集、存储、分析和可视化功能，帮助运维人员快速定位和解决问题。

## 日志架构

### 1. 日志收集组件

- **Fluentd**：日志收集和转发
- **Fluent Bit**：轻量级日志收集
- **Filebeat**：文件日志收集
- **Logstash**：日志处理和转换

### 2. 日志存储组件

- **Elasticsearch**：日志存储和搜索
- **Loki**：轻量级日志聚合
- **ClickHouse**：高性能日志存储

## Fluentd 配置

### 1. Fluentd 部署

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluentd-config
  namespace: logging
data:
  fluent.conf: |
    <source>
      @type tail
      path /var/log/containers/*.log
      pos_file /var/log/fluentd-containers.log.pos
      tag kubernetes.*
      format json
      time_key time
      time_format %Y-%m-%dT%H:%M:%S.%NZ
    </source>

    <filter kubernetes.**>
      @type kubernetes_metadata
    </filter>

    <match kubernetes.**>
      @type elasticsearch
      host elasticsearch
      port 9200
      index_name kubernetes
      type_name _doc
    </match>
---
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd
  namespace: logging
spec:
  selector:
    matchLabels:
      app: fluentd
  template:
    metadata:
      labels:
        app: fluentd
    spec:
      containers:
        - name: fluentd
          image: fluent/fluentd-kubernetes-daemonset:v1-debian-elasticsearch
          env:
            - name: FLUENT_ELASTICSEARCH_HOST
              value: "elasticsearch"
            - name: FLUENT_ELASTICSEARCH_PORT
              value: "9200"
            - name: FLUENT_ELASTICSEARCH_SCHEME
              value: "http"
          volumeMounts:
            - name: varlog
              mountPath: /var/log
            - name: varlibdockercontainers
              mountPath: /var/lib/docker/containers
              readOnly: true
            - name: fluentd-config
              mountPath: /fluentd/etc
      volumes:
        - name: varlog
          hostPath:
            path: /var/log
        - name: varlibdockercontainers
          hostPath:
            path: /var/lib/docker/containers
        - name: fluentd-config
          configMap:
            name: fluentd-config
```

## Elasticsearch 配置

### 1. Elasticsearch 部署

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: elasticsearch
  namespace: logging
spec:
  serviceName: elasticsearch
  replicas: 3
  selector:
    matchLabels:
      app: elasticsearch
  template:
    metadata:
      labels:
        app: elasticsearch
    spec:
      containers:
        - name: elasticsearch
          image: docker.elastic.co/elasticsearch/elasticsearch:7.17.0
          ports:
            - containerPort: 9200
            - containerPort: 9300
          env:
            - name: cluster.name
              value: "kubernetes-logs"
            - name: node.name
              valueFrom:
                fieldRef:
                  fieldPath: metadata.name
            - name: discovery.seed_hosts
              value: "elasticsearch-0.elasticsearch,elasticsearch-1.elasticsearch,elasticsearch-2.elasticsearch"
            - name: cluster.initial_master_nodes
              value: "elasticsearch-0,elasticsearch-1,elasticsearch-2"
            - name: ES_JAVA_OPTS
              value: "-Xms512m -Xmx512m"
          volumeMounts:
            - name: elasticsearch-storage
              mountPath: /usr/share/elasticsearch/data
          resources:
            requests:
              memory: "1Gi"
              cpu: "500m"
            limits:
              memory: "2Gi"
              cpu: "1000m"
  volumeClaimTemplates:
    - metadata:
        name: elasticsearch-storage
      spec:
        accessModes:
          - ReadWriteOnce
        storageClassName: fast-ssd
        resources:
          requests:
            storage: 10Gi
```

### 2. Elasticsearch 服务

```yaml
apiVersion: v1
kind: Service
metadata:
  name: elasticsearch
  namespace: logging
spec:
  selector:
    app: elasticsearch
  ports:
    - port: 9200
      targetPort: 9200
    - port: 9300
      targetPort: 9300
  clusterIP: None
```

## Kibana 配置

### 1. Kibana 部署

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kibana
  namespace: logging
spec:
  replicas: 1
  selector:
    matchLabels:
      app: kibana
  template:
    metadata:
      labels:
        app: kibana
    spec:
      containers:
        - name: kibana
          image: docker.elastic.co/kibana/kibana:7.17.0
          ports:
            - containerPort: 5601
          env:
            - name: ELASTICSEARCH_HOSTS
              value: "http://elasticsearch:9200"
          resources:
            requests:
              memory: "512Mi"
              cpu: "250m"
            limits:
              memory: "1Gi"
              cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: kibana
  namespace: logging
spec:
  selector:
    app: kibana
  ports:
    - port: 5601
      targetPort: 5601
  type: LoadBalancer
```

## 应用日志配置

### 1. 结构化日志

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: my-app
          image: my-app:latest
          ports:
            - containerPort: 8080
          env:
            - name: LOG_LEVEL
              value: "info"
            - name: LOG_FORMAT
              value: "json"
          volumeMounts:
            - name: log-config
              mountPath: /app/config
      volumes:
        - name: log-config
          configMap:
            name: log-config
```

### 2. 日志配置

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: log-config
data:
  logback.xml: |
    <configuration>
      <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="net.logstash.logback.encoder.LogstashEncoder">
          <includeContext>true</includeContext>
          <includeMdc>true</includeMdc>
          <customFields>{"service":"my-app","version":"1.0.0"}</customFields>
        </encoder>
      </appender>
      <root level="INFO">
        <appender-ref ref="STDOUT" />
      </root>
    </configuration>
```

## 日志分析

### 1. 日志查询

```bash
# 查看所有日志
kubectl logs -l app=my-app

# 查看特定 Pod 日志
kubectl logs my-pod

# 查看日志并跟随
kubectl logs -f my-pod

# 查看最近的日志
kubectl logs --tail=100 my-pod

# 查看指定时间范围的日志
kubectl logs --since=1h my-pod
```

### 2. 日志过滤

```bash
# 过滤错误日志
kubectl logs my-pod | grep ERROR

# 过滤特定时间
kubectl logs --since=2023-01-01T00:00:00Z my-pod

# 过滤特定容器
kubectl logs -c my-container my-pod
```

## 常用命令

### 查看日志状态

```bash
# 查看 Fluentd Pod
kubectl get pods -n logging -l app=fluentd

# 查看 Elasticsearch Pod
kubectl get pods -n logging -l app=elasticsearch

# 查看 Kibana Pod
kubectl get pods -n logging -l app=kibana

# 查看日志服务
kubectl get services -n logging
```

### 访问日志界面

```bash
# 端口转发到 Kibana
kubectl port-forward -n logging svc/kibana 5601:5601

# 端口转发到 Elasticsearch
kubectl port-forward -n logging svc/elasticsearch 9200:9200

# 访问 Kibana
open http://localhost:5601

# 访问 Elasticsearch
open http://localhost:9200
```

### 调试日志

```bash
# 查看 Fluentd 日志
kubectl logs -n logging -l app=fluentd

# 查看 Elasticsearch 日志
kubectl logs -n logging -l app=elasticsearch

# 查看 Kibana 日志
kubectl logs -n logging -l app=kibana

# 测试日志收集
kubectl exec -it my-pod -- echo "Test log message"
```

## 最佳实践

1. **日志格式**：使用结构化日志格式
2. **日志级别**：合理设置日志级别
3. **日志轮转**：配置日志轮转策略
4. **存储管理**：合理配置日志存储
5. **监控告警**：监控日志收集状态
6. **安全配置**：保护敏感日志信息
7. **性能优化**：优化日志收集性能
