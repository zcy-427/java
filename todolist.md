
```tasks

```

### 第一阶段：Java 入门（基础知识）

- 核心基础：基础语法、程序的生命周期、数据类型、变量与作用域、类型转换
- 配套基础：字符串与方法、数学运算、数组、条件语句、循环、面向对象编程基础

### 第二阶段：面向对象编程（OOP 核心）

- OOP 基础：类与对象、属性与方法、访问修饰符、static 关键字、final 关键字、嵌套类、包
- OOP 进阶：对象生命周期、继承、抽象、方法链、封装、接口、枚举、记录（Record）、方法重载 / 重写、初始化块、静态绑定 vs 动态绑定、值传递 / 引用传递

### 第三阶段：核心能力扩展

- 基础扩展：异常处理、Lambda 表达式、注解、模块、Optional 类
- 集合框架：数组 vs ArrayList、Set、Map、队列、双端队列、栈、迭代器、泛型集合

### 第四阶段：高级核心能力

- 并发编程：volatile 关键字、Java 内存模型、虚拟线程、线程
- 专项能力：加密技术、日期与时间、网络编程、正则表达式
- 函数式编程：高阶函数、函数式接口、函数组合、Stream API

### 第五阶段：构建与 Web 框架

- 构建工具：Maven、Gradle、Bazel
- Web 框架（推荐 Spring Boot）：Spring（Spring Boot）、Quarkus、Javalin、Play Framework

### 第六阶段：数据、测试与日志

- 数据库访问：JDBC、EBean、Hibernate、Spring Data JPA
- 测试：单元测试（JUnit、TestNG）、集成测试（REST Assured、JMeter）、行为测试（Cucumber-JVM）、Mocking（Mockito）
- 日志框架：Logback、Log4j2、SLF4J、TinyLog



这段代码的核心是**因 `map` 方法的特性，导致 Optional 嵌套（`Optional<Optional<String>>`）**，具体解析如下：

1. **第一步：`Optional.of(user)`**
    
    先将非 null 的 `user` 包装成 `Optional<User>`（外层 Optional，值为 User 对象）。
    
2. **第二步：`.map(User::getAddress)`**
    
    `map` 会对 Optional 中的值（这里是 User 对象）执行映射：
    
    调用 `user.getAddress()`，而该方法返回的是 `Optional<Address>`（根据代码中 User 类的定义）。
    
    因此，映射后得到 **`Optional<Optional<Address>>`**（外层 Optional 包裹内层 Optional<Address>）。
    
3. **第三步：.map(addr -> Optional.ofNullable(addr.getCity()))** 
    
    此时 `map` 处理的是上一步结果中的 “内层值”—— 也就是 `Optional<Address>` 里的 `Address` 对象（`addr` 即 Address 实例）。
    
    调用 `addr.getCity()` 得到 String 类型的城市（可能为 null），再用 `Optional.ofNullable` 包装成 `Optional<String>`。
    
    最终，整个链式调用的结果就成了 **`Optional<Optional<String>>`**（外层 Optional 包裹内层 Optional<String>），即代码中的 `nestedOpt`。
    

简单说：`map` 会把 “映射结果” 重新包装成 Optional，若映射结果本身已是 Optional，就会形成 “Optional 套 Optional” 的嵌套结构。