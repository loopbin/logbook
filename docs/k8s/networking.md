# Kubernetes 网络配置详解

## 概述

Kubernetes 网络模型提供了 Pod 间通信、服务发现、负载均衡等功能。理解网络配置对于构建可靠的容器化应用至关重要。

## 网络模型

### 1. Pod 网络

每个 Pod 都有唯一的 IP 地址，Pod 内的容器共享网络命名空间。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
    - name: container1
      image: nginx:1.20
      ports:
        - containerPort: 80
    - name: container2
      image: busybox
      command: ["sh", "-c", "while true; do sleep 30; done"]
```

### 2. Service 网络

Service 提供稳定的网络端点，实现负载均衡和服务发现。

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

## 网络策略

### 1. 基础网络策略

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: my-network-policy
  namespace: default
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

### 2. 拒绝所有流量

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
spec:
  podSelector: {}
  policyTypes:
    - Ingress
    - Egress
```

### 3. 允许特定流量

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-specific
spec:
  podSelector:
    matchLabels:
      app: my-app
  policyTypes:
    - Ingress
  ingress:
    - from:
        - ipBlock:
            cidr: 192.168.1.0/24
      ports:
        - protocol: TCP
          port: 80
```

## DNS 配置

### 1. CoreDNS 配置

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns
  namespace: kube-system
data:
  Corefile: |
    .:53 {
        errors
        health {
            lameduck 5s
        }
        ready
        kubernetes cluster.local in-addr.arpa ip6.arpa {
            pods insecure
            fallthrough in-addr.arpa ip6.arpa
            ttl 30
        }
        prometheus :9153
        forward . /etc/resolv.conf {
            max_concurrent 1000
        }
        cache 30
        loop
        reload
        loadbalance
    }
```

### 2. 自定义 DNS 配置

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: dns-test
spec:
  containers:
    - name: dns-test
      image: busybox
      command: ["sh", "-c", "nslookup kubernetes.default"]
  dnsPolicy: "None"
  dnsConfig:
    nameservers:
      - 8.8.8.8
      - 8.8.4.4
    searches:
      - default.svc.cluster.local
      - svc.cluster.local
      - cluster.local
    options:
      - name: ndots
        value: "2"
      - name: edns0
```

## 负载均衡

### 1. 服务负载均衡

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
  type: LoadBalancer
  sessionAffinity: ClientIP
  sessionAffinityConfig:
    clientIP:
      timeoutSeconds: 3600
```

### 2. Ingress 负载均衡

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
  annotations:
    nginx.ingress.kubernetes.io/load-balance: "round_robin"
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

## 服务网格

### 1. Istio 配置

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: my-virtual-service
spec:
  hosts:
    - myapp.example.com
  http:
    - match:
        - uri:
            prefix: /api
      route:
        - destination:
            host: api-service
            port:
              number: 80
    - match:
        - uri:
            prefix: /
      route:
        - destination:
            host: frontend-service
            port:
              number: 80
```

### 2. 流量管理

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: my-destination-rule
spec:
  host: my-service
  trafficPolicy:
    loadBalancer:
      simple: ROUND_ROBIN
    connectionPool:
      tcp:
        maxConnections: 10
      http:
        http1MaxPendingRequests: 10
        maxRequestsPerConnection: 2
    circuitBreaker:
      consecutiveErrors: 3
      interval: 30s
      baseEjectionTime: 30s
```

## 网络安全

### 1. TLS 配置

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: tls-secret
type: kubernetes.io/tls
data:
  tls.crt: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0t...
  tls.key: LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0t...
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: tls-ingress
spec:
  tls:
    - hosts:
        - myapp.example.com
      secretName: tls-secret
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

### 2. 网络隔离

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: network-isolation
spec:
  podSelector:
    matchLabels:
      app: sensitive-app
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: trusted-namespace
        - podSelector:
            matchLabels:
              app: trusted-app
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

## 常用命令

### 查看网络配置

```bash
# 查看网络策略
kubectl get networkpolicies

# 查看服务
kubectl get services

# 查看 Ingress
kubectl get ingress

# 查看 Pod 网络
kubectl get pods -o wide
```

### 测试网络连接

```bash
# 测试 Pod 间通信
kubectl exec -it pod1 -- ping pod2-ip

# 测试服务连接
kubectl exec -it pod1 -- curl my-service:80

# 测试 DNS 解析
kubectl exec -it pod1 -- nslookup my-service
```

### 调试网络问题

```bash
# 查看网络策略详情
kubectl describe networkpolicy my-network-policy

# 查看服务端点
kubectl get endpoints my-service

# 查看 Pod 网络配置
kubectl exec -it pod1 -- ip addr show
```

## 最佳实践

1. **网络策略**：实施适当的网络隔离
2. **服务发现**：使用 DNS 进行服务发现
3. **负载均衡**：配置合适的负载均衡策略
4. **安全配置**：启用 TLS 和网络加密
5. **监控告警**：监控网络性能和连接状态
6. **故障排除**：建立网络故障排除流程
7. **文档管理**：维护网络配置文档
