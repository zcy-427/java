
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
// 定义 Record
record User(String id, String username, int age) {}

// 实例化（调用自动生成的全参构造器）
User user = new User("1001", "张三", 25);

// 访问字段（调用访问器方法）
System.out.println(user.id()); // 输出：1001
System.out.println(user.username()); // 输出：张三

// 自动生成的 toString
System.out.println(user); // 输出：User[id=1001, username=张三, age=25]

// equals 比较（基于所有组件）
User user2 = new User("1001", "张三", 25);
System.out.println(user.equals(user2)); // 输出：true
```

2.自定义紧凑构造器（参数验证）
紧凑构造器用于修改默认构造器的逻辑（如参数校验），无需写参数列表

```java
record User(String id, String username, int age) {
    // 紧凑构造器：验证参数合法性
    public User {
        if (age < 0 || age > 150) {
            throw new IllegalArgumentException("年龄非法：" + age);
        }
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("ID 不能为空");
        }
        // 无需手动赋值，编译器自动处理
    }
}

// 测试：抛出异常
// User invalidUser = new User("", "李四", 200);
```

3.实现接口 + 静态方法

```java
// 定义接口
interface Printable {
    void printInfo();
}

// Record 实现接口
record Product(String sku, String name, double price) implements Printable {
    // 静态字段
    public static final double MIN_PRICE = 0.01;

    // 静态方法
    public static Product createDefault() {
        return new Product("DEFAULT", "默认商品", MIN_PRICE);
    }

    // 实现接口方法
    @Override
    public void printInfo() {
        System.out.printf("商品：%s，SKU：%s，价格：%.2f%n", name, sku, price);
    }
}

// 使用
Product defaultProduct = Product.createDefault();
defaultProduct.printInfo(); // 输出：商品：默认商品，SKU：DEFAULT，价格：0.01
```

4.处理可变组件（如 List）

```java
import java.util.List;
import java.util.Objects;

record Order(String orderId, List<String> items) {
    // 紧凑构造器：拷贝集合，防止外部修改
    public Order {
        // List.copyOf 返回不可变列表
        items = List.copyOf(Objects.requireNonNull(items));
    }
}

// 测试
List<String> items = List.of("苹果", "香蕉");
Order order = new Order("OD001", items);
// order.items().add("橙子"); // 抛出 UnsupportedOperationException（不可变列表）
```

5.重载构造器

```java
record Person(String name, int age) {
    // 重载构造器：默认年龄 18
    public Person(String name) {
        this(name, 18); // 必须调用主构造器
    }
}

// 使用
Person p = new Person("李四");
System.out.println(p.age()); // 输出：18
```