# Schema 与 Model

## 定义 Schema

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  email: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
});
```

## 创建 Model

```js
const User = mongoose.model("User", userSchema);
```

## 使用 Model

### 新增文档

```js
const user = new User({ name: "张三", age: 20, email: "zhangsan@example.com" });
await user.save();
```

### 查询文档

```js
const users = await User.find({ age: { $gte: 18 } });
```

### 更新文档

```js
await User.updateOne({ name: "张三" }, { age: 21 });
```

### 删除文档

```js
await User.deleteOne({ name: "张三" });
```
