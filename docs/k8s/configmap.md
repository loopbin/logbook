# ConfigMap 配置详解

## 概述

ConfigMap 是 Kubernetes 中用于存储非敏感配置数据的 API 对象。它允许将配置数据与容器镜像分离，使应用程序更加可移植和可配置。

## 创建 ConfigMap

### 1. 从命令行创建

#### 从字面量创建

```bash
kubectl create configmap my-config \
  --from-literal=database_url=mysql://localhost:3306/mydb \
  --from-literal=debug=true \
  --from-literal=max_connections=100
```

#### 从文件创建

```bash
# 从单个文件创建
kubectl create configmap my-config --from-file=config.properties

# 从多个文件创建
kubectl create configmap my-config \
  --from-file=config.properties \
  --from-file=database.conf

# 从目录创建
kubectl create configmap my-config --from-file=configs/
```

#### 从环境文件创建

```bash
kubectl create configmap my-config --from-env-file=config.env
```

### 2. 从 YAML 文件创建

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-config
  namespace: default
data:
  # 键值对形式
  database_url: "mysql://localhost:3306/mydb"
  debug: "true"
  max_connections: "100"

  # 文件形式
  config.properties: |
    server.port=8080
    server.host=0.0.0.0
    database.url=mysql://localhost:3306/mydb
    database.username=admin
    database.password=password

  nginx.conf: |
    server {
        listen 80;
        server_name example.com;
        location / {
            proxy_pass http://backend;
        }
    }
```

## 使用 ConfigMap

### 1. 作为环境变量

#### 单个键值对

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
    - name: my-container
      image: nginx
      env:
        - name: DATABASE_URL
          valueFrom:
            configMapKeyRef:
              name: my-config
              key: database_url
```

#### 所有键值对

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
    - name: my-container
      image: nginx
      envFrom:
        - configMapRef:
            name: my-config
```

### 2. 作为卷挂载

#### 挂载整个 ConfigMap

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
    - name: my-container
      image: nginx
      volumeMounts:
        - name: config-volume
          mountPath: /etc/config
  volumes:
    - name: config-volume
      configMap:
        name: my-config
```

#### 挂载特定键

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
    - name: my-container
      image: nginx
      volumeMounts:
        - name: config-volume
          mountPath: /etc/nginx/nginx.conf
          subPath: nginx.conf
  volumes:
    - name: config-volume
      configMap:
        name: my-config
        items:
          - key: nginx.conf
            path: nginx.conf
```

### 3. 在 Deployment 中使用

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
          envFrom:
            - configMapRef:
                name: my-config
          volumeMounts:
            - name: config-volume
              mountPath: /app/config
      volumes:
        - name: config-volume
          configMap:
            name: my-config
```

## 高级配置

### 1. 不可变 ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-config
immutable: true
data:
  database_url: "mysql://localhost:3306/mydb"
  debug: "true"
```

### 2. 二进制数据

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-config
binaryData:
  binary-file: |
    R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7
```

### 3. 多级配置

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  # 应用配置
  app.properties: |
    app.name=MyApp
    app.version=1.0.0
    app.environment=production

  # 数据库配置
  database.properties: |
    database.url=mysql://localhost:3306/mydb
    database.username=admin
    database.pool.size=10

  # 日志配置
  logback.xml: |
    <configuration>
      <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
          <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
      </appender>
      <root level="INFO">
        <appender-ref ref="STDOUT" />
      </root>
    </configuration>
```

## 最佳实践

### 1. 命名规范

```yaml
# 使用有意义的名称
metadata:
  name: app-config
  # 或者
  name: database-config
  # 或者
  name: nginx-config
```

### 2. 标签管理

```yaml
metadata:
  name: my-config
  labels:
    app: my-app
    component: config
    environment: production
    version: v1.0.0
```

### 3. 配置分离

```yaml
# 环境相关配置
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config-dev
data:
  database_url: "mysql://dev-db:3306/mydb"
  debug: "true"

---
# 生产环境配置
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config-prod
data:
  database_url: "mysql://prod-db:3306/mydb"
  debug: "false"
```

### 4. 配置验证

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: config-validator
spec:
  containers:
    - name: validator
      image: busybox
      command: ["/bin/sh"]
      args:
        - -c
        - |
          echo "Validating configuration..."
          if [ -f /etc/config/app.properties ]; then
            echo "✓ app.properties found"
          else
            echo "✗ app.properties missing"
            exit 1
          fi
      volumeMounts:
        - name: config-volume
          mountPath: /etc/config
  volumes:
    - name: config-volume
      configMap:
        name: my-config
```

## 常用命令

### 查看 ConfigMap

```bash
# 列出所有 ConfigMap
kubectl get configmaps

# 查看特定 ConfigMap
kubectl get configmap my-config

# 查看 ConfigMap 详情
kubectl describe configmap my-config

# 查看 ConfigMap 内容
kubectl get configmap my-config -o yaml
```

### 编辑 ConfigMap

```bash
# 编辑 ConfigMap
kubectl edit configmap my-config

# 删除 ConfigMap
kubectl delete configmap my-config
```

### 调试 ConfigMap

```bash
# 查看 Pod 中的环境变量
kubectl exec my-pod -- env | grep -E "(DATABASE|DEBUG)"

# 查看挂载的文件
kubectl exec my-pod -- ls -la /etc/config/

# 查看文件内容
kubectl exec my-pod -- cat /etc/config/app.properties
```

## 注意事项

1. **大小限制**：ConfigMap 大小不能超过 1MB
2. **字符编码**：确保文件使用 UTF-8 编码
3. **权限管理**：ConfigMap 中的数据对所有用户可见
4. **热更新**：ConfigMap 更新后，需要重启 Pod 才能生效
5. **敏感数据**：不要将敏感信息存储在 ConfigMap 中，使用 Secret
6. **版本管理**：使用标签管理不同版本的配置
7. **备份恢复**：定期备份重要的 ConfigMap 配置
