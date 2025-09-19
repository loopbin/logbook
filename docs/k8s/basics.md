# Kubernetes 基础概念

## 概述

Kubernetes 是一个容器编排平台，提供了容器化应用程序的自动化部署、扩展和管理功能。理解其核心概念是掌握 Kubernetes 的关键。

## 核心组件

### 控制平面 (Control Plane)

#### API Server

- **作用**：Kubernetes 集群的前端接口
- **功能**：处理所有 API 请求，验证和转换数据
- **特点**：RESTful API，支持多种客户端

#### etcd

- **作用**：分布式键值存储
- **功能**：存储集群的所有配置数据和状态信息
- **特点**：高可用、强一致性

#### Scheduler

- **作用**：调度器
- **功能**：决定 Pod 在哪个节点上运行
- **特点**：基于资源需求和约束进行调度

#### Controller Manager

- **作用**：控制器管理器
- **功能**：运行各种控制器，维护集群状态
- **包含**：Node Controller、Replication Controller 等

### 工作节点 (Worker Nodes)

#### kubelet

- **作用**：节点代理
- **功能**：与 API Server 通信，管理 Pod 生命周期
- **特点**：每个节点运行一个实例

#### kube-proxy

- **作用**：网络代理
- **功能**：实现 Service 的网络规则
- **特点**：支持多种代理模式

#### Container Runtime

- **作用**：容器运行时
- **功能**：运行容器
- **支持**：Docker、containerd、CRI-O 等

## 核心概念

### Pod

**最小部署单元**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
  labels:
    app: my-app
spec:
  containers:
    - name: my-container
      image: nginx:1.20
      ports:
        - containerPort: 80
```

**特点**：

- 一个或多个容器的组合
- 共享网络和存储
- 临时性，可被替换

### Namespace

**资源隔离**

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: my-namespace
```

**默认命名空间**：

- `default`：默认命名空间
- `kube-system`：系统组件
- `kube-public`：公共资源
- `kube-node-lease`：节点心跳

### Label 和 Selector

**资源标识和选择**

```yaml
# 标签
metadata:
  labels:
    app: frontend
    tier: web
    version: v1.0

# 选择器
selector:
  matchLabels:
    app: frontend
  matchExpressions:
    - key: tier
      operator: In
      values: [web, api]
```

### Annotation

**元数据存储**

```yaml
metadata:
  annotations:
    description: "这是一个示例应用"
    contact: "admin@example.com"
    last-modified: "2023-01-01T00:00:00Z"
```

## 资源类型

### 工作负载资源

#### Deployment

**无状态应用部署**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:1.20
          ports:
            - containerPort: 80
```

#### StatefulSet

**有状态应用部署**

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
spec:
  serviceName: mysql
  replicas: 3
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
        - name: mysql
          image: mysql:8.0
          env:
            - name: MYSQL_ROOT_PASSWORD
              value: "password"
```

#### DaemonSet

**节点级应用部署**

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd
spec:
  selector:
    matchLabels:
      name: fluentd
  template:
    metadata:
      labels:
        name: fluentd
    spec:
      containers:
        - name: fluentd
          image: fluentd:latest
```

### 服务资源

#### Service

**服务发现和负载均衡**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  type: ClusterIP
```

**Service 类型**：

- `ClusterIP`：集群内部访问
- `NodePort`：节点端口访问
- `LoadBalancer`：云负载均衡器
- `ExternalName`：外部服务映射

#### Ingress

**HTTP/HTTPS 路由**

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
spec:
  rules:
    - host: myapp.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: my-service
                port:
                  number: 80
```

### 配置资源

#### ConfigMap

**非敏感配置数据**

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-config
data:
  database_url: "mysql://localhost:3306/mydb"
  debug: "true"
  config.yaml: |
    server:
      port: 8080
      host: 0.0.0.0
```

#### Secret

**敏感数据管理**

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: my-secret
type: Opaque
data:
  username: YWRtaW4= # base64 编码
  password: cGFzc3dvcmQ= # base64 编码
```

### 存储资源

#### PersistentVolume (PV)

**持久化存储卷**

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: my-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: fast-ssd
  hostPath:
    path: /data
```

#### PersistentVolumeClaim (PVC)

**存储卷声明**

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
  storageClassName: fast-ssd
```

## 资源管理

### 资源限制

```yaml
spec:
  containers:
    - name: my-container
      image: nginx
      resources:
        requests:
          memory: "64Mi"
          cpu: "250m"
        limits:
          memory: "128Mi"
          cpu: "500m"
```

### 健康检查

```yaml
spec:
  containers:
    - name: my-container
      image: nginx
      livenessProbe:
        httpGet:
          path: /health
          port: 8080
        initialDelaySeconds: 30
        periodSeconds: 10
      readinessProbe:
        httpGet:
          path: /ready
          port: 8080
        initialDelaySeconds: 5
        periodSeconds: 5
```

## 常用命令

### 基础操作

```bash
# 查看集群信息
kubectl cluster-info

# 查看节点
kubectl get nodes

# 查看所有资源
kubectl get all

# 查看特定资源
kubectl get pods
kubectl get services
kubectl get deployments
```

### 资源操作

```bash
# 创建资源
kubectl create -f config.yaml

# 应用配置
kubectl apply -f config.yaml

# 删除资源
kubectl delete -f config.yaml

# 编辑资源
kubectl edit pod my-pod
```

### 调试和监控

```bash
# 查看日志
kubectl logs my-pod

# 进入容器
kubectl exec -it my-pod -- /bin/bash

# 查看资源描述
kubectl describe pod my-pod

# 查看事件
kubectl get events
```

## 最佳实践

1. **资源命名**：使用有意义的名称和标签
2. **资源限制**：为所有容器设置资源限制
3. **健康检查**：配置存活性探针和就绪性探针
4. **标签管理**：使用一致的标签策略
5. **命名空间**：合理使用命名空间进行资源隔离
6. **配置管理**：使用 ConfigMap 和 Secret 管理配置
7. **存储管理**：合理使用持久化存储
8. **监控告警**：建立完善的监控体系
