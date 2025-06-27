# 中间件（Middleware）

Mongoose 支持在特定操作前后执行自定义逻辑，常用于数据校验、日志、权限等。

## pre 钩子

```js
schema.pre("save", function (next) {
  // 保存前逻辑
  console.log("即将保存文档");
  next();
});
```

## post 钩子

```js
schema.post("save", function (doc) {
  // 保存后逻辑
  console.log("文档已保存:", doc);
});
```

## 支持的钩子类型

- save
- validate
- remove
- updateOne
- deleteOne

> 箭头函数不适用于需要 this 的钩子。
