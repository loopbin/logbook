# Docker 文档

## 基础概念

Docker

- 容器
  - docker run 创建并启动容器
  - docker start 启动容器
  - docker stop 终止容器
  - docker restart 重启容器
  - docker attach 进入容器
  - docker exec 进入容器
  - docker export 导出容器
  - docker import 导入容器快照
  - docker rm 删除容器
  - docker logs 查看日志
- 服务
  - docker version 查看 docker 版本详细信息
  - docker -v 查看 docker 简要信息
  - systemctl start docker 启动 docker
  - systemctl stop docker 关闭 docker
  - systemctl enable docker 设置开机启动
  - service docker restart 重启 docker 服务
  - service docker stop 关闭 docker 服务
- 镜像

  - docker search [image] 检索镜像
  - docker pull [image] 获取镜像
  - docker images 列出镜像
  - docker image ls 列出镜像
  - docker load 导入镜像
  - docker diff [容器 id] 比较和容器的文件差异

- [Docker 基础](./basics.md)
- [常规操作](./operations.md)
- [Docker 学习路径](./learning-path.md)

## 进阶主题

- [Dockerfile 编写](./dockerfile.md)
- [数据持久化](./volumes.md)
- [网络配置](./networking.md)
- [容器编排](./compose.md)
- [监控和日志](./monitoring.md)
- [安全实践](./security.md)

## 最佳实践

- [CI/CD 集成](./cicd.md)
- [故障排查](./troubleshooting.md)
- [性能优化](./performance.md)
