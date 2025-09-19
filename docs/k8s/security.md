# Kubernetes 安全配置详解

## 概述

Kubernetes 安全配置涵盖了集群安全、Pod 安全、网络安全、存储安全等多个方面，确保集群和应用的全面安全。

## Pod 安全策略

### 1. Pod 安全上下文

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secure-pod
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    runAsGroup: 1000
    fsGroup: 1000
    seccompProfile:
      type: RuntimeDefault
  containers:
    - name: secure-container
      image: nginx:1.20
      securityContext:
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        runAsNonRoot: true
        runAsUser: 1000
        capabilities:
          drop:
            - ALL
      volumeMounts:
        - name: tmp
          mountPath: /tmp
        - name: var-run
          mountPath: /var/run
  volumes:
    - name: tmp
      emptyDir: {}
    - name: var-run
      emptyDir: {}
```

### 2. Pod 安全策略

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: restricted-psp
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

## 网络安全

### 1. 网络策略

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: secure-network-policy
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
    - to: []
      ports:
        - protocol: TCP
          port: 53
        - protocol: UDP
          port: 53
```

### 2. 服务网格安全

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

## 存储安全

### 1. 存储加密

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: encrypted-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: encrypted-storage
  csi:
    driver: ebs.csi.aws.com
    volumeHandle: vol-1234567890abcdef0
    fsType: ext4
    volumeAttributes:
      encrypted: "true"
      kmsKeyId: "arn:aws:kms:us-west-2:123456789012:key/12345678-1234-1234-1234-123456789012"
```

### 2. 存储访问控制

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secure-storage-pod
spec:
  securityContext:
    fsGroup: 1000
    runAsUser: 1000
    runAsGroup: 1000
  containers:
    - name: secure-container
      image: nginx:1.20
      securityContext:
        runAsUser: 1000
        runAsGroup: 1000
      volumeMounts:
        - name: secure-storage
          mountPath: /data
  volumes:
    - name: secure-storage
      persistentVolumeClaim:
        claimName: secure-pvc
```

## 镜像安全

### 1. 镜像扫描

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: image-scanner
spec:
  containers:
    - name: scanner
      image: aquasec/trivy:latest
      command: ["trivy", "image", "nginx:1.20"]
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        capabilities:
          drop:
            - ALL
```

### 2. 镜像签名验证

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: signed-image-pod
  annotations:
    cosign.sigstore.dev/verify: "true"
spec:
  containers:
    - name: signed-container
      image: nginx:1.20@sha256:abc123...
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        capabilities:
          drop:
            - ALL
```

## 密钥管理

### 1. 外部密钥管理

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: external-secret
  annotations:
    kubernetes.io/service-account.name: my-service-account
type: kubernetes.io/service-account-token
---
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

## 审计日志

### 1. 审计策略

```yaml
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
  - level: Metadata
    namespaces: ["kube-system"]
    resources:
      - group: ""
        resources: ["secrets", "configmaps"]
  - level: Request
    resources:
      - group: ""
        resources: ["pods"]
    verbs: ["create", "update", "patch", "delete"]
  - level: RequestResponse
    resources:
      - group: ""
        resources: ["pods/log"]
    verbs: ["get", "list"]
  - level: None
    users: ["system:serviceaccount:kube-system:event-exporter"]
    verbs: ["get", "list", "watch"]
```

### 2. 审计日志配置

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: audit-policy
  namespace: kube-system
data:
  audit-policy.yaml: |
    apiVersion: audit.k8s.io/v1
    kind: Policy
    rules:
    - level: Metadata
      namespaces: ["kube-system"]
      resources:
      - group: ""
        resources: ["secrets", "configmaps"]
    - level: Request
      resources:
      - group: ""
        resources: ["pods"]
      verbs: ["create", "update", "patch", "delete"]
    - level: RequestResponse
      resources:
      - group: ""
        resources: ["pods/log"]
      verbs: ["get", "list"]
    - level: None
      users: ["system:serviceaccount:kube-system:event-exporter"]
      verbs: ["get", "list", "watch"]
```

## 常用命令

### 查看安全配置

```bash
# 查看 Pod 安全上下文
kubectl get pods -o jsonpath='{.items[*].spec.securityContext}'

# 查看网络策略
kubectl get networkpolicies

# 查看 Pod 安全策略
kubectl get psp

# 查看 RBAC 配置
kubectl get roles,rolebindings,clusterroles,clusterrolebindings
```

### 安全测试

```bash
# 测试网络连接
kubectl exec -it my-pod -- curl my-service:80

# 测试权限
kubectl auth can-i get pods --as=system:serviceaccount:default:my-service-account

# 测试安全策略
kubectl run test-pod --image=busybox --rm -it --restart=Never -- sh
```

### 调试安全

```bash
# 查看安全事件
kubectl get events --field-selector reason=FailedCreate

# 查看审计日志
kubectl logs -n kube-system -l app=audit

# 查看安全扫描结果
kubectl logs -l app=security-scanner
```

## 最佳实践

1. **最小权限原则**：只授予必要的权限
2. **深度防御**：多层安全防护
3. **定期更新**：及时更新安全补丁
4. **监控审计**：持续监控和审计
5. **安全培训**：培训团队安全最佳实践
6. **文档管理**：维护安全配置文档
7. **应急响应**：建立安全事件响应流程
