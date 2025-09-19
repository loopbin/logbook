# StorageClass 配置详解

## 概述

StorageClass 是 Kubernetes 中用于定义存储类别的资源，支持动态存储卷创建、存储参数配置和存储策略管理。

## 基础 StorageClass 配置

### 1. 本地存储类

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: local-storage
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
reclaimPolicy: Delete
allowVolumeExpansion: true
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
  kmsKeyId: "arn:aws:kms:us-west-2:123456789012:key/12345678-1234-1234-1234-123456789012"
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
  mountPermissions: "0755"
reclaimPolicy: Retain
allowVolumeExpansion: true
volumeBindingMode: Immediate
```

## 高级配置

### 1. 多区域存储类

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: aws-ebs-multi-az
provisioner: ebs.csi.aws.com
parameters:
  type: gp3
  iops: "3000"
  throughput: "125"
  encrypted: "true"
  fsType: ext4
  allowAutoIOPSPerGBIncrease: "true"
reclaimPolicy: Delete
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer
allowedTopologies:
  - matchLabelExpressions:
      - key: topology.ebs.csi.aws.com/zone
        values:
          - us-west-2a
          - us-west-2b
          - us-west-2c
```

### 2. 高性能存储类

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: high-performance
provisioner: ebs.csi.aws.com
parameters:
  type: io2
  iops: "16000"
  throughput: "1000"
  encrypted: "true"
  fsType: xfs
  allowAutoIOPSPerGBIncrease: "true"
reclaimPolicy: Delete
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer
```

### 3. 成本优化存储类

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: cost-optimized
provisioner: ebs.csi.aws.com
parameters:
  type: sc1
  encrypted: "true"
  fsType: ext4
reclaimPolicy: Delete
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer
```

## 存储参数配置

### 1. AWS EBS 参数

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: aws-ebs-detailed
provisioner: ebs.csi.aws.com
parameters:
  # 存储类型
  type: gp3

  # IOPS 配置
  iops: "3000"
  allowAutoIOPSPerGBIncrease: "true"

  # 吞吐量配置
  throughput: "125"

  # 加密配置
  encrypted: "true"
  kmsKeyId: "arn:aws:kms:us-west-2:123456789012:key/12345678-1234-1234-1234-123456789012"

  # 文件系统配置
  fsType: ext4

  # 其他配置
  allowAutoIOPSPerGBIncrease: "true"
  allowAutoIOPSIncrease: "true"
reclaimPolicy: Delete
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer
```

### 2. Azure Disk 参数

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: azure-disk
provisioner: disk.csi.azure.com
parameters:
  # 存储类型
  skuName: Premium_LRS

  # 缓存配置
  cachingMode: ReadOnly

  # 加密配置
  encryptionType: EncryptionAtRestWithPlatformKey

  # 其他配置
  resourceGroup: myResourceGroup
  location: eastus
reclaimPolicy: Delete
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer
```

### 3. GCP Persistent Disk 参数

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: gcp-pd
provisioner: pd.csi.storage.gke.io
parameters:
  # 存储类型
  type: pd-ssd

  # 区域配置
  replication-type: regional-pd

  # 加密配置
  disk-encryption-kms-key: projects/my-project/locations/us-central1/keyRings/my-key-ring/cryptoKeys/my-key

  # 其他配置
  fsType: ext4
reclaimPolicy: Delete
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer
```

## 存储策略配置

### 1. 备份策略

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: backup-enabled
  annotations:
    backup.kubernetes.io/enabled: "true"
    backup.kubernetes.io/schedule: "0 2 * * *"
    backup.kubernetes.io/retention: "30d"
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

### 2. 监控策略

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: monitored-storage
  annotations:
    monitoring.kubernetes.io/enabled: "true"
    monitoring.kubernetes.io/metrics: "iops,throughput,latency"
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

### 3. 安全策略

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: secure-storage
  annotations:
    security.kubernetes.io/enabled: "true"
    security.kubernetes.io/encryption: "required"
    security.kubernetes.io/access-control: "strict"
provisioner: ebs.csi.aws.com
parameters:
  type: gp3
  iops: "3000"
  throughput: "125"
  encrypted: "true"
  kmsKeyId: "arn:aws:kms:us-west-2:123456789012:key/12345678-1234-1234-1234-123456789012"
reclaimPolicy: Delete
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer
```

## 常用命令

### 查看 StorageClass

```bash
# 列出所有存储类
kubectl get storageclass

# 查看特定存储类
kubectl get storageclass aws-ebs

# 查看存储类详情
kubectl describe storageclass aws-ebs

# 查看存储类配置
kubectl get storageclass aws-ebs -o yaml
```

### 管理 StorageClass

```bash
# 创建存储类
kubectl create -f storageclass.yaml

# 应用配置
kubectl apply -f storageclass.yaml

# 删除存储类
kubectl delete storageclass aws-ebs

# 编辑存储类
kubectl edit storageclass aws-ebs
```

### 测试 StorageClass

```bash
# 创建测试 PVC
kubectl create -f test-pvc.yaml

# 查看 PVC 状态
kubectl get pvc test-pvc

# 查看 PVC 详情
kubectl describe pvc test-pvc

# 删除测试 PVC
kubectl delete pvc test-pvc
```

## 最佳实践

1. **存储选择**：根据需求选择合适的存储类型
2. **参数配置**：合理配置存储参数
3. **成本优化**：平衡性能和成本
4. **安全配置**：启用存储加密
5. **监控告警**：监控存储使用情况
6. **备份策略**：建立完善的备份策略
7. **文档管理**：维护存储配置文档
