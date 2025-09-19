# Secret 配置详解

## 概述

Secret 是 Kubernetes 中用于存储敏感数据的 API 对象，如密码、令牌、密钥等。Secret 数据以 base64 编码存储，并提供访问控制机制。

## Secret 类型

### 1. Opaque

**通用 Secret 类型**

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: my-secret
type: Opaque
data:
  username: YWRtaW4= # admin (base64)
  password: cGFzc3dvcmQ= # password (base64)
```

### 2. kubernetes.io/service-account-token

**服务账户令牌**

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: my-service-account-token
  annotations:
    kubernetes.io/service-account.name: my-service-account
type: kubernetes.io/service-account-token
```

### 3. kubernetes.io/dockercfg

**Docker 配置**

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: my-docker-secret
type: kubernetes.io/dockercfg
data:
  .dockercfg: eyJhdXRocyI6eyJodHRwczovL2luZGV4LmRvY2tlci5pby92MS8iOnsidXNlcm5hbWUiOiJteXVzZXIiLCJwYXNzd29yZCI6Im15cGFzc3dvcmQiLCJhdXRoIjoiWVd4cFpHRjBZV1J2YldGcGJpMWpiMjUwWlc1MGN5MWpiMjUwIn19fQ==
```

### 4. kubernetes.io/tls

**TLS 证书**

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: my-tls-secret
type: kubernetes.io/tls
data:
  tls.crt: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0t...
  tls.key: LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0t...
```

## 创建 Secret

### 1. 从命令行创建

#### 从字面量创建

```bash
kubectl create secret generic my-secret \
  --from-literal=username=admin \
  --from-literal=password=password123
```

#### 从文件创建

```bash
# 从单个文件创建
kubectl create secret generic my-secret --from-file=username.txt

# 从多个文件创建
kubectl create secret generic my-secret \
  --from-file=username.txt \
  --from-file=password.txt

# 从目录创建
kubectl create secret generic my-secret --from-file=secrets/
```

#### 创建 Docker 配置 Secret

```bash
kubectl create secret docker-registry my-docker-secret \
  --docker-server=registry.example.com \
  --docker-username=myuser \
  --docker-password=mypassword \
  --docker-email=myuser@example.com
```

#### 创建 TLS Secret

```bash
kubectl create secret tls my-tls-secret \
  --cert=path/to/cert.crt \
  --key=path/to/cert.key
```

### 2. 从 YAML 文件创建

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: my-secret
  namespace: default
type: Opaque
data:
  username: YWRtaW4= # admin
  password: cGFzc3dvcmQxMjM= # password123
  database_url: bXlzcWw6Ly9hZG1pbjpwYXNzd29yZDEyM0Bsb2NhbGhvc3Q6MzMwNi9teWRi # mysql://admin:password123@localhost:3306/mydb
```

## 使用 Secret

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
        - name: DB_USERNAME
          valueFrom:
            secretKeyRef:
              name: my-secret
              key: username
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: my-secret
              key: password
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
        - secretRef:
            name: my-secret
```

### 2. 作为卷挂载

#### 挂载整个 Secret

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
        - name: secret-volume
          mountPath: /etc/secrets
          readOnly: true
  volumes:
    - name: secret-volume
      secret:
        secretName: my-secret
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
        - name: secret-volume
          mountPath: /etc/ssl/certs/tls.crt
          subPath: tls.crt
  volumes:
    - name: secret-volume
      secret:
        secretName: my-tls-secret
        items:
          - key: tls.crt
            path: tls.crt
            mode: 0644
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
            - secretRef:
                name: my-secret
          volumeMounts:
            - name: secret-volume
              mountPath: /app/secrets
              readOnly: true
      volumes:
        - name: secret-volume
          secret:
            secretName: my-secret
```

## 高级配置

### 1. 不可变 Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: my-secret
immutable: true
type: Opaque
data:
  username: YWRtaW4=
  password: cGFzc3dvcmQxMjM=
```

### 2. 自动生成 Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: my-secret
  annotations:
    kubernetes.io/service-account.name: my-service-account
type: kubernetes.io/service-account-token
```

### 3. 外部 Secret 管理

#### 使用 External Secrets Operator

```yaml
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: vault-backend
spec:
  provider:
    vault:
      server: "https://vault.example.com"
      path: "secret"
      version: "v2"
      auth:
        kubernetes:
          mountPath: "kubernetes"
          role: "my-role"
---
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: my-external-secret
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: vault-backend
    kind: SecretStore
  target:
    name: my-secret
    creationPolicy: Owner
  data:
    - secretKey: username
      remoteRef:
        key: database
        property: username
    - secretKey: password
      remoteRef:
        key: database
        property: password
```

## 安全最佳实践

### 1. 访问控制

```yaml
# 创建 ServiceAccount
apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-service-account
---
# 创建 Role
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: secret-reader
rules:
  - apiGroups: [""]
    resources: ["secrets"]
    verbs: ["get", "list"]
---
# 创建 RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: secret-reader-binding
subjects:
  - kind: ServiceAccount
    name: my-service-account
roleRef:
  kind: Role
  name: secret-reader
  apiGroup: rbac.authorization.k8s.io
```

### 2. 网络策略

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: secret-access-policy
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
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              name: allowed-namespace
```

### 3. Pod 安全策略

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: secret-access-psp
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - "configMap"
    - "emptyDir"
    - "projected"
    - "secret"
    - "downwardAPI"
    - "persistentVolumeClaim"
  runAsUser:
    rule: "MustRunAsNonRoot"
  seLinux:
    rule: "RunAsAny"
  fsGroup:
    rule: "RunAsAny"
```

## 常用命令

### 查看 Secret

```bash
# 列出所有 Secret
kubectl get secrets

# 查看特定 Secret
kubectl get secret my-secret

# 查看 Secret 详情
kubectl describe secret my-secret

# 查看 Secret 内容（base64 编码）
kubectl get secret my-secret -o yaml
```

### 解码 Secret

```bash
# 解码特定键
kubectl get secret my-secret -o jsonpath='{.data.username}' | base64 -d

# 解码所有键
kubectl get secret my-secret -o json | jq -r '.data | to_entries[] | "\(.key): \(.value | @base64d)"'
```

### 编辑 Secret

```bash
# 编辑 Secret
kubectl edit secret my-secret

# 删除 Secret
kubectl delete secret my-secret
```

### 调试 Secret

```bash
# 查看 Pod 中的环境变量
kubectl exec my-pod -- env | grep -E "(DB_|USER|PASS)"

# 查看挂载的文件
kubectl exec my-pod -- ls -la /etc/secrets/

# 查看文件内容
kubectl exec my-pod -- cat /etc/secrets/username
```

## 注意事项

1. **编码方式**：Secret 数据以 base64 编码存储，不是加密
2. **大小限制**：单个 Secret 大小不能超过 1MB
3. **权限管理**：确保只有必要的 Pod 能访问 Secret
4. **轮换策略**：定期轮换 Secret 中的敏感数据
5. **审计日志**：启用 Secret 访问的审计日志
6. **备份恢复**：定期备份重要的 Secret
7. **外部管理**：考虑使用外部 Secret 管理系统
8. **网络加密**：确保 Secret 在传输过程中的加密
