# Service Mesh 配置详解

## 概述

Service Mesh 是处理服务间通信的基础设施层，提供流量管理、安全、可观测性等功能。Istio 是最流行的 Service Mesh 实现。

## Istio 安装

### 1. 安装 Istio

```bash
# 下载 Istio
curl -L https://istio.io/downloadIstio | sh -
cd istio-1.19.0

# 安装 Istio
istioctl install --set values.defaultRevision=default

# 启用 sidecar 注入
kubectl label namespace default istio-injection=enabled
```

### 2. 验证安装

```bash
# 查看 Istio 组件
kubectl get pods -n istio-system

# 查看 Istio 配置
istioctl version
```

## 流量管理

### 1. VirtualService 配置

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

### 2. DestinationRule 配置

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

### 3. 流量分割

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: my-virtual-service
spec:
  hosts:
    - myapp.example.com
  http:
    - route:
        - destination:
            host: my-service
            subset: v1
          weight: 90
        - destination:
            host: my-service
            subset: v2
          weight: 10
---
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: my-destination-rule
spec:
  host: my-service
  subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
```

## 安全配置

### 1. 认证策略

```yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: istio-system
spec:
  mtls:
    mode: STRICT
---
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: my-app-policy
spec:
  selector:
    matchLabels:
      app: my-app
  mtls:
    mode: PERMISSIVE
```

### 2. 授权策略

```yaml
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: my-app-policy
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

### 3. JWT 认证

```yaml
apiVersion: security.istio.io/v1beta1
kind: RequestAuthentication
metadata:
  name: jwt-auth
spec:
  selector:
    matchLabels:
      app: my-app
  jwtRules:
    - issuer: "https://auth.example.com"
      jwksUri: "https://auth.example.com/.well-known/jwks.json"
---
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: jwt-policy
spec:
  selector:
    matchLabels:
      app: my-app
  rules:
    - from:
        - source:
            requestPrincipals: ["*"]
      to:
        - operation:
            methods: ["GET", "POST"]
```

## 可观测性

### 1. 指标收集

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus
  namespace: istio-system
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
    scrape_configs:
    - job_name: 'istio-mesh'
      kubernetes_sd_configs:
      - role: endpoints
        namespaces:
          names:
          - istio-system
      relabel_configs:
      - source_labels: [__meta_kubernetes_service_name]
        action: keep
        regex: istio-mesh
```

### 2. 分布式追踪

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: jaeger
  namespace: istio-system
data:
  jaeger.yaml: |
    service:
      name: jaeger
    sampling:
      type: const
      param: 1
    reporter:
      logSpans: true
      localAgentHostPort: jaeger-agent:14268
```

### 3. 访问日志

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluentd
  namespace: istio-system
data:
  fluent.conf: |
    <source>
      @type tail
      path /var/log/istio-proxy.log
      pos_file /var/log/istio-proxy.log.pos
      tag istio-proxy
      format json
    </source>
    <match istio-proxy>
      @type elasticsearch
      host elasticsearch
      port 9200
      index_name istio-proxy
    </match>
```

## 故障注入

### 1. 延迟注入

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: my-virtual-service
spec:
  hosts:
    - myapp.example.com
  http:
    - fault:
        delay:
          percentage:
            value: 50
          fixedDelay: 5s
      route:
        - destination:
            host: my-service
            port:
              number: 80
```

### 2. 错误注入

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: my-virtual-service
spec:
  hosts:
    - myapp.example.com
  http:
    - fault:
        abort:
          percentage:
            value: 10
          httpStatus: 500
      route:
        - destination:
            host: my-service
            port:
              number: 80
```

## 常用命令

### 查看 Service Mesh 状态

```bash
# 查看 Istio 组件
kubectl get pods -n istio-system

# 查看 VirtualService
kubectl get virtualservices

# 查看 DestinationRule
kubectl get destinationrules

# 查看 Gateway
kubectl get gateways
```

### 调试 Service Mesh

```bash
# 查看 sidecar 配置
istioctl proxy-config cluster my-pod

# 查看路由配置
istioctl proxy-config route my-pod

# 查看监听器配置
istioctl proxy-config listener my-pod

# 查看端点配置
istioctl proxy-config endpoint my-pod
```

### 测试 Service Mesh

```bash
# 测试服务连接
kubectl exec -it my-pod -- curl my-service:80

# 查看访问日志
kubectl logs -l app=my-app -c istio-proxy

# 查看指标
kubectl exec -it my-pod -- curl localhost:15000/stats
```

## 最佳实践

1. **渐进式部署**：逐步启用 Service Mesh 功能
2. **监控告警**：建立完善的监控体系
3. **安全配置**：实施适当的安全策略
4. **性能优化**：优化 Service Mesh 性能
5. **故障排除**：建立故障排除流程
6. **文档管理**：维护 Service Mesh 配置文档
7. **团队培训**：培训团队使用 Service Mesh
