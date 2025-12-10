
java Record 是 **Java 16 正式引入**（预览版在 Java 14/15）的特殊类，专为简化**不可变数据载体类**（如 DTO、VO、元组等）的开发设计，核心目标是消除传统 POJO 中大量重复的样板代码（构造器、getter、equals/hashCode、toString 等）。

## 为什么需要

传统开发中，定义一个仅用于承载数据的不可变类（如 User、Order），需要手动编写：

- `private final` 字段；
- 全参构造器；
- 字段访问器（getter）；
- `equals()`/`hashCode()`（基于所有字段）；
- `toString()`（包含所有字段）。

Record 本质是编译器层面的**语法糖**，自动生成上述核心逻辑，开发者只需声明「数据组件」即可。

---
## 基本的语法

```java
// 基础定义：组件为 name、age，编译器自动生成核心方法 
record Person(String name, int age) {}
```

1. 括号内的 `name`、`age` 是 Record 的核心数据，编译器会自动将其转为 `private final` 字段；
2. 自动生成的方法：
    - 全参构造器：`Person(String name, int age)`；
    - 访问器方法：`name()`、`age()`（注意：不是 JavaBean 风格的 `getName()`）；
    - `equals()`：基于所有组件的值比较；
    - `hashCode()`：基于所有组件的值计算；
    - `toString()`：格式为 `Person[name=xxx, age=xxx]`。

### 特性

1. 组件默认是 `private final`，实例创建后字段值**不可修改**（无 setter 方法）；
2. Record 类默认是 `final`，**不能被继承**，也不能声明为 `abstract`；可实现任意接口（弥补单继承的限制）。
3. Record 并非完全不可定制，可添加：

- 静态方法 / 静态字段；
- 实例方法；
- 紧凑构造器（验证参数、处理组件）；
- 重载构造器（必须调用全参主构造器）;

## 示例

1.基本的使用

```Java

```
  