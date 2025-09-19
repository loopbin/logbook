# Ingress 配置详解

## 概述

Ingress 是 Kubernetes 中用于管理外部访问集群内服务的 API 对象，提供 HTTP 和 HTTPS 路由、负载均衡、SSL 终止等功能。

## Ingress 控制器

### 1. Nginx Ingress Controller

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-configuration
  namespace: ingress-nginx
data:
  use-gzip: "true"
  gzip-level: "6"
  proxy-body-size: "10m"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-ingress-controller
  namespace: ingress-nginx
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx-ingress-controller
  template:
    metadata:
      labels:
        app: nginx-ingress-controller
    spec:
      containers:
        - name: nginx-ingress-controller
          image: nginx/nginx-ingress:2.4.0
          ports:
            - containerPort: 80
            - containerPort: 443
          env:
            - name: POD_NAMESPACE
              valueFrom:
                fieldRef:
                  fieldPath: metadata.namespace
          volumeMounts:
            - name: nginx-config
              mountPath: /etc/nginx/conf.d
      volumes:
        - name: nginx-config
          configMap:
            name: nginx-configuration
```

### 2. Traefik Ingress Controller

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: traefik-ingress-controller
  namespace: ingress-traefik
spec:
  replicas: 2
  selector:
    matchLabels:
      app: traefik-ingress-controller
  template:
    metadata:
      labels:
        app: traefik-ingress-controller
    spec:
      containers:
        - name: traefik
          image: traefik:v2.9
          ports:
            - containerPort: 80
            - containerPort: 443
            - containerPort: 8080
          args:
            - --api.dashboard=true
            - --api.insecure=true
            - --providers.kubernetesingress=true
            - --entrypoints.web.address=:80
            - --entrypoints.websecure.address=:443
```

## 基础 Ingress 配置

### 1. 简单 HTTP 路由

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
  namespace: default
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

### 2. 多路径路由

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
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 80
          - path: /admin
            pathType: Prefix
            backend:
              service:
                name: admin-service
                port:
                  number: 80
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-service
                port:
                  number: 80
```

### 3. 多主机路由

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
spec:
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 80
    - host: admin.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: admin-service
                port:
                  number: 80
    - host: www.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-service
                port:
                  number: 80
```

## HTTPS 配置

### 1. TLS 证书配置

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: tls-secret
  namespace: default
type: kubernetes.io/tls
data:
  tls.crt: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0t...
  tls.key: LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0t...
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
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

### 2. Let's Encrypt 自动证书

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
    - hosts:
        - myapp.example.com
      secretName: myapp-tls
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

## 高级配置

### 1. 重写规则

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$2
spec:
  rules:
    - host: myapp.example.com
      http:
        paths:
          - path: /api(/|$)(.*)
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 80
```

### 2. 速率限制

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
  annotations:
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
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

### 3. 认证配置

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
  annotations:
    nginx.ingress.kubernetes.io/auth-type: basic
    nginx.ingress.kubernetes.io/auth-secret: basic-auth
    nginx.ingress.kubernetes.io/auth-realm: "Authentication Required"
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

## 常用命令

### 查看 Ingress

```bash
# 列出所有 Ingress
kubectl get ingress

# 查看特定 Ingress
kubectl get ingress my-ingress

# 查看 Ingress 详情
kubectl describe ingress my-ingress
```

### 测试 Ingress

```bash
# 测试 Ingress 路由
curl -H "Host: myapp.example.com" http://ingress-ip/

# 测试 HTTPS
curl -k https://myapp.example.com/

# 查看 Ingress 控制器日志
kubectl logs -n ingress-nginx -l app=nginx-ingress-controller
```

## 最佳实践

1. **路径设计**：使用清晰的路径结构
2. **SSL 配置**：启用 HTTPS 和重定向
3. **监控告警**：监控 Ingress 状态和性能
4. **安全配置**：实施适当的认证和授权
5. **负载均衡**：配置合适的负载均衡策略
6. **缓存配置**：合理配置缓存策略
7. **日志管理**：启用访问日志和错误日志
