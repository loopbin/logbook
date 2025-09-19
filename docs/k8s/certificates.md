# Kubernetes 证书管理详解

## 概述

Kubernetes 证书管理是集群安全的重要组成部分，包括集群证书、服务证书、用户证书等的生成、配置和更新。

## 证书类型

### 1. 集群证书

- **CA 证书**：集群根证书
- **API Server 证书**：API Server 服务证书
- **etcd 证书**：etcd 服务证书
- **kubelet 证书**：kubelet 服务证书

### 2. 服务证书

- **Service Account 证书**：服务账户证书
- **Ingress 证书**：Ingress TLS 证书
- **Service Mesh 证书**：服务网格证书

## 证书生成

### 1. 使用 kubeadm 生成证书

```bash
# 生成证书
kubeadm init phase certs all

# 查看证书
kubeadm certs check-expiration

# 更新证书
kubeadm certs renew all
```

### 2. 使用 cfssl 生成证书

```yaml
# ca-config.json
{
  "signing":
    {
      "default": { "expiry": "8760h" },
      "profiles":
        {
          "kubernetes":
            {
              "usages":
                ["signing", "key encipherment", "server auth", "client auth"],
              "expiry": "8760h",
            },
        },
    },
}
```

```yaml
# ca-csr.json
{
  "CN": "Kubernetes",
  "key": { "algo": "rsa", "size": 2048 },
  "names":
    [
      {
        "C": "US",
        "L": "Portland",
        "O": "Kubernetes",
        "OU": "CA",
        "ST": "Oregon",
      },
    ],
}
```

```bash
# 生成 CA 证书
cfssl gencert -initca ca-csr.json | cfssljson -bare ca

# 生成 API Server 证书
cfssl gencert -ca=ca.pem -ca-key=ca-key.pem -config=ca-config.json -profile=kubernetes apiserver-csr.json | cfssljson -bare apiserver
```

## 证书配置

### 1. API Server 证书配置

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kube-apiserver-config
  namespace: kube-system
data:
  apiserver.conf: |
    apiVersion: kubeadm.k8s.io/v1beta3
    kind: ClusterConfiguration
    kubernetesVersion: v1.28.0
    controlPlaneEndpoint: "k8s-api.example.com:6443"
    apiServer:
      certSANs:
      - "k8s-api.example.com"
      - "10.0.0.1"
      - "127.0.0.1"
      - "localhost"
      extraArgs:
        tls-cert-file: /etc/kubernetes/pki/apiserver.crt
        tls-private-key-file: /etc/kubernetes/pki/apiserver.key
        client-ca-file: /etc/kubernetes/pki/ca.crt
        etcd-cafile: /etc/kubernetes/pki/etcd/ca.crt
        etcd-certfile: /etc/kubernetes/pki/etcd/server.crt
        etcd-keyfile: /etc/kubernetes/pki/etcd/server.key
```

### 2. kubelet 证书配置

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kubelet-config
  namespace: kube-system
data:
  kubelet.conf: |
    apiVersion: kubelet.config.k8s.io/v1beta1
    kind: KubeletConfiguration
    authentication:
      x509:
        clientCAFile: /etc/kubernetes/pki/ca.crt
    authorization:
      mode: Webhook
    clusterDNS:
    - "10.96.0.10"
    clusterDomain: "cluster.local"
    serverTLSBootstrap: true
    rotateCertificates: true
    certificateDirectory: /var/lib/kubelet/pki
```

## 证书更新

### 1. 自动证书更新

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: cert-manager
  namespace: cert-manager
spec:
  selector:
    matchLabels:
      app: cert-manager
  template:
    metadata:
      labels:
        app: cert-manager
    spec:
      containers:
        - name: cert-manager
          image: quay.io/jetstack/cert-manager-controller:v1.13.0
          args:
            - --v=2
            - --cluster-resource-namespace=$(POD_NAMESPACE)
            - --leader-election-namespace=kube-system
            - --webhook-namespace=cert-manager
            - --webhook-ca-secret=cert-manager-webhook-ca
            - --webhook-serving-secret=cert-manager-webhook-tls
            - --webhook-dns-names=cert-manager-webhook,cert-manager-webhook.cert-manager,cert-manager-webhook.cert-manager.svc
          env:
            - name: POD_NAMESPACE
              valueFrom:
                fieldRef:
                  fieldPath: metadata.namespace
          volumeMounts:
            - name: cert-manager-config
              mountPath: /etc/cert-manager
      volumes:
        - name: cert-manager-config
          configMap:
            name: cert-manager-config
```

### 2. 证书更新策略

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
      - http01:
          ingress:
            class: nginx
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: my-app-tls
  namespace: default
spec:
  secretName: my-app-tls
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  dnsNames:
    - myapp.example.com
    - www.myapp.example.com
  renewBefore: 30d
```

## 证书监控

### 1. 证书过期监控

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: cert-monitor
  namespace: monitoring
data:
  cert-monitor.yml: |
    groups:
    - name: certificates
      rules:
      - alert: CertificateExpiringSoon
        expr: (cert_manager_certificate_expiration_timestamp_seconds - time()) / 86400 < 30
        for: 0m
        labels:
          severity: warning
        annotations:
          summary: "Certificate {{ $labels.name }} is expiring soon"
          description: "Certificate {{ $labels.name }} in namespace {{ $labels.namespace }} will expire in {{ $value }} days"
      
      - alert: CertificateExpired
        expr: (cert_manager_certificate_expiration_timestamp_seconds - time()) / 86400 < 0
        for: 0m
        labels:
          severity: critical
        annotations:
          summary: "Certificate {{ $labels.name }} has expired"
          description: "Certificate {{ $labels.name }} in namespace {{ $labels.namespace }} has expired"
```

### 2. 证书健康检查

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: cert-checker
spec:
  containers:
    - name: cert-checker
      image: busybox
      command: ["sh", "-c"]
      args:
        - |
          while true; do
            echo "Checking certificates..."
            kubectl get certificates --all-namespaces
            kubectl get certificaterequests --all-namespaces
            sleep 300
          done
      volumeMounts:
        - name: kubeconfig
          mountPath: /root/.kube
  volumes:
    - name: kubeconfig
      secret:
        secretName: kubeconfig
```

## 常用命令

### 查看证书状态

```bash
# 查看集群证书
kubeadm certs check-expiration

# 查看证书详情
kubectl get certificates --all-namespaces

# 查看证书请求
kubectl get certificaterequests --all-namespaces

# 查看证书颁发者
kubectl get clusterissuers,issuers --all-namespaces
```

### 管理证书

```bash
# 更新证书
kubeadm certs renew all

# 创建证书
kubectl create -f certificate.yaml

# 删除证书
kubectl delete certificate my-app-tls

# 查看证书内容
kubectl get secret my-app-tls -o yaml
```

### 调试证书

```bash
# 查看证书日志
kubectl logs -n cert-manager -l app=cert-manager

# 查看证书事件
kubectl get events --field-selector involvedObject.name=my-app-tls

# 测试证书连接
openssl s_client -connect myapp.example.com:443 -servername myapp.example.com
```

## 最佳实践

1. **证书轮换**：定期轮换证书
2. **监控告警**：监控证书过期时间
3. **备份恢复**：备份重要证书
4. **安全存储**：安全存储证书私钥
5. **访问控制**：控制证书访问权限
6. **文档管理**：维护证书配置文档
7. **应急响应**：建立证书故障响应流程
