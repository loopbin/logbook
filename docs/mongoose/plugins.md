# 插件（Plugins）

Mongoose 支持通过插件扩展功能。

## 编写插件

```js
function myPlugin(schema, options) {
  schema.add({ createdAt: Date });
  schema.pre("save", function (next) {
    if (!this.createdAt) {
      this.createdAt = new Date();
    }
    next();
  });
}

schema.plugin(myPlugin);
```

## 常用插件

- mongoose-paginate-v2：分页插件
- mongoose-unique-validator：唯一性校验

## 使用插件

```js
const mongoosePaginate = require("mongoose-paginate-v2");
schema.plugin(mongoosePaginate);
```
