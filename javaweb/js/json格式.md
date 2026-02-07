它的语法非常简单，只有两种结构：

1. **对象 (Object)**：用花括号 `{}` 包裹，里面是键值对。
    
2. **数组 (Array)**：用方括号 `[]` 包裹，里面是列表。、

```json
{
  "name": "Java导师",
  "age": 30,
  "isTeacher": true,
  "skills": ["Java", "Spring Boot", "MySQL"],
  "address": {
    "city": "北京",
    "street": "中关村"
  },
  "car": null
}
```

**注意事项**

- 所有的 **Key (键)** 必须用双引号 `""` 包裹
- 标准的 JSON 文件里不允许写 `// 注释`。
- **逗号**：最后一项后面 **不能** 有逗号（IE 浏览器会报错，现在的 Chrome 容忍度高了一些，但标准是不允许的）。

**Java 里的 JSON：序列化与反序列化**

**序列化 (Serialization)**：

- **方向**：Java 对象 -> JSON 字符串。
    
- **场景**：后端把数据发给前端时（比如 `return user;`）。
**反序列化 (Deserialization)**：

- **方向**：JSON 字符串 -> Java 对象。
    
- **场景**：前端提交表单数据给后端时。

在 Spring Boot 中，有一个内置的神器叫 **Jackson**。

```Java
@GetMapping("/user")
public User getUser() {
    User u = new User("张三", 18);
    return u; // 你直接返回了 Java 对象
}
```
Spring Boot 会自动调用 Jackson，把这个 `u` 对象变成 `{"name":"张三", "age":18}` 发给浏览器。