# RBAC 权限控制详解

## 概述

RBAC (Role-Based Access Control) 是 Kubernetes 中基于角色的访问控制机制，通过定义角色和角色绑定来管理用户和服务的权限。

## 核心概念

### 1. 主体 (Subject)

- **User**：用户
- **Group**：用户组
- **ServiceAccount**：服务账户

### 2. 角色 (Role)

- **Role**：命名空间级别的角色
- **ClusterRole**：集群级别的角色

### 3. 绑定 (Binding)

- **RoleBinding**：角色绑定
- **ClusterRoleBinding**：集群角色绑定

## 基础 RBAC 配置

### 1. 创建 ServiceAccount

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-service-account
  namespace: default
```

### 2. 创建 Role

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "watch", "list"]
  - apiGroups: [""]
    resources: ["pods/log"]
    verbs: ["get"]
```

### 3. 创建 RoleBinding

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
  - kind: ServiceAccount
    name: my-service-account
    namespace: default
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

## 集群级别权限

### 1. 创建 ClusterRole

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cluster-admin
rules:
  - apiGroups: [""]
    resources: ["*"]
    verbs: ["*"]
  - apiGroups: ["apps"]
    resources: ["*"]
    verbs: ["*"]
  - apiGroups: ["extensions"]
    resources: ["*"]
    verbs: ["*"]
```

### 2. 创建 ClusterRoleBinding

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: cluster-admin-binding
subjects:
  - kind: User
    name: admin
    apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: cluster-admin
  apiGroup: rbac.authorization.k8s.io
```

## 高级权限配置

### 1. 资源名称权限

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: specific-pod-reader
rules:
  - apiGroups: [""]
    resources: ["pods"]
    resourceNames: ["my-pod"]
    verbs: ["get", "watch", "list"]
```

### 2. 子资源权限

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-logs-reader
rules:
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "list"]
  - apiGroups: [""]
    resources: ["pods/log"]
    verbs: ["get"]
```

### 3. 非资源 URL 权限

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: health-checker
rules:
  - nonResourceURLs: ["/healthz", "/healthz/*"]
    verbs: ["get"]
```

## 常用角色模板

### 1. 只读角色

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: read-only
rules:
  - apiGroups: [""]
    resources: ["*"]
    verbs: ["get", "list", "watch"]
  - apiGroups: ["apps"]
    resources: ["*"]
    verbs: ["get", "list", "watch"]
  - apiGroups: ["extensions"]
    resources: ["*"]
    verbs: ["get", "list", "watch"]
```

### 2. 开发角色

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: developer
rules:
  - apiGroups: [""]
    resources: ["pods", "services", "configmaps", "secrets"]
    verbs: ["*"]
  - apiGroups: ["apps"]
    resources: ["deployments", "replicasets"]
    verbs: ["*"]
  - apiGroups: ["extensions"]
    resources: ["ingresses"]
    verbs: ["*"]
```

### 3. 运维角色

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: operator
rules:
  - apiGroups: [""]
    resources: ["*"]
    verbs: ["*"]
  - apiGroups: ["apps"]
    resources: ["*"]
    verbs: ["*"]
  - apiGroups: ["extensions"]
    resources: ["*"]
    verbs: ["*"]
  - apiGroups: ["rbac.authorization.k8s.io"]
    resources: ["*"]
    verbs: ["*"]
```

## 权限验证

### 1. 检查权限

```bash
# 检查用户权限
kubectl auth can-i get pods --as=system:serviceaccount:default:my-service-account

# 检查特定命名空间权限
kubectl auth can-i get pods -n kube-system --as=system:serviceaccount:default:my-service-account

# 检查集群权限
kubectl auth can-i create deployments --as=system:serviceaccount:default:my-service-account
```

### 2. 查看权限

```bash
# 查看用户权限
kubectl auth whoami

# 查看 ServiceAccount 权限
kubectl auth whoami --as=system:serviceaccount:default:my-service-account

# 查看所有权限
kubectl auth can-i --list --as=system:serviceaccount:default:my-service-account
```

## 常用命令

### 查看 RBAC 配置

```bash
# 查看 ServiceAccount
kubectl get serviceaccounts

# 查看 Role
kubectl get roles

# 查看 ClusterRole
kubectl get clusterroles

# 查看 RoleBinding
kubectl get rolebindings

# 查看 ClusterRoleBinding
kubectl get clusterrolebindings
```

### 管理 RBAC

```bash
# 创建 ServiceAccount
kubectl create serviceaccount my-service-account

# 创建 Role
kubectl create role pod-reader --verb=get,list,watch --resource=pods

# 创建 ClusterRole
kubectl create clusterrole cluster-reader --verb=get,list,watch --resource=pods

# 创建 RoleBinding
kubectl create rolebinding read-pods --role=pod-reader --serviceaccount=default:my-service-account

# 创建 ClusterRoleBinding
kubectl create clusterrolebinding read-pods --clusterrole=cluster-reader --serviceaccount=default:my-service-account
```

### 调试 RBAC

```bash
# 查看 Role 详情
kubectl describe role pod-reader

# 查看 ClusterRole 详情
kubectl describe clusterrole cluster-reader

# 查看 RoleBinding 详情
kubectl describe rolebinding read-pods

# 查看 ClusterRoleBinding 详情
kubectl describe clusterrolebinding read-pods
```

## 最佳实践

1. **最小权限原则**：只授予必要的权限
2. **角色分离**：不同功能使用不同角色
3. **定期审查**：定期审查和更新权限
4. **监控审计**：监控权限使用情况
5. **文档管理**：维护权限配置文档
6. **测试验证**：测试权限配置
7. **安全培训**：培训团队安全最佳实践
