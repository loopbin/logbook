# IndexedDB 完整指南

## 概述

IndexedDB 是一个低级 API，用于在客户端存储大量结构化数据（包括文件/二进制对象）。该 API 使用索引来实现对该数据的高性能搜索。

### 主要特性

- **异步操作**：所有操作都是异步的，不会阻塞主线程
- **事务支持**：提供 ACID 事务保证
- **索引支持**：可以创建多个索引来优化查询性能
- **版本管理**：支持数据库版本升级和迁移
- **大容量存储**：可以存储大量数据（通常限制为可用磁盘空间的 50%）

## 基础 API

### 打开数据库

```javascript
const request = indexedDB.open("myDatabase", 1);

request.onerror = () => {
  console.error("数据库打开失败:", request.error);
};

request.onsuccess = () => {
  const db = request.result;
  console.log("数据库打开成功");
};

request.onupgradeneeded = (event) => {
  const db = event.target.result;

  // 创建对象存储
  if (!db.objectStoreNames.contains("users")) {
    const store = db.createObjectStore("users", { keyPath: "id" });

    // 创建索引
    store.createIndex("name", "name", { unique: false });
    store.createIndex("email", "email", { unique: true });
  }
};
```

### 基本操作

```javascript
// 添加数据
const addUser = (db, userData) => {
  const transaction = db.transaction(["users"], "readwrite");
  const store = transaction.objectStore("users");
  const request = store.add(userData);

  request.onsuccess = () => {
    console.log("用户添加成功");
  };

  request.onerror = () => {
    console.error("添加失败:", request.error);
  };
};

// 获取数据
const getUser = (db, id) => {
  const transaction = db.transaction(["users"], "readonly");
  const store = transaction.objectStore("users");
  const request = store.get(id);

  request.onsuccess = () => {
    if (request.result) {
      console.log("用户信息:", request.result);
    } else {
      console.log("用户不存在");
    }
  };
};

// 更新数据
const updateUser = (db, userData) => {
  const transaction = db.transaction(["users"], "readwrite");
  const store = transaction.objectStore("users");
  const request = store.put(userData);

  request.onsuccess = () => {
    console.log("用户更新成功");
  };
};

// 删除数据
const deleteUser = (db, id) => {
  const transaction = db.transaction(["users"], "readwrite");
  const store = transaction.objectStore("users");
  const request = store.delete(id);

  request.onsuccess = () => {
    console.log("用户删除成功");
  };
};
```

## 事务管理

### 事务类型

IndexedDB 支持三种事务模式：

1. **readonly**：只读事务，性能最佳
2. **readwrite**：读写事务，支持修改数据
3. **versionchange**：版本变更事务，用于升级数据库结构

### 事务生命周期

```javascript
const performTransaction = (db) => {
  // 创建事务
  const transaction = db.transaction(["users", "orders"], "readwrite");

  // 获取对象存储
  const userStore = transaction.objectStore("users");
  const orderStore = transaction.objectStore("orders");

  // 事务事件监听
  transaction.oncomplete = () => {
    console.log("事务完成");
  };

  transaction.onerror = () => {
    console.error("事务失败:", transaction.error);
  };

  transaction.onabort = () => {
    console.log("事务被中止");
  };

  // 执行操作
  const userRequest = userStore.add({ id: 1, name: "张三" });
  const orderRequest = orderStore.add({ id: 1, userId: 1, amount: 100 });

  // 等待所有操作完成
  Promise.all([
    new Promise((resolve, reject) => {
      userRequest.onsuccess = resolve;
      userRequest.onerror = reject;
    }),
    new Promise((resolve, reject) => {
      orderRequest.onsuccess = resolve;
      orderRequest.onerror = reject;
    }),
  ]).then(() => {
    console.log("所有操作完成");
  });
};
```

### 事务最佳实践

```javascript
class DatabaseManager {
  constructor(dbName, version) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
  }

  async open() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      request.onupgradeneeded = (event) => {
        this.handleUpgrade(event.target.result);
      };
    });
  }

  async transaction(storeNames, mode = "readonly", callback) {
    if (!this.db) {
      throw new Error("数据库未打开");
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeNames, mode);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(new Error("事务被中止"));

      try {
        callback(transaction);
      } catch (error) {
        transaction.abort();
        reject(error);
      }
    });
  }

  async addData(storeName, data) {
    return this.transaction([storeName], "readwrite", (transaction) => {
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onsuccess = () => {
        console.log("数据添加成功");
      };
      request.onerror = () => {
        throw request.error;
      };
    });
  }
}
```

## 索引管理

### 创建索引

```javascript
const createIndexes = (db) => {
  const transaction = db.transaction(["users"], "versionchange");
  const store = transaction.objectStore("users");

  // 单字段索引
  store.createIndex("name", "name", { unique: false });

  // 唯一索引
  store.createIndex("email", "email", { unique: true });

  // 多字段复合索引
  store.createIndex("name_age", ["name", "age"], { unique: false });

  // 数组字段索引
  store.createIndex("tags", "tags", { unique: false, multiEntry: true });
};
```

### 使用索引查询

```javascript
const queryByIndex = (db) => {
  const transaction = db.transaction(["users"], "readonly");
  const store = transaction.objectStore("users");

  // 通过索引查询
  const nameIndex = store.index("name");
  const request = nameIndex.get("张三");

  request.onsuccess = () => {
    console.log("查询结果:", request.result);
  };

  // 范围查询
  const rangeQuery = () => {
    const range = IDBKeyRange.bound("A", "Z");
    const request = nameIndex.getAll(range);

    request.onsuccess = () => {
      console.log("范围查询结果:", request.result);
    };
  };

  // 复合索引查询
  const compoundQuery = () => {
    const compoundIndex = store.index("name_age");
    const request = compoundIndex.get(["张三", 25]);

    request.onsuccess = () => {
      console.log("复合查询结果:", request.result);
    };
  };
};
```

### 索引类型和选项

```javascript
const indexOptions = {
  // 唯一索引
  unique: true,

  // 多条目索引（用于数组字段）
  multiEntry: true,

  // 索引配置示例
  createAdvancedIndexes: (store) => {
    // 唯一索引
    store.createIndex("unique_email", "email", { unique: true });

    // 多条目索引（数组字段）
    store.createIndex("tags", "tags", { multiEntry: true });

    // 复合索引
    store.createIndex("name_age", ["name", "age"]);

    // 部分索引（通过函数）
    store.createIndex("active_users", "status", {
      unique: false,
      // 注意：部分索引在某些浏览器中可能不支持
    });
  },
};
```

## 版本升级和数据库迁移

### 版本升级策略

```javascript
class DatabaseUpgrader {
  constructor(dbName) {
    this.dbName = dbName;
    this.currentVersion = 0;
  }

  async upgradeToVersion(version) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.currentVersion = version;
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const oldVersion = event.oldVersion;

        this.handleUpgrade(db, oldVersion, version);
      };
    });
  }

  handleUpgrade(db, oldVersion, newVersion) {
    console.log(`从版本 ${oldVersion} 升级到 ${newVersion}`);

    // 版本 1：创建基础表结构
    if (oldVersion < 1) {
      this.createVersion1(db);
    }

    // 版本 2：添加新表和索引
    if (oldVersion < 2) {
      this.createVersion2(db);
    }

    // 版本 3：修改表结构
    if (oldVersion < 3) {
      this.createVersion3(db);
    }
  }

  createVersion1(db) {
    // 创建用户表
    const userStore = db.createObjectStore("users", { keyPath: "id" });
    userStore.createIndex("name", "name");
    userStore.createIndex("email", "email", { unique: true });
  }

  createVersion2(db) {
    // 创建订单表
    const orderStore = db.createObjectStore("orders", { keyPath: "id" });
    orderStore.createIndex("userId", "userId");
    orderStore.createIndex("date", "date");

    // 为用户表添加新索引
    const transaction = db.transaction(["users"], "versionchange");
    const userStore = transaction.objectStore("users");
    userStore.createIndex("age", "age");
  }

  createVersion3(db) {
    // 删除旧索引
    const transaction = db.transaction(["users"], "versionchange");
    const userStore = transaction.objectStore("users");

    if (userStore.indexNames.contains("oldIndex")) {
      userStore.deleteIndex("oldIndex");
    }

    // 添加新索引
    userStore.createIndex("name_age", ["name", "age"]);
  }
}
```

### 数据迁移

```javascript
class DataMigrator {
  async migrateData(db, fromVersion, toVersion) {
    const transaction = db.transaction(["users"], "readwrite");
    const store = transaction.objectStore("users");

    // 获取所有数据
    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = () => {
      const users = getAllRequest.result;

      // 迁移数据
      users.forEach((user) => {
        // 添加新字段
        if (!user.createdAt) {
          user.createdAt = new Date().toISOString();
        }

        // 修改字段格式
        if (user.birthday && typeof user.birthday === "string") {
          user.birthday = new Date(user.birthday);
        }

        // 更新数据
        store.put(user);
      });
    };
  }

  async migrateWithBackup(db) {
    // 创建备份
    const backup = await this.createBackup(db);

    try {
      // 执行迁移
      await this.performMigration(db);
    } catch (error) {
      // 迁移失败，恢复备份
      await this.restoreBackup(db, backup);
      throw error;
    }
  }

  async createBackup(db) {
    const transaction = db.transaction(["users"], "readonly");
    const store = transaction.objectStore("users");
    const request = store.getAll();

    return new Promise((resolve) => {
      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  async restoreBackup(db, backup) {
    const transaction = db.transaction(["users"], "readwrite");
    const store = transaction.objectStore("users");

    // 清空现有数据
    store.clear();

    // 恢复备份数据
    backup.forEach((user) => {
      store.add(user);
    });
  }
}
```

## 高级功能

### 游标操作

```javascript
const cursorOperations = (db) => {
  const transaction = db.transaction(["users"], "readonly");
  const store = transaction.objectStore("users");

  // 遍历所有数据
  const iterateAll = () => {
    const request = store.openCursor();

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        console.log("当前记录:", cursor.value);
        cursor.continue(); // 继续下一个
      } else {
        console.log("遍历完成");
      }
    };
  };

  // 条件遍历
  const iterateWithCondition = () => {
    const range = IDBKeyRange.bound(1, 100);
    const request = store.openCursor(range);

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        if (cursor.value.age > 18) {
          console.log("成年用户:", cursor.value);
        }
        cursor.continue();
      }
    };
  };

  // 索引游标
  const iterateByIndex = () => {
    const index = store.index("name");
    const request = index.openCursor();

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        console.log("按姓名排序:", cursor.value);
        cursor.continue();
      }
    };
  };
};
```

### 批量操作

```javascript
const batchOperations = (db) => {
  const transaction = db.transaction(["users"], "readwrite");
  const store = transaction.objectStore("users");

  // 批量添加
  const batchAdd = (users) => {
    const promises = users.map((user) => {
      return new Promise((resolve, reject) => {
        const request = store.add(user);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });

    return Promise.all(promises);
  };

  // 批量更新
  const batchUpdate = (users) => {
    const promises = users.map((user) => {
      return new Promise((resolve, reject) => {
        const request = store.put(user);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });

    return Promise.all(promises);
  };

  // 批量删除
  const batchDelete = (ids) => {
    const promises = ids.map((id) => {
      return new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });

    return Promise.all(promises);
  };
};
```

### 错误处理

```javascript
class IndexedDBErrorHandler {
  static handleError(error) {
    switch (error.name) {
      case "QuotaExceededError":
        console.error("存储空间不足");
        this.handleQuotaExceeded();
        break;

      case "ConstraintError":
        console.error("约束错误，可能是唯一索引冲突");
        break;

      case "TransactionInactiveError":
        console.error("事务已失效");
        break;

      case "InvalidStateError":
        console.error("无效状态错误");
        break;

      case "DataError":
        console.error("数据错误");
        break;

      default:
        console.error("未知错误:", error);
    }
  }

  static handleQuotaExceeded() {
    // 清理旧数据
    this.cleanupOldData();

    // 提示用户
    alert("存储空间不足，正在清理旧数据...");
  }

  static async cleanupOldData() {
    // 实现清理逻辑
    console.log("清理旧数据");
  }
}
```

## 最佳实践

### 1. 连接管理

```javascript
class DatabaseConnection {
  constructor(dbName, version) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
    this.isConnecting = false;
  }

  async connect() {
    if (this.db) {
      return this.db;
    }

    if (this.isConnecting) {
      // 等待现有连接
      return new Promise((resolve) => {
        const checkConnection = () => {
          if (this.db) {
            resolve(this.db);
          } else {
            setTimeout(checkConnection, 100);
          }
        };
        checkConnection();
      });
    }

    this.isConnecting = true;

    try {
      this.db = await this.openDatabase();
      return this.db;
    } finally {
      this.isConnecting = false;
    }
  }

  async openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        this.handleUpgrade(event.target.result);
      };
    });
  }

  disconnect() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}
```

### 2. 性能优化

```javascript
const performanceOptimizations = {
  // 使用只读事务
  useReadOnlyTransaction: (db) => {
    const transaction = db.transaction(["users"], "readonly");
    // 只读事务性能更好
  },

  // 批量操作
  batchOperations: async (db, operations) => {
    const transaction = db.transaction(["users"], "readwrite");
    const store = transaction.objectStore("users");

    // 一次性执行多个操作
    const promises = operations.map((op) => {
      return new Promise((resolve, reject) => {
        const request = store[op.method](op.data);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    });

    return Promise.all(promises);
  },

  // 使用索引优化查询
  useIndexForQuery: (db, indexName, key) => {
    const transaction = db.transaction(["users"], "readonly");
    const store = transaction.objectStore("users");
    const index = store.index(indexName);

    return new Promise((resolve, reject) => {
      const request = index.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
};
```

### 3. 数据验证

```javascript
class DataValidator {
  static validateUser(user) {
    const errors = [];

    if (!user.name || typeof user.name !== "string") {
      errors.push("姓名必须是非空字符串");
    }

    if (!user.email || !this.isValidEmail(user.email)) {
      errors.push("邮箱格式不正确");
    }

    if (user.age && (user.age < 0 || user.age > 150)) {
      errors.push("年龄必须在 0-150 之间");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static async saveUserWithValidation(db, user) {
    const validation = this.validateUser(user);

    if (!validation.isValid) {
      throw new Error(`数据验证失败: ${validation.errors.join(", ")}`);
    }

    return this.saveUser(db, user);
  }

  static async saveUser(db, user) {
    const transaction = db.transaction(["users"], "readwrite");
    const store = transaction.objectStore("users");

    return new Promise((resolve, reject) => {
      const request = store.put(user);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}
```

## 实际应用示例

### 完整的用户管理系统

```javascript
class UserManager {
  constructor() {
    this.dbName = "UserManagerDB";
    this.version = 1;
    this.db = null;
  }

  async init() {
    this.db = await this.openDatabase();
  }

  async openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // 创建用户表
        if (!db.objectStoreNames.contains("users")) {
          const store = db.createObjectStore("users", { keyPath: "id" });
          store.createIndex("name", "name");
          store.createIndex("email", "email", { unique: true });
          store.createIndex("age", "age");
          store.createIndex("createdAt", "createdAt");
        }
      };
    });
  }

  async addUser(userData) {
    const user = {
      id: Date.now(),
      ...userData,
      createdAt: new Date().toISOString(),
    };

    const transaction = this.db.transaction(["users"], "readwrite");
    const store = transaction.objectStore("users");

    return new Promise((resolve, reject) => {
      const request = store.add(user);
      request.onsuccess = () => resolve(user);
      request.onerror = () => reject(request.error);
    });
  }

  async getUser(id) {
    const transaction = this.db.transaction(["users"], "readonly");
    const store = transaction.objectStore("users");

    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateUser(id, updates) {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error("用户不存在");
    }

    const updatedUser = { ...user, ...updates };

    const transaction = this.db.transaction(["users"], "readwrite");
    const store = transaction.objectStore("users");

    return new Promise((resolve, reject) => {
      const request = store.put(updatedUser);
      request.onsuccess = () => resolve(updatedUser);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteUser(id) {
    const transaction = this.db.transaction(["users"], "readwrite");
    const store = transaction.objectStore("users");

    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllUsers() {
    const transaction = this.db.transaction(["users"], "readonly");
    const store = transaction.objectStore("users");

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async searchUsersByName(name) {
    const transaction = this.db.transaction(["users"], "readonly");
    const store = transaction.objectStore("users");
    const index = store.index("name");

    return new Promise((resolve, reject) => {
      const request = index.getAll(name);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getUsersByAgeRange(minAge, maxAge) {
    const transaction = this.db.transaction(["users"], "readonly");
    const store = transaction.objectStore("users");
    const index = store.index("age");
    const range = IDBKeyRange.bound(minAge, maxAge);

    return new Promise((resolve, reject) => {
      const request = index.getAll(range);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

// 使用示例
const userManager = new UserManager();

async function initApp() {
  try {
    await userManager.init();
    console.log("用户管理系统初始化成功");

    // 添加用户
    const user = await userManager.addUser({
      name: "张三",
      email: "zhangsan@example.com",
      age: 25,
    });
    console.log("用户添加成功:", user);

    // 查询用户
    const foundUser = await userManager.getUser(user.id);
    console.log("查询到的用户:", foundUser);

    // 更新用户
    const updatedUser = await userManager.updateUser(user.id, { age: 26 });
    console.log("用户更新成功:", updatedUser);

    // 搜索用户
    const users = await userManager.searchUsersByName("张三");
    console.log("搜索结果:", users);
  } catch (error) {
    console.error("操作失败:", error);
  }
}

initApp();
```

## 总结

IndexedDB 是一个强大的客户端数据库 API，提供了：

- **事务支持**：确保数据一致性
- **索引功能**：优化查询性能
- **版本管理**：支持数据库结构升级
- **大容量存储**：适合存储大量数据
- **异步操作**：不阻塞主线程

通过合理使用这些功能，可以构建高性能的客户端数据存储解决方案。记住始终进行错误处理，使用事务来保证数据一致性，并通过索引来优化查询性能。
