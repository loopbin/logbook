# Docker CI/CD 集成

## GitHub Actions 集成

### 1. 基础配置

```yaml
# .github/workflows/docker-build.yml
name: Docker Build

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to DockerHub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: myapp:latest
```

### 2. 多阶段构建

```yaml
# .github/workflows/docker-multi-stage.yml
name: Docker Multi-stage Build

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: myapp:latest
          cache-from: type=registry,ref=myapp:buildcache
          cache-to: type=registry,ref=myapp:buildcache,mode=max
```

### 3. 测试集成

```yaml
# .github/workflows/docker-test.yml
name: Docker Test

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build test image
        run: docker build -t myapp:test .

      - name: Run tests
        run: |
          docker run --rm myapp:test npm test

      - name: Run integration tests
        run: |
          docker-compose -f docker-compose.test.yml up -d
          docker-compose -f docker-compose.test.yml run --rm test npm run test:integration
```

## GitLab CI 集成

### 1. 基础配置

```yaml
# .gitlab-ci.yml
image: docker:20.10.16

services:
  - docker:20.10.16-dind

variables:
  DOCKER_TLS_CERTDIR: "/certs"

stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - docker build -t myapp:$CI_COMMIT_SHA .
    - docker push myapp:$CI_COMMIT_SHA
```

### 2. 多环境部署

```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - docker build -t myapp:$CI_COMMIT_SHA .
    - docker push myapp:$CI_COMMIT_SHA

deploy_staging:
  stage: deploy
  environment: staging
  script:
    - docker pull myapp:$CI_COMMIT_SHA
    - docker tag myapp:$CI_COMMIT_SHA myapp:staging
    - docker push myapp:staging
    - docker-compose -f docker-compose.staging.yml up -d

deploy_production:
  stage: deploy
  environment: production
  when: manual
  script:
    - docker pull myapp:$CI_COMMIT_SHA
    - docker tag myapp:$CI_COMMIT_SHA myapp:production
    - docker push myapp:production
    - docker-compose -f docker-compose.production.yml up -d
```

### 3. 缓存优化

```yaml
# .gitlab-ci.yml
build:
  stage: build
  script:
    - docker build
      --cache-from myapp:latest
      --cache-from myapp:buildcache
      --tag myapp:$CI_COMMIT_SHA
      --tag myapp:latest
      .
    - docker push myapp:$CI_COMMIT_SHA
    - docker push myapp:latest
```

## Jenkins 集成

### 1. Pipeline 配置

```groovy
// Jenkinsfile
pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'myapp'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Build') {
            steps {
                sh 'docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .'
            }
        }

        stage('Test') {
            steps {
                sh 'docker run ${DOCKER_IMAGE}:${DOCKER_TAG} npm test'
            }
        }

        stage('Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    sh 'docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}'
                    sh 'docker push ${DOCKER_IMAGE}:${DOCKER_TAG}'
                }
            }
        }
    }
}
```

### 2. 多阶段构建

```groovy
// Jenkinsfile
pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh '''
                    docker build \
                        --target builder \
                        --cache-from myapp:builder \
                        --tag myapp:builder \
                        .
                '''
            }
        }

        stage('Test') {
            steps {
                sh 'docker run myapp:builder npm test'
            }
        }

        stage('Production') {
            steps {
                sh '''
                    docker build \
                        --target production \
                        --cache-from myapp:builder \
                        --tag myapp:${BUILD_NUMBER} \
                        .
                '''
            }
        }
    }
}
```

### 3. 部署配置

```groovy
// Jenkinsfile
pipeline {
    agent any

    stages {
        stage('Deploy to Staging') {
            steps {
                sh '''
                    docker-compose -f docker-compose.staging.yml up -d
                    sleep 30
                    curl -f http://staging.myapp.com/health || exit 1
                '''
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                    docker-compose -f docker-compose.production.yml up -d
                    sleep 30
                    curl -f http://myapp.com/health || exit 1
                '''
            }
        }
    }
}
```

## 最佳实践

### 1. 镜像标签策略

```bash
# 使用语义化版本
docker tag myapp:latest myapp:1.2.3

# 使用 Git 提交哈希
docker tag myapp:latest myapp:$(git rev-parse --short HEAD)

# 使用环境标识
docker tag myapp:latest myapp:staging
docker tag myapp:latest myapp:production
```

### 2. 缓存优化

```dockerfile
# Dockerfile
FROM node:14-alpine AS builder

# 缓存依赖安装
COPY package*.json ./
RUN npm ci

# 复制源代码
COPY . .
RUN npm run build

# 生产镜像
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

### 3. 安全扫描

```yaml
# .github/workflows/security-scan.yml
name: Security Scan

on:
  push:
    branches: [main]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: myapp:latest
          format: "table"
          exit-code: "1"
          ignore-unfixed: true
          vuln-type: "os,library"
          severity: "CRITICAL,HIGH"
```

## 常见问题

### 1. 构建性能

```bash
# 使用构建缓存
docker build --cache-from myapp:latest -t myapp:new .

# 并行构建
docker buildx build --parallel 4 -t myapp:latest .

# 使用 BuildKit
DOCKER_BUILDKIT=1 docker build -t myapp:latest .
```

### 2. 部署问题

```bash
# 健康检查
docker run -d --name web \
  --health-cmd="curl -f http://localhost/health || exit 1" \
  --health-interval=30s \
  --health-timeout=3s \
  --health-retries=3 \
  nginx

# 优雅关闭
docker stop --time=30 web

# 零停机部署
docker-compose up -d --no-deps --scale web=2 web
docker-compose up -d --no-deps --scale web=1 web
```

### 3. 监控集成

```yaml
# docker-compose.yml
version: "3.8"

services:
  web:
    image: myapp:latest
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
        order: start-first
      restart_policy:
        condition: on-failure
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 3s
      retries: 3
```

## 下一步

- 了解 [故障排查](./troubleshooting.md)
- 掌握 [性能优化](./performance.md)
- 学习 [安全实践](./security.md)
