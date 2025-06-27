# 常见问题（FAQ）

## 1. 连接报错

- 检查 MongoDB 服务是否启动
- 检查连接字符串是否正确
- 防火墙或网络问题

## 2. 唯一索引报错

- 确认字段已加 unique
- 若已存在重复数据，需先清理

## 3. 如何设计 Schema？

- 尽量扁平化，避免嵌套过深
- 合理使用引用（ref）与嵌入（embed）

## 4. 如何调试？

- 使用 mongoose.set('debug', true) 输出调试日志

## 5. 版本兼容问题

- 注意 Mongoose 与 MongoDB 版本兼容性

> 更多问题可查阅官方文档：https://mongoosejs.com/docs/
