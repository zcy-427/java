## 核心增强 1：Switch 表达式（Java 14+ 正式）

| 特性          | 说明                                            |
| ----------- | --------------------------------------------- |
| 支持返回值       | 可直接赋值给变量（表达式特性），替代手动赋值                        |
| 箭头语法 `->`   | 替代传统 `:`，自动避免穿透（无需写 `break`）                  |
| `yield` 关键字 | 用于 Switch 表达式中返回值（替代 `break` 带值，语句仍用 `break`） |
| 多 case 合并   | `case 1,2,3 -> ...` 简化多常量分支                   |
| 兼容传统语法      | 仍支持 `:` + `break`，但推荐箭头语法                     |
示例：

```java
// 1. 基础：返回值 + 箭头语法（无穿透）
int week = 1;
String day = switch (week) {
    case 1 -> "周一";
    case 2 -> "周二";
    case 3,4,5 -> "工作日"; // 多case合并
    case 6,7 -> "周末";
    default -> "未知";
};
System.out.println(day); // 输出：周一

// 2. 复杂逻辑：用 {} 包裹多行代码，yield 返回值
int num = 5;
String result = switch (num) {
    case 1 -> "一";
    case 2 -> "二";
    default -> {
        // 多行逻辑
        String msg = "数字" + num;
        yield msg; // 表达式中用yield返回值（语句用break）
    }
};

// 3. 传统语法兼容（仍可用，但不推荐）
switch (week) {
    case 1: break; // 语句用break
    default: break;
}
```
> 注意：Switch 表达式中若用传统 `:` 语法，仍需 `break` 避免穿透；箭头语法 `->` 无需 `break`/`yield`（单行直接返回，多行用 `yield`）。

## 核心增强 2：Switch 模式匹配（Java 17+ 正式）

Java 17 引入的**模式匹配**（JEP 406）是 Switch 的革命性升级，支持直接匹配 “对象类型 / 结构”，替代繁琐的 `instanceof + 强制类型转换`；Java 21 进一步增强（JEP 441、447），支持记录（Record）解构、空值匹配、穷尽性检查。

### 1. 类型模式匹配（替代 instanceof 链）

直接匹配对象类型，并自动绑定变量（无需手动强转）：

```java
// 传统写法：instanceof + 强转，繁琐
Object obj = "Java 21";
if (obj instanceof String) {
    String s = (String) obj;
    System.out.println(s.length());
} else if (obj instanceof Integer) {
    Integer i = (Integer) obj;
    System.out.println(i * 2);
}

// 新模式匹配：简洁+类型安全
switch (obj) {
    case String s -> System.out.println(s.length()); // 自动绑定变量s
    case Integer i -> System.out.println(i * 2);     // 自动绑定变量i
    case Double d -> System.out.println(d + 1.0);
    default -> System.out.println("未知类型");
}
```

### 2. 记录（Record）模式匹配（Java 21+）

匹配 Record 的结构并解构字段（无需手动 get 方法）：

```java
// 定义Record
record Point(int x, int y) {}

// 模式匹配解构Record
Object obj = new Point(10, 20);
switch (obj) {
    case Point(int x, int y) when x > 0 -> // 带条件的匹配，当Point 类型匹配且 x > 0 成立时，才执行该分支代码。
        System.out.println("第一/四象限：x=" + x + ", y=" + y);
    case Point(int x, int y) ->
        System.out.println("第二/三象限：x=" + x + ", y=" + y);
    default -> System.out.println("非Point类型");
}
```

### 3. 密封类 + 穷尽性检查（核心场景）

结合之前讲的**密封类**，Switch 模式匹配会做「穷尽性检查」—— 必须覆盖密封类的所有子类，否则编译报错（彻底避免分支遗漏）：

```java
// 密封类（仅允许Circle、Rectangle）
sealed class Shape permits Circle, Rectangle {}
final class Circle extends Shape { double radius; }
final class Rectangle extends Shape { double width, height; }

// 模式匹配：编译器检查是否覆盖所有子类
double area = switch (new Circle(5.0)) {
    case Circle c -> Math.PI * c.radius * c.radius;
    case Rectangle r -> r.width * r.height;
    // 无需default！密封类保证穷尽性，漏写会编译报错
};
```

### 4. 空值匹配（Java 21+）

直接通过 `case null` 匹配空值，无需手动判空，逻辑更统一：

```java
String str = null;
switch (str) {
    case null -> System.out.println("字符串为空");
    case String s when s.isEmpty() -> System.out.println("空字符串");
    case String s -> System.out.println("字符串：" + s);
}
```


