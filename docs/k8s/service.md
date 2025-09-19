# Service 配置详解

## 概述

Service 是 Kubernetes 中用于暴露应用程序服务的抽象层。它提供稳定的网络端点，实现服务发现和负载均衡，使 Pod 之间能够相互通信。

## Service 类型

### 1. ClusterIP

**集群内部访问（默认类型）**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: ClusterIP
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```

### 2. NodePort

**节点端口访问**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: NodePort
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
      nodePort: 30080
```

### 3. LoadBalancer

**云负载均衡器**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: LoadBalancer
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  loadBalancerIP: 192.168.1.100
```

### 4. ExternalName

**外部服务映射**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: ExternalName
  externalName: mydatabase.example.com
  ports:
    - protocol: TCP
      port: 5432
```

## 创建 Service

### 1. 基础 Service 配置

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
  namespace: default
  labels:
    app: my-app
    version: v1.0.0
spec:
  selector:
    app: my-app
    tier: frontend
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 8080
    - name: https
      protocol: TCP
      port: 443
      targetPort: 8443
  type: ClusterIP
```

### 2. 多端口 Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    - name: web
      protocol: TCP
      port: 80
      targetPort: 8080
    - name: api
      protocol: TCP
      port: 8080
      targetPort: 9090
    - name: metrics
      protocol: TCP
      port: 9090
      targetPort: 9090
```

### 3. 无选择器 Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
---
apiVersion: v1
kind: Endpoints
metadata:
  name: my-service
subsets:
  - addresses:
      - ip: 192.168.1.100
      - ip: 192.168.1.101
    ports:
      - port: 8080
```

## 高级配置

### 1. 会话亲和性

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
  sessionAffinity: ClientIP
  sessionAffinityConfig:
    clientIP:
      timeoutSeconds: 3600
```

### 2. 外部流量策略

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: LoadBalancer
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  externalTrafficPolicy: Local
  healthCheckNodePort: 30000
```

### 3. 服务发现配置

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
    service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"
spec:
  type: LoadBalancer
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```

## 服务发现

### 1. DNS 服务发现

```yaml
# 同命名空间内访问
my-service.default.svc.cluster.local

# 跨命名空间访问
my-service.other-namespace.svc.cluster.local

# 简化形式（同命名空间）
my-service
```

### 2. 环境变量服务发现

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
        - name: MY_SERVICE_HOST
          value: "my-service"
        - name: MY_SERVICE_PORT
          value: "80"
```

### 3. 服务网格集成

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
  annotations:
    istio.io/ingress: "true"
    istio.io/ingress-gateway: "istio-system/istio-gateway"
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```

## 负载均衡

### 1. 默认负载均衡

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
  # 默认使用轮询算法
```

### 2. 自定义负载均衡

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-algorithm: "least_connections"
spec:
  type: LoadBalancer
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```

## 健康检查

### 1. 就绪性探针

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
---
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
          readinessProbe:
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 10
```

### 2. 存活性探针

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
          livenessProbe:
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 30
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3
```

## 网络策略

### 1. 服务间通信策略

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: my-service-policy
spec:
  podSelector:
    matchLabels:
      app: my-app
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: allowed-namespace
        - podSelector:
            matchLabels:
              app: frontend
      ports:
        - protocol: TCP
          port: 8080
  egress:
    - to:
        - podSelector:
            matchLabels:
              app: database
      ports:
        - protocol: TCP
          port: 5432
```

### 2. 服务网格策略

```yaml
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: my-service-policy
spec:
  selector:
    matchLabels:
      app: my-app
  rules:
    - from:
        - source:
            principals: ["cluster.local/ns/default/sa/frontend"]
      to:
        - operation:
            methods: ["GET", "POST"]
            paths: ["/api/*"]
```

## 监控和日志

### 1. 服务监控

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
  labels:
    app: my-app
    monitoring: "true"
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "9090"
    prometheus.io/path: "/metrics"
spec:
  selector:
    app: my-app
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 8080
    - name: metrics
      protocol: TCP
      port: 9090
      targetPort: 9090
```

### 2. 服务日志

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
  annotations:
    logging.io/level: "info"
    logging.io/format: "json"
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```

## 常用命令

### 查看 Service

```bash
# 列出所有 Service
kubectl get services

# 查看特定 Service
kubectl get service my-service

# 查看 Service 详情
kubectl describe service my-service

# 查看 Service 端点
kubectl get endpoints my-service
```

### 测试 Service

```bash
# 测试 Service 连接
kubectl run test-pod --image=busybox --rm -it --restart=Never -- wget -O- my-service:80

# 查看 Service DNS 解析
kubectl run test-pod --image=busybox --rm -it --restart=Never -- nslookup my-service

# 测试负载均衡
kubectl run test-pod --image=busybox --rm -it --restart=Never -- sh -c "for i in $(seq 1 10); do wget -O- my-service:80; done"
```

### 调试 Service

```bash
# 查看 Service 日志
kubectl logs -l app=my-app

# 查看 Service 事件
kubectl get events --field-selector involvedObject.name=my-service

# 查看 Service 配置
kubectl get service my-service -o yaml
```

## 最佳实践

1. **命名规范**：使用有意义的 Service 名称
2. **标签管理**：使用一致的标签策略
3. **端口管理**：为不同服务使用不同的端口
4. **健康检查**：配置适当的探针
5. **负载均衡**：根据需求选择合适的负载均衡策略
6. **网络策略**：实施适当的网络隔离
7. **监控告警**：建立完善的监控体系
8. **服务发现**：使用 DNS 进行服务发现
9. **安全配置**：实施适当的安全策略
10. **资源管理**：合理配置资源限制
