# DaemonSet 配置详解

## 概述

DaemonSet 是 Kubernetes 中用于在集群中每个节点上运行一个 Pod 副本的工作负载资源，常用于日志收集、监控、网络代理等场景。

## 基础 DaemonSet 配置

### 1. 简单 DaemonSet

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd
  namespace: kube-system
  labels:
    app: fluentd
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
          image: fluent/fluentd:latest
          ports:
            - containerPort: 24224
          volumeMounts:
            - name: varlog
              mountPath: /var/log
            - name: varlibdockercontainers
              mountPath: /var/lib/docker/containers
              readOnly: true
      volumes:
        - name: varlog
          hostPath:
            path: /var/log
        - name: varlibdockercontainers
          hostPath:
            path: /var/lib/docker/containers
```

### 2. 带节点选择器的 DaemonSet

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: nginx-proxy
spec:
  selector:
    matchLabels:
      name: nginx-proxy
  template:
    metadata:
      labels:
        name: nginx-proxy
    spec:
      nodeSelector:
        node-role.kubernetes.io/ingress: "true"
      containers:
        - name: nginx-proxy
          image: nginx:1.20
          ports:
            - containerPort: 80
            - containerPort: 443
```

## 高级配置

### 1. 更新策略

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: my-daemonset
spec:
  selector:
    matchLabels:
      name: my-daemonset
  updateStrategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
  template:
    metadata:
      labels:
        name: my-daemonset
    spec:
      containers:
        - name: my-app
          image: nginx:1.20
          ports:
            - containerPort: 80
```

### 2. 容忍度和污点

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: my-daemonset
spec:
  selector:
    matchLabels:
      name: my-daemonset
  template:
    metadata:
      labels:
        name: my-daemonset
    spec:
      tolerations:
        - key: node-role.kubernetes.io/master
          operator: Exists
          effect: NoSchedule
        - key: node-role.kubernetes.io/control-plane
          operator: Exists
          effect: NoSchedule
      containers:
        - name: my-app
          image: nginx:1.20
          ports:
            - containerPort: 80
```

### 3. 资源限制和请求

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: my-daemonset
spec:
  selector:
    matchLabels:
      name: my-daemonset
  template:
    metadata:
      labels:
        name: my-daemonset
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

## 存储配置

### 1. 主机路径挂载

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: log-collector
spec:
  selector:
    matchLabels:
      name: log-collector
  template:
    metadata:
      labels:
        name: log-collector
    spec:
      containers:
        - name: log-collector
          image: fluent/fluentd:latest
          volumeMounts:
            - name: varlog
              mountPath: /var/log
            - name: varlibdockercontainers
              mountPath: /var/lib/docker/containers
              readOnly: true
            - name: varlibkubelet
              mountPath: /var/lib/kubelet
              readOnly: true
      volumes:
        - name: varlog
          hostPath:
            path: /var/log
        - name: varlibdockercontainers
          hostPath:
            path: /var/lib/docker/containers
        - name: varlibkubelet
          hostPath:
            path: /var/lib/kubelet
```

### 2. 配置映射挂载

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: my-daemonset
spec:
  selector:
    matchLabels:
      name: my-daemonset
  template:
    metadata:
      labels:
        name: my-daemonset
    spec:
      containers:
        - name: my-app
          image: nginx:1.20
          ports:
            - containerPort: 80
          volumeMounts:
            - name: config
              mountPath: /etc/nginx/conf.d
      volumes:
        - name: config
          configMap:
            name: nginx-config
```

## 网络配置

### 1. 主机网络

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: network-proxy
spec:
  selector:
    matchLabels:
      name: network-proxy
  template:
    metadata:
      labels:
        name: network-proxy
    spec:
      hostNetwork: true
      containers:
        - name: network-proxy
          image: nginx:1.20
          ports:
            - containerPort: 80
              hostPort: 80
```

### 2. 特权模式

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: system-monitor
spec:
  selector:
    matchLabels:
      name: system-monitor
  template:
    metadata:
      labels:
        name: system-monitor
    spec:
      hostNetwork: true
      hostPID: true
      containers:
        - name: system-monitor
          image: nginx:1.20
          securityContext:
            privileged: true
          ports:
            - containerPort: 80
```

## 常用命令

### 查看 DaemonSet

```bash
# 列出所有 DaemonSet
kubectl get daemonsets

# 查看特定 DaemonSet
kubectl get daemonset my-daemonset

# 查看 DaemonSet 详情
kubectl describe daemonset my-daemonset

# 查看 DaemonSet Pod
kubectl get pods -l name=my-daemonset
```

### 管理 DaemonSet

```bash
# 创建 DaemonSet
kubectl create -f daemonset.yaml

# 应用配置
kubectl apply -f daemonset.yaml

# 删除 DaemonSet
kubectl delete daemonset my-daemonset

# 编辑 DaemonSet
kubectl edit daemonset my-daemonset
```

### 调试 DaemonSet

```bash
# 查看 Pod 日志
kubectl logs -l name=my-daemonset

# 进入 Pod
kubectl exec -it my-daemonset-xxxxx -- /bin/bash

# 查看节点信息
kubectl get nodes -o wide
```

## 最佳实践

1. **节点选择**：使用节点选择器限制部署范围
2. **资源管理**：合理配置资源限制
3. **存储管理**：使用适当的存储卷
4. **网络配置**：根据需要配置网络模式
5. **监控告警**：监控 DaemonSet 状态
6. **安全配置**：实施适当的安全策略
7. **更新策略**：使用滚动更新策略
