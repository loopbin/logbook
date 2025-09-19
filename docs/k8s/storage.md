# Kubernetes 存储配置详解

## 概述

Kubernetes 存储系统提供了持久化存储解决方案，支持多种存储类型和访问模式，满足不同应用场景的需求。

## 存储卷类型

### 1. 临时存储卷

#### emptyDir

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
    - name: my-container
      image: nginx:1.20
      volumeMounts:
        - name: temp-storage
          mountPath: /tmp
  volumes:
    - name: temp-storage
      emptyDir:
        sizeLimit: 1Gi
```

#### hostPath

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
    - name: my-container
      image: nginx:1.20
      volumeMounts:
        - name: host-storage
          mountPath: /host-data
  volumes:
    - name: host-storage
      hostPath:
        path: /data
        type: DirectoryOrCreate
```

### 2. 持久化存储卷

#### PersistentVolume (PV)

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

### 3. 在 Pod 中使用存储

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
    - name: my-container
      image: nginx:1.20
      volumeMounts:
        - name: my-storage
          mountPath: /data
  volumes:
    - name: my-storage
      persistentVolumeClaim:
        claimName: my-pvc
```

## 存储类配置

### 1. 本地存储类

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: local-storage
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
```

### 2. 云存储类

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: aws-ebs
provisioner: ebs.csi.aws.com
parameters:
  type: gp3
  iops: "3000"
  throughput: "125"
  encrypted: "true"
reclaimPolicy: Delete
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer
```

### 3. NFS 存储类

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: nfs-storage
provisioner: nfs.csi.k8s.io
parameters:
  server: nfs-server.example.com
  share: /data
reclaimPolicy: Retain
allowVolumeExpansion: true
```

## 动态存储配置

### 1. 自动创建存储卷

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
          ports:
            - containerPort: 3306
          env:
            - name: MYSQL_ROOT_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: mysql-secret
                  key: root-password
          volumeMounts:
            - name: mysql-data
              mountPath: /var/lib/mysql
  volumeClaimTemplates:
    - metadata:
        name: mysql-data
      spec:
        accessModes:
          - ReadWriteOnce
        storageClassName: fast-ssd
        resources:
          requests:
            storage: 10Gi
```

### 2. 存储卷快照

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: mysql-snapshot
spec:
  source:
    persistentVolumeClaimName: mysql-data-mysql-0
  volumeSnapshotClassName: csi-snapshotter
---
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotClass
metadata:
  name: csi-snapshotter
driver: ebs.csi.aws.com
deletionPolicy: Delete
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
```

### 2. 存储访问控制

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  securityContext:
    fsGroup: 1000
    runAsUser: 1000
    runAsGroup: 1000
  containers:
    - name: my-container
      image: nginx:1.20
      securityContext:
        runAsUser: 1000
        runAsGroup: 1000
      volumeMounts:
        - name: my-storage
          mountPath: /data
  volumes:
    - name: my-storage
      persistentVolumeClaim:
        claimName: my-pvc
```

## 存储监控

### 1. 存储使用监控

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: storage-monitor
spec:
  containers:
    - name: storage-monitor
      image: busybox
      command: ["sh", "-c", "df -h /data && du -sh /data/*"]
      volumeMounts:
        - name: my-storage
          mountPath: /data
  volumes:
    - name: my-storage
      persistentVolumeClaim:
        claimName: my-pvc
```

### 2. 存储告警

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: storage-alerts
data:
  alerts.yml: |
    groups:
    - name: storage
      rules:
      - alert: StorageUsageHigh
        expr: (kubelet_volume_stats_used_bytes / kubelet_volume_stats_capacity_bytes) > 0.8
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Storage usage is high"
          description: "Storage usage is above 80%"
```

## 常用命令

### 查看存储配置

```bash
# 查看存储类
kubectl get storageclass

# 查看持久化存储卷
kubectl get pv

# 查看存储卷声明
kubectl get pvc

# 查看存储卷详情
kubectl describe pv my-pv
```

### 管理存储

```bash
# 创建存储类
kubectl create -f storageclass.yaml

# 创建持久化存储卷
kubectl create -f pv.yaml

# 创建存储卷声明
kubectl create -f pvc.yaml

# 删除存储卷
kubectl delete pv my-pv
```

### 调试存储

```bash
# 查看存储卷挂载
kubectl exec -it my-pod -- df -h

# 查看存储卷信息
kubectl exec -it my-pod -- ls -la /data

# 查看存储卷事件
kubectl get events --field-selector involvedObject.name=my-pvc
```

## 最佳实践

1. **存储选择**：根据需求选择合适的存储类型
2. **容量规划**：合理规划存储容量
3. **备份策略**：建立完善的备份策略
4. **监控告警**：监控存储使用情况
5. **安全配置**：实施存储加密和访问控制
6. **性能优化**：优化存储性能
7. **故障排除**：建立存储故障排除流程
