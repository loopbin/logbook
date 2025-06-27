# 安装与配置

## 安装

使用 npm 安装：

```bash
npm install mongoose
```

或使用 pnpm：

```bash
pnpm add mongoose
```

## 连接 MongoDB

```js
// 引入 mongoose
const mongoose = require("mongoose");

// 连接数据库
mongoose.connect("mongodb://localhost:27017/your_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "连接错误:"));
db.once("open", () => {
  console.log("数据库连接成功");
});
```

> 推荐将连接字符串、账号密码等信息放在环境变量中管理。
