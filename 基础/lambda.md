# lambda

Lambda 表达式是 **JDK 8** 引入的核心特性，本质是「可传递的匿名函数」—— 它没有名称，但有参数列表、函数主体和返回类型（可选）。其核心作用是**简化函数式接口的实现**，替代冗余的匿名内部类代码，让代码更简洁、更具可读性，同时推动 Java 支持「函数式编程」风格。

---

### 使用前提

lambda表达式**只能用于实现函数式接口**，`@FunctionalInterface` 注解来标记函数式接口（编译器会强制校验是否符合规范），但即使不标注，只要满足 “仅有一个抽象方法” 的条件，就是函数式接口。

### 语法

Lambda 表达式的语法可概括为：**参数列表 → 箭头 → 方法体**

```txt
(参数1, 参数2, ...) -> { 方法体 }
```

**对于参数列表**，如果参数为0，则使用`（）`；如果参数只有一个可以省去括号；若参数类型可由上下文推断（类型推断），可省略参数类型（如 `(x, y) -> ...`，无需写 `(int x, int y)`）。

**对于方法体**，如果只有一行代码，可省略大括号 `{}`，且自动返回该行结果（无需写 `return`）；有多行代码，必须用大括号包裹，且需显式写 `return`（如有返回值）。

以 `Runnable` 接口为例

```java
Runnable runnable=()->System.out.println("run");
```

### 核心使用场景

#### 1. 替代匿名内部类（简化函数式接口实现）、

创建线程：

```java
// 传统方式
new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println("线程执行（匿名内部类）");
    }
}).start();

// Lambda 方式
new Thread(() -> System.out.println("线程执行（Lambda）")).start();
```

自定义比较器：

```java
List<String> list = Arrays.asList("apple", "banana", "cherry");

// 传统方式：按字符串长度排序
Collections.sort(list, new Comparator<String>() {
    @Override
    public int compare(String s1, String s2) {
        return s1.length() - s2.length();
    }
});

// Lambda 方式：按字符串长度排序
Collections.sort(list, (s1, s2) -> s1.length() - s2.length());
```

#### 2. Stream 流操作（函数式编程核心）

Lambda 表达式与 Stream API 结合，可实现高效的集合处理（过滤、映射、聚合等），是函数式编程的典型应用：

```java
List<Person> personList = Arrays.asList(
    new Person("张三", 20),
    new Person("李四", 25),
    new Person("王五", 30)
);

// 需求：筛选年龄大于25的人，获取姓名列表
List<String> result = personList.stream()
    .filter(person -> person.getAge() > 25) // Lambda 过滤
    .map(person -> person.getName())        // Lambda 映射
    .collect(Collectors.toList());

System.out.println(result); // 输出：[王五]
```

#### 3. 方法引用（Lambda 的简化写法）（待研究）

当 Lambda 表达式的逻辑仅调用一个已存在的方法时，可通过「方法引用」进一步简化语法，格式为 `类名::方法名` 或 `对象::方法名`。

#### 常见方法引用类型

| 方法引用类型         | 示例                  | 对应 Lambda 表达式           |
| -------------------- | --------------------- | ---------------------------- |
| 静态方法引用         | `Integer::parseInt`   | `s -> Integer.parseInt(s)`   |
| 实例方法引用（对象） | `System.out::println` | `s -> System.out.println(s)` |
| 实例方法引用（类）   | `String::length`      | `s -> s.length()`            |
| 构造器引用           | `ArrayList::new`      | `() -> new ArrayList<>()`    |

示例：方法引用简化 Lambda

```java
// Lambda 写法
Function<String, Integer> func1 = s -> Integer.parseInt(s);

// 静态方法引用写法
Function<String, Integer> func2 = Integer::parseInt;

// 构造器引用：创建 List
Supplier<List<String>> supplier = ArrayList::new;
List<String> list = supplier.get();
```

#### 4.集合遍历（`forEach` 方法）

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

// 传统 for 循环
for (int num : numbers) {
    System.out.println(num);
}

// Lambda + forEach
numbers.forEach(num -> System.out.println(num));

// 更简洁：方法引用（配合 Lambda）
numbers.forEach(System.out::println);
```

---

### lambda表达式的捕获规则

#### 1. 访问局部变量：必须是 `final` 或 “effectively final”

Lambda 表达式中访问的局部变量，**不能被重新赋值**（即要么显式用 `final` 修饰，要么实际未被修改，称为 “effectively final”）。

其本质是值捕获，无法修改变量其本身

```java
public static void testLocalVar() {
    int num = 10; // effectively final（未被修改）
    
    Runnable runnable = () -> System.out.println(num); // 合法
    
    // num = 20; // 错误：修改后不再是 effectively final，Lambda 无法访问
}
```

#### 2. 访问成员变量 / 静态变量：无限制

Lambda 表达式可自由访问和修改外部类的成员变量（实例变量）或静态变量：

```java
public class LambdaVarTest {
    private int instanceVar = 10; // 成员变量
    private static int staticVar = 20; // 静态变量

    public void testMemberVar() {
        Runnable runnable = () -> {
            instanceVar++; // 合法：修改成员变量
            staticVar++;   // 合法：修改静态变量
            System.out.println(instanceVar + ", " + staticVar);
        };
        runnable.run(); // 输出：11, 21
    }
}
```

