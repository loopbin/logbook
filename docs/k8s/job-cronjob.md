# Job 和 CronJob 配置详解

## 概述

Job 和 CronJob 是 Kubernetes 中用于运行批处理任务的工作负载资源。Job 用于运行一次性任务，CronJob 用于运行定时任务。

## Job 配置

### 1. 简单 Job

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: my-job
  namespace: default
spec:
  template:
    spec:
      containers:
        - name: my-job
          image: busybox
          command: ["sh", "-c", "echo 'Hello World'"]
      restartPolicy: Never
  backoffLimit: 3
```

### 2. 并行 Job

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: parallel-job
spec:
  parallelism: 3
  completions: 6
  template:
    spec:
      containers:
        - name: worker
          image: busybox
          command: ["sh", "-c", "echo 'Processing item $ITEM'; sleep 10"]
          env:
            - name: ITEM
              valueFrom:
                fieldRef:
                  fieldPath: metadata.name
      restartPolicy: Never
  backoffLimit: 3
```

### 3. 索引 Job

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: indexed-job
spec:
  completions: 5
  parallelism: 3
  completionMode: Indexed
  template:
    spec:
      containers:
        - name: worker
          image: busybox
          command: ["sh", "-c", "echo 'Processing item $JOB_COMPLETION_INDEX'"]
          env:
            - name: JOB_COMPLETION_INDEX
              valueFrom:
                fieldRef:
                  fieldPath: metadata.annotations['batch.kubernetes.io/job-completion-index']
      restartPolicy: Never
  backoffLimit: 3
```

## CronJob 配置

### 1. 简单 CronJob

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: my-cronjob
spec:
  schedule: "0 2 * * *" # 每天凌晨2点执行
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: my-cronjob
              image: busybox
              command: ["sh", "-c", "echo 'Cron job executed at $(date)'"]
          restartPolicy: OnFailure
      backoffLimit: 3
```

### 2. 带时区的 CronJob

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: my-cronjob
spec:
  schedule: "0 2 * * *"
  timeZone: "Asia/Shanghai"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: my-cronjob
              image: busybox
              command: ["sh", "-c", "echo 'Cron job executed at $(date)'"]
          restartPolicy: OnFailure
      backoffLimit: 3
```

### 3. 并发策略 CronJob

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: my-cronjob
spec:
  schedule: "*/5 * * * *" # 每5分钟执行
  concurrencyPolicy: Forbid # 禁止并发执行
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 3
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: my-cronjob
              image: busybox
              command:
                ["sh", "-c", "echo 'Cron job executed at $(date)'; sleep 300"]
          restartPolicy: OnFailure
      backoffLimit: 3
```

## 高级配置

### 1. 资源限制 Job

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: resource-limited-job
spec:
  template:
    spec:
      containers:
        - name: worker
          image: nginx:1.20
          resources:
            requests:
              memory: "64Mi"
              cpu: "250m"
            limits:
              memory: "128Mi"
              cpu: "500m"
          command: ["sh", "-c", "echo 'Resource limited job'"]
      restartPolicy: Never
  backoffLimit: 3
```

### 2. 环境变量 Job

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: env-job
spec:
  template:
    spec:
      containers:
        - name: worker
          image: busybox
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: my-secret
                  key: database-url
            - name: DEBUG
              valueFrom:
                configMapKeyRef:
                  name: my-config
                  key: debug
          command: ["sh", "-c", "echo 'Database URL: $DATABASE_URL'"]
      restartPolicy: Never
  backoffLimit: 3
```

### 3. 卷挂载 Job

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: volume-job
spec:
  template:
    spec:
      containers:
        - name: worker
          image: busybox
          volumeMounts:
            - name: data-volume
              mountPath: /data
          command: ["sh", "-c", "echo 'Processing data' > /data/output.txt"]
      volumes:
        - name: data-volume
          emptyDir: {}
      restartPolicy: Never
  backoffLimit: 3
```

## 常用命令

### 查看 Job 和 CronJob

```bash
# 列出所有 Job
kubectl get jobs

# 列出所有 CronJob
kubectl get cronjobs

# 查看特定 Job
kubectl get job my-job

# 查看特定 CronJob
kubectl get cronjob my-cronjob

# 查看 Job 详情
kubectl describe job my-job

# 查看 CronJob 详情
kubectl describe cronjob my-cronjob
```

### 管理 Job 和 CronJob

```bash
# 创建 Job
kubectl create -f job.yaml

# 创建 CronJob
kubectl create -f cronjob.yaml

# 删除 Job
kubectl delete job my-job

# 删除 CronJob
kubectl delete cronjob my-cronjob

# 编辑 Job
kubectl edit job my-job

# 编辑 CronJob
kubectl edit cronjob my-cronjob
```

### 调试 Job 和 CronJob

```bash
# 查看 Job Pod
kubectl get pods -l job-name=my-job

# 查看 Job 日志
kubectl logs -l job-name=my-job

# 查看 CronJob 历史
kubectl get jobs -l cronjob=my-cronjob

# 手动触发 CronJob
kubectl create job --from=cronjob/my-cronjob manual-job
```

## 最佳实践

1. **资源管理**：合理配置资源限制
2. **重试策略**：设置适当的重试次数
3. **并发控制**：根据需求配置并发策略
4. **历史管理**：限制历史记录数量
5. **监控告警**：监控任务执行状态
6. **错误处理**：实施适当的错误处理策略
7. **安全配置**：使用适当的权限和配置
