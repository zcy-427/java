# Annotation（注解）

注解（Annotation）是 JDK 1.5 引入的核心特性，本质是**代码的元数据（描述数据的数据）**—— 它不会直接影响代码的执行逻辑，但能为编译器、框架或运行时工具提供额外信息，从而实现自动化处理（如编译检查、代码生成、配置解析等）。

---

## 注解与注释的区别

| 特性     | 注解（Annotation）                      | 注释（Comment）                 |
| -------- | --------------------------------------- | ------------------------------- |
| 作用对象 | 编译器、JVM、框架工具                   | 开发人员（阅读代码）            |
| 处理方式 | 可被代码（反射）或工具解析              | 编译器直接忽略，不进入字节码    |
| 影响范围 | 可影响编译过程或运行时行为              | 仅对代码可读性负责，无实际功能  |
| 示例     | `@Override`、`@Test`、`@RequestMapping` | `// 这是注释`、`/* 多行注释 */` |

## 注解的分类

### 内置注解（JDK 自带）

| 注解                   | 作用                                                         |
| ---------------------- | ------------------------------------------------------------ |
| `@Override`            | 标记方法重写父类 / 接口的方法，编译器会检查方法签名是否匹配  |
| `@Deprecated`          | 标记类、方法或字段已过时，使用时编译器会给出警告             |
| `@SuppressWarnings`    | 抑制编译器特定警告（如未使用变量、类型转换不安全等）         |
| `@FunctionalInterface` | 标记函数式接口（仅含一个抽象方法），编译器检查接口是否符合规范 |
| `@SafeVarargs`         | 抑制泛型可变参数的类型安全警告（JDK 7+）                     |

```java
import java.util.ArrayList;
import java.util.List;

public class BuiltInAnnotationDemo {
    // @Override：检查是否正确重写toString()
    @Override
    public String toString() {
        return "BuiltInAnnotationDemo";
    }

    // @Deprecated：标记方法已过时
    @Deprecated
    public void oldMethod() {
        System.out.println("这个方法已过时，请使用newMethod()");
    }

    // @SuppressWarnings：抑制"未使用变量"的警告
    @SuppressWarnings("unused")
    public void suppressWarningDemo() {
        int unusedVar = 10; // unusedVard定义了但是未使用，不会触发警告
    }

    // @FunctionalInterface：标记函数式接口
    @FunctionalInterface
    interface MyFunctionalInterface {
        void doSomething();
    }

    public static void main(String[] args) {
        BuiltInAnnotationDemo demo = new BuiltInAnnotationDemo();
        demo.oldMethod(); // 编译器会提示方法已过时
    }
}
```

对于@`SuppressWarnings`，其中的参数不止这一种

| 警告类型      | 含义                                                         |
| ------------- | ------------------------------------------------------------ |
| `unchecked`   | 未检查的类型转换（如集合强制类型转换：`List list = new ArrayList(); List<String> strList = (List<String>) list;`） |
| `deprecation` | 使用已被标记为`@Deprecated`的类 / 方法 / 字段（过时 API）    |
| `rawtypes`    | 使用泛型的 “原始类型”（如`List list = new ArrayList();`而非`List<String>`） |
| `serial`      | 实现`Serializable`的类未声明`serialVersionUID`               |
| `unused`      | 未使用的变量、方法或参数（如定义了变量但未调用）             |
| `finally`     | `finally`块无法正常执行（如内部抛出异常）                    |
| `all`         | 抑制所有警告（**不推荐滥用**，会掩盖潜在问题）               |

---

###  元注解（定义注解的注解）

元注解是**用于修饰注解的注解**，负责定义注解的 “生命周期”“作用目标” 等属性。JDK 提供了 5 个元注解：

| 元注解        | 作用                                                         |
| ------------- | ------------------------------------------------------------ |
| `@Retention`  | 指定注解的**保留策略**（生命周期），可选值为`RetentionPolicy`枚举：- `SOURCE`：仅保留在源码，编译后丢弃（如`@Override`）- `CLASS`：保留到字节码，运行时 JVM 不加载（默认）- `RUNTIME`：保留到运行时，可通过反射获取（如 Spring 注解） |
| `@Target`     | 指定注解的**作用目标**（可修饰的元素类型），可选值为`ElementType`枚举：- `TYPE`：类、接口、枚举- `METHOD`：方法- `FIELD`：字段（成员变量）- `PARAMETER`：方法参数- `CONSTRUCTOR`：构造方法- `ANNOTATION_TYPE`：注解本身- `LOCAL_VARIABLE`：局部变量- `MODULE`：模块（JDK 9+） |
| `@Documented` | 标记注解会被`javadoc`工具包含到 API 文档中                   |
| `@Inherited`  | 标记注解可被**子类继承**（仅对`TYPE`级别的注解生效）         |
| `@Repeatable` | 允许注解在同一元素上重复使用（JDK 8+）                       |

示例：元注解的组合使用

```java
import java.lang.annotation.*;

// 定义一个自定义注解，通过元注解配置其特性
@Retention(RetentionPolicy.RUNTIME) // 运行时保留，可反射获取
@Target({ElementType.TYPE, ElementType.METHOD}) // 可修饰类和方法
@Documented // 生成Javadoc时包含该注解
@Inherited // 子类可继承该注解
public @interface MyAnnotation {
    String value() default "默认值"; // 注解元素（成员变量）
    int num() default 0;
}
```

### 自定义注解

开发者可根据需求定义自己的注解，语法遵循固定规则：

```java
[元注解]
public @interface 注解名 {
    // 注解元素（类似方法声明，但无方法体）
    类型 元素名() [default 默认值];
}
```

示例：实现 “日志标记” 功能

**1.自定义注解**

```java
import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME) // 运行时保留
@Target(ElementType.METHOD) // 仅修饰方法
public @interface LogAnnotation {
    //日志描述（默认为空）
    String logdesc() default "";

    //是否记录执行的时间(默认执行)
    boolean logtime() default true;
}
```

**2.通过反射解析注解**

```java
import java.lang.reflect.Method;
import java.time.Duration;
import java.time.LocalDateTime;

public class LogAnnotationProcessor {
    // 执行带LogAnnotation的方法，并解析注解
    public static void executeWithLog(Object obj) throws Exception {
        // 获取类的所有方法
        Method[] methods = obj.getClass().getDeclaredMethods();
        for (Method method : methods) {
            // 判断方法是否有LogAnnotation注解
            if (method.isAnnotationPresent(LogAnnotation.class)) {
                LogAnnotation annotation = method.getAnnotation(LogAnnotation.class);
                // 获取注解元素值
                String desc = annotation.desc();
                boolean recordTime = annotation.recordTime();

                System.out.println("===== 执行方法：" + method.getName() + " =====");
                if (!desc.isEmpty()) {
                    System.out.println("日志描述：" + desc);
                }

                // 记录执行时间
                LocalDateTime start = null;
                if (recordTime) {
                    start = LocalDateTime.now();
                }

                // 执行方法
                method.invoke(obj);

                // 输出执行时间
                if (recordTime) {
                    LocalDateTime end = LocalDateTime.now();
                    long duration = Duration.between(start, end).toMillis();
                    System.out.println("执行耗时：" + duration + "ms");
                }
            }
        }
    }
}
```

注解本身只是**附着在代码上的元数据**，不包含任何可执行逻辑，就像给代码贴了 “标签” 却没有说明如何解读这些标签。而**解析注解（尤其是通过反射解析运行时注解）**，就是将这些 “标签信息” 转化为**实际的业务逻辑、框架行为或自动化操作**的核心过程 —— 这是注解能发挥作用的唯一方式。**运行时注解（`RetentionPolicy.RUNTIME`）的元数据会保留在字节码中，只有反射能在程序运行时动态获取这些元数据，并根据元数据执行对应的逻辑**。

**3.使用注解**

```java
public class UserService {
    @LogAnnotation(desc = "用户登录操作", recordTime = true)
    public void userLogin() {
        try {
            Thread.sleep(100); // 模拟业务耗时
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("用户登录成功！");
    }

    @LogAnnotation(desc = "获取用户信息")
    public void getUserInfo() {
        System.out.println("获取用户信息：ID=1，Name=张三");
    }

    public static void main(String[] args) throws Exception {
        LogAnnotationProcessor.executeWithLog(new UserService());
    }
}
```

---

## 注解的解析方式

注解的价值在于被解析处理，根据保留策略不同，解析方式分为两类：

#### 1. 编译时解析（`RetentionPolicy.SOURCE/CLASS`）

由编译器或 APT（Annotation Processing Tool）工具解析，用于生成代码、检查语法等：

- 示例：`@Override`由编译器直接检查方法签名；Lombok 的`@Data`通过 APT 在编译时生成 getter/setter 方法。

#### 2. 运行时解析（RetentionPolicy.RUNTIME）

通过 Java 反射机制解析，是框架最常用的方式：

- 核心 API：`Class.isAnnotationPresent()`、`Method.getAnnotation()`、`Field.getAnnotations()`等；
- 示例：Spring 的`@Autowired`通过反射识别需要注入的字段，`MyBatis `的`@Select`通过反射获取 SQL 语句。

---

## 高级用法——重复注解（@Repeatable）

JDK 8 之前，一个元素上只能添加一次相同注解；JDK 8 引入`@Repeatable`，允许同一注解重复使用。

示例：

```java
import java.lang.annotation.*;
//定义可重复注解
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Repeatable(RolesContainer.class) //2.指定容器类型
@interface Role {
    String value();
}
//定义注解容器
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@interface RolesContainer {
    Role[] value();
}
@Role("Admin")
@Role("User")
public class re_at_demo {
    public static void main(String[] args) {
        //获取所有注解
        Role[] roles=re_at_demo.class.getAnnotationsByType(Role.class);
        for(Role role:roles) {
            System.out.println("角色: " + role.value());
        }
    }
}
```

## 注解的典型应用场景

1. **框架核心机制**：Spring 的`@Controller`/`@Service`/`@Autowired`，MyBatis 的`@Insert`/`@Update`，JUnit 的`@Test`等；
2. **编译期代码生成**：Lombok 的`@Data`/`@Slf4j`，MapStruct 的`@Mapper`；
3. **配置替代**：用注解替代 XML 配置（如 SpringBoot 的注解驱动开发）；
4. **权限 / 日志控制**：自定义注解实现接口权限校验、方法日志记录；
5. **数据校验**：JSR 380 的`@NotNull`/`@Size`（Hibernate Validator）。
