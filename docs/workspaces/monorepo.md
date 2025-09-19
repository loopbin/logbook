# Monorepo 架构

## 概述

Monorepo（单一代码仓库）是一种软件开发策略，将多个相关项目或包存储在同一个版本控制仓库中。在 React 生态系统中，Monorepo 通常与 Workspaces 结合使用，提供统一的依赖管理和构建流程。

## 核心概念

### 1. 单一代码仓库

- 所有相关代码存储在一个 Git 仓库中
- 共享版本历史和分支策略
- 统一的代码审查和 CI/CD 流程

### 2. 多包管理

- 将大型应用拆分为多个独立的包
- 每个包可以独立版本化和发布
- 包之间可以相互依赖和引用

### 3. 统一工具链

- 共享构建工具和配置
- 统一的代码质量和测试标准
- 一致的开发环境设置

## 架构优势

### 1. 代码共享

- **类型定义共享**: 统一的 TypeScript 类型定义
- **工具函数共享**: 避免重复实现相同功能
- **组件库共享**: 统一的 UI 组件和设计系统

### 2. 依赖管理

- **版本一致性**: 所有包使用相同版本的依赖
- **依赖提升**: 减少重复安装，节省磁盘空间
- **冲突解决**: 统一解决依赖版本冲突

### 3. 开发效率

- **原子提交**: 跨包的更改可以原子性提交
- **重构简化**: 跨包重构更容易协调
- **工具集成**: 统一的开发工具和脚本

### 4. 团队协作

- **代码可见性**: 团队成员可以看到所有相关代码
- **知识共享**: 跨项目的技术知识更容易传播
- **标准统一**: 统一的代码风格和最佳实践

## 架构挑战

### 1. 仓库大小

- **克隆时间**: 大型仓库克隆时间较长
- **磁盘空间**: 需要更多本地存储空间
- **网络带宽**: 拉取和推送需要更多带宽

### 2. 权限管理

- **访问控制**: 需要精细的权限控制策略
- **代码隔离**: 敏感代码的隔离和保护
- **团队边界**: 不同团队间的代码访问控制

### 3. 构建复杂性

- **依赖关系**: 复杂的包间依赖关系管理
- **构建顺序**: 需要正确的构建顺序
- **缓存策略**: 增量构建和缓存优化

### 4. 工具支持

- **IDE 支持**: 大型仓库的 IDE 性能问题
- **搜索性能**: 代码搜索和导航性能
- **版本控制**: Git 在大仓库上的性能问题

## 目录结构设计

### 1. 分层架构

```
monorepo/
├── packages/           # 共享包
│   ├── ui/            # UI 组件库
│   ├── utils/         # 工具函数
│   ├── types/         # 类型定义
│   └── config/        # 配置管理
├── apps/              # 应用
│   ├── web/           # Web 应用
│   ├── mobile/        # 移动应用
│   └── admin/         # 管理后台
├── tools/             # 开发工具
│   ├── eslint-config/ # ESLint 配置
│   ├── ts-config/     # TypeScript 配置
│   └── build-tools/   # 构建工具
└── docs/              # 文档
    ├── api/           # API 文档
    ├── guides/        # 使用指南
    └── examples/      # 示例代码
```

### 2. 包命名规范

```typescript
// 包命名示例
@monorepo/ui-components     // UI 组件库
@monorepo/utils            // 工具函数
@monorepo/types           // 类型定义
@monorepo/web-app         // Web 应用
@monorepo/mobile-app      // 移动应用
@monorepo/admin-panel     // 管理后台
```

### 3. 依赖关系管理

```json
// 根目录 package.json
{
  "name": "monorepo-root",
  "private": true,
  "workspaces": ["packages/*", "apps/*", "tools/*"],
  "devDependencies": {
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

## 工具生态系统

### 1. 包管理器

#### Yarn Workspaces

```json
{
  "workspaces": ["packages/*", "apps/*"]
}
```

#### npm Workspaces

```json
{
  "workspaces": ["packages/*", "apps/*"]
}
```

#### pnpm Workspaces

```yaml
# pnpm-workspace.yaml
packages:
  - "packages/*"
  - "apps/*"
  - "tools/*"
```

### 2. 构建工具

#### Lerna

```json
{
  "lerna": {
    "version": "independent",
    "npmClient": "yarn",
    "useWorkspaces": true
  }
}
```

#### Nx

```json
{
  "nx": {
    "extends": "nx/presets/npm.json",
    "affected": {
      "defaultBase": "main"
    }
  }
}
```

#### Turborepo

```json
{
  "turbo": {
    "pipeline": {
      "build": {
        "dependsOn": ["^build"],
        "outputs": ["dist/**"]
      },
      "dev": {
        "cache": false,
        "persistent": true
      }
    }
  }
}
```

## 最佳实践

### 1. 依赖管理

#### 版本一致性

```json
// 根目录 package.json
{
  "devDependencies": {
    "typescript": "^5.0.0",
    "eslint": "^8.0.0"
  },
  "resolutions": {
    "typescript": "^5.0.0"
  }
}
```

#### 工作区引用

```json
// 子包 package.json
{
  "dependencies": {
    "@monorepo/utils": "workspace:*",
    "@monorepo/types": "workspace:*"
  }
}
```

### 2. 构建优化

#### 并行构建

```json
{
  "scripts": {
    "build": "turbo run build",
    "build:parallel": "turbo run build --parallel"
  }
}
```

#### 增量构建

```json
{
  "turbo": {
    "pipeline": {
      "build": {
        "dependsOn": ["^build"],
        "outputs": ["dist/**"],
        "cache": true
      }
    }
  }
}
```

### 3. 代码质量

#### 统一配置

```typescript
// packages/eslint-config/index.js
module.exports = {
  extends: [
    "@monorepo/eslint-config/base",
    "@monorepo/eslint-config/react",
    "@monorepo/eslint-config/typescript",
  ],
};
```

#### 预提交钩子

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

## 性能优化策略

### 1. 构建缓存

#### 本地缓存

```json
{
  "turbo": {
    "globalDependencies": ["tsconfig.json", "package.json"]
  }
}
```

#### 远程缓存

```bash
# 设置远程缓存
npx turbo login
npx turbo link
```

### 2. 依赖提升

#### 根目录依赖

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

#### 工作区配置

```yaml
# .yarnrc.yml
nodeLinker: node-modules
```

### 3. 按需加载

#### 动态导入

```typescript
// 按需加载包
const AdminPanel = lazy(() => import("@monorepo/admin-panel"));
const MobileApp = lazy(() => import("@monorepo/mobile-app"));
```

#### 路由分割

```typescript
const routes = [
  {
    path: "/admin",
    component: lazy(() => import("@monorepo/admin-panel")),
  },
];
```

## 部署策略

### 1. 独立部署

#### 包级别部署

```json
{
  "scripts": {
    "deploy:packages": "lerna publish",
    "deploy:apps": "turbo run deploy"
  }
}
```

#### 应用级别部署

```json
{
  "scripts": {
    "deploy:web": "cd apps/web && npm run deploy",
    "deploy:mobile": "cd apps/mobile && npm run deploy"
  }
}
```

### 2. 统一部署

#### 全量部署

```json
{
  "scripts": {
    "deploy:all": "turbo run build && turbo run deploy"
  }
}
```

#### 增量部署

```json
{
  "scripts": {
    "deploy:affected": "turbo run build --filter=...[origin/main] && turbo run deploy --filter=...[origin/main]"
  }
}
```

## 总结

Monorepo 架构为大型 React 项目提供了强大的组织能力：

1. **统一管理**: 所有相关代码在一个仓库中管理
2. **代码共享**: 最大化代码复用，减少重复开发
3. **工具集成**: 统一的开发工具和构建流程
4. **团队协作**: 更好的代码可见性和知识共享
5. **性能优化**: 依赖提升、构建缓存等优化策略

选择合适的 Monorepo 工具和架构模式，可以显著提升大型项目的开发效率和维护性。
