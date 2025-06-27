# 常用操作

## 新增文档

```js
const doc = await Model.create({ field1: "value1", field2: "value2" });
```

## 查询文档

```js
// 查询所有
const docs = await Model.find();
// 条件查询
const doc = await Model.findOne({ field1: "value1" });
// 根据 ID 查询
const doc = await Model.findById("id");
```

## 更新文档

```js
await Model.updateOne({ _id: "id" }, { $set: { field1: "newValue" } });
// 批量更新
await Model.updateMany({ status: "active" }, { $set: { status: "inactive" } });
```

## 删除文档

```js
await Model.deleteOne({ _id: "id" });
await Model.deleteMany({ status: "inactive" });
```

## 分页查询

```js
const page = 1;
const pageSize = 10;
const docs = await Model.find()
  .skip((page - 1) * pageSize)
  .limit(pageSize);
```

> 所有操作建议使用 try/catch 进行异常处理。
