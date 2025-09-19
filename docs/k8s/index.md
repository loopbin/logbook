# Kubernetes 学习指南

## 概述

Kubernetes (K8s) 是一个开源的容器编排平台，用于自动化容器化应用程序的部署、扩展和管理。本指南将详细介绍 Kubernetes 的各种配置和最佳实践。

## 目录

### 基础概念

- [Kubernetes 基础](./basics.md) - 核心概念和架构
- [集群配置](./cluster-config.md) - 集群设置和初始化

### 配置管理

- [ConfigMap 配置](./configmap.md) - 非敏感配置数据管理
- [Secret 配置](./secret.md) - 敏感数据管理
- [Service 配置](./service.md) - 服务发现和负载均衡
- [Ingress 配置](./ingress.md) - HTTP/HTTPS 路由配置

### 部署和编排

- [Deployment 配置](./deployment.md) - 应用部署和更新
- [StatefulSet 配置](./statefulset.md) - 有状态应用部署
- [DaemonSet 配置](./daemonset.md) - 节点级应用部署
- [Job 和 CronJob](./job-cronjob.md) - 批处理任务配置

### 网络配置

- [网络基础](./networking.md) - 网络模型和配置
- [Service Mesh](./service-mesh.md) - 服务网格配置

### 存储配置

- [存储卷配置](./storage.md) - 持久化存储管理
- [存储类配置](./storage-class.md) - 动态存储配置

### 安全配置

- [RBAC 权限控制](./rbac.md) - 基于角色的访问控制
- [安全策略](./security.md) - Pod 安全策略和网络策略
- [证书管理](./certificates.md) - TLS 证书配置

### 监控和日志

- [监控配置](./monitoring.md) - 监控和指标收集
- [日志管理](./logging.md) - 日志收集和分析

### 高级配置

- [自定义资源](./custom-resources.md) - CRD 和 Operator
- [Helm 包管理](./helm.md) - 应用包管理
- [多集群管理](./multi-cluster.md) - 多集群配置

## 快速开始

### 1. 安装 kubectl

```bash
# macOS
brew install kubectl

# 验证安装
kubectl version --client
```

### 2. 配置集群访问

```bash
# 查看集群信息
kubectl cluster-info

# 查看节点状态
kubectl get nodes
```

### 3. 基本操作

```bash
# 查看所有资源
kubectl get all

# 查看命名空间
kubectl get namespaces

# 创建命名空间
kubectl create namespace my-app
```

## 最佳实践

1. **资源命名规范**：使用有意义的名称和标签
2. **资源限制**：为所有容器设置 CPU 和内存限制
3. **健康检查**：配置就绪性和存活性探针
4. **安全配置**：使用最小权限原则
5. **监控告警**：建立完善的监控体系

## 常用命令

```bash
# 查看资源
kubectl get <resource> -n <namespace>

# 描述资源
kubectl describe <resource> <name> -n <namespace>

# 编辑资源
kubectl edit <resource> <name> -n <namespace>

# 删除资源
kubectl delete <resource> <name> -n <namespace>

# 应用配置
kubectl apply -f <config-file>

# 查看日志
kubectl logs <pod-name> -n <namespace>

# 进入容器
kubectl exec -it <pod-name> -n <namespace> -- /bin/bash
```

## 相关资源

- [Kubernetes 官方文档](https://kubernetes.io/docs/)
- [Kubernetes API 参考](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/)
- [Kubernetes 最佳实践](https://kubernetes.io/docs/concepts/configuration/overview/)
