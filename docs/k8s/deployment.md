# Deployment 配置详解

## 概述

Deployment 是 Kubernetes 中用于管理无状态应用的核心资源，提供声明式更新、滚动升级、回滚等功能。

## 基础 Deployment 配置

### 1. 简单 Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  namespace: default
  labels:
    app: my-app
    version: v1.0.0
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
        version: v1.0.0
    spec:
      containers:
        - name: my-app
          image: nginx:1.20
          ports:
            - containerPort: 80
          resources:
            requests:
              memory: "64Mi"
              cpu: "250m"
            limits:
              memory: "128Mi"
              cpu: "500m"
```

### 2. 多容器 Deployment

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
        - name: web
          image: nginx:1.20
          ports:
            - containerPort: 80
          volumeMounts:
            - name: nginx-config
              mountPath: /etc/nginx/conf.d
        - name: sidecar
          image: busybox
          command:
            [
              "sh",
              "-c",
              'while true; do echo "Sidecar running"; sleep 30; done',
            ]
      volumes:
        - name: nginx-config
          configMap:
            name: nginx-config
```

## 高级配置

### 1. 滚动更新策略

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 5
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 2
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
          image: nginx:1.20
          ports:
            - containerPort: 80
```

### 2. 健康检查配置

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
          image: nginx:1.20
          ports:
            - containerPort: 80
          livenessProbe:
            httpGet:
              path: /health
              port: 80
            initialDelaySeconds: 30
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /ready
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 5
            timeoutSeconds: 3
            failureThreshold: 3
```

### 3. 环境变量和配置

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
          image: nginx:1.20
          ports:
            - containerPort: 80
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: my-secret
                  key: database-url
            - name: DEBUG
              valueFrom:
                configMapKeyRef:
                  name: my-config
                  key: debug
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

## 更新和回滚

### 1. 更新 Deployment

```bash
# 更新镜像
kubectl set image deployment/my-app my-app=nginx:1.21

# 更新环境变量
kubectl set env deployment/my-app DEBUG=true

# 更新副本数
kubectl scale deployment/my-app --replicas=5

# 查看更新状态
kubectl rollout status deployment/my-app
```

### 2. 回滚 Deployment

```bash
# 查看历史版本
kubectl rollout history deployment/my-app

# 回滚到上一个版本
kubectl rollout undo deployment/my-app

# 回滚到指定版本
kubectl rollout undo deployment/my-app --to-revision=2

# 暂停更新
kubectl rollout pause deployment/my-app

# 恢复更新
kubectl rollout resume deployment/my-app
```

## 常用命令

### 查看 Deployment

```bash
# 列出所有 Deployment
kubectl get deployments

# 查看特定 Deployment
kubectl get deployment my-app

# 查看 Deployment 详情
kubectl describe deployment my-app

# 查看 Deployment 状态
kubectl rollout status deployment/my-app
```

### 管理 Deployment

```bash
# 创建 Deployment
kubectl create -f deployment.yaml

# 应用配置
kubectl apply -f deployment.yaml

# 删除 Deployment
kubectl delete deployment my-app

# 编辑 Deployment
kubectl edit deployment my-app
```

## 最佳实践

1. **资源限制**：为所有容器设置资源限制
2. **健康检查**：配置存活性探针和就绪性探针
3. **滚动更新**：使用适当的更新策略
4. **标签管理**：使用一致的标签策略
5. **监控告警**：建立完善的监控体系
6. **配置管理**：使用 ConfigMap 和 Secret
7. **安全配置**：实施适当的安全策略
