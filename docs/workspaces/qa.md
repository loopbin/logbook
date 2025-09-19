# 项目架构

项目基于 workspace、git submodule 架构，ui、icons 通过 submodule 引入到主应用 apps 中，项目结构如下：

```
my-workspace/
├── package.json
├── packages/
│   ├── ui/
│   │   ├── package.json
│   │   ├── src/
│   │   └── dist/
│   └── icons/
│       ├── package.json
│       ├── src/
│       └── dist/
└── apps/
    └──  web-app/
        ├── package.json
        ├── src/
        └── public/
```

现 ui 计划依赖 icons，可以实现吗
