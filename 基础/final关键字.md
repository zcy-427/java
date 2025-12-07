# final

final 是 Java 中用于**限制 “可变性”** 的核心关键字，核心作用是「锁定」—— 修饰类、方法、变量时，分别表示 “不可继承”“不可重写”“不可修改”。

---

### 1.修饰类

被`final`修饰的类意味着无法被继承，并且其下的方法会隐含`final`关键字，意味着无法被重写

### 2.修饰方法

被`final`修饰的方法意味着**无法被重写**，但是**可以进行重载**，这并不冲突

### 3.修饰变量

被`final`修饰的变量，无法被再次赋值，这意味着开发者只有在声明时对其赋值，或者在声明时不赋值，而是在使用前进行赋值，**变量的值一旦赋值，就不能再改变**

这里需要区别不同的变量

对与基本类型变量，其无法被多次赋值；对与引用类型的变量，其地址不能再改变，但是其内容可以进行改变

```java
public class user {
    private int age;
    private String name;

    public void setName(String name) {
        this.name = name;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public user (int age, String name) {
        this.age = age;
        this.name = name;
    }
}
public class Main {
    public static void main(String[] args) {
        final user s=new user(18,"zhang");
        //可以修改其内部属性
        s.setAge(10);
        s.setName("wang");
        //不可以修改引用地址
        //s=new user(18,"zhang");
    }
}
```

### 4.常量

final 修饰静态变量时，通常配合 `public` 修饰，成为「全局常量」

- 命名规范：常量名全部大写，多个单词用下划线分隔（如 `MAX_SIZE`）；
- 必须在声明时或静态代码块中初始化（不能在构造器中初始化，因为静态变量属于类，早于对象创建）；
- 全局可见，值不可变，适合存储配置参数（如端口号、版本号）。

示例：

```java
class Config {
    // 全局常量：声明时直接初始化（推荐）
    public static final int PORT = 8080;
    public static final String DEFAULT_CHARSET = "UTF-8";

    // 复杂常量：静态代码块中初始化（如读取配置文件）
    public static final String DB_URL;
    static {
        // 模拟读取外部配置
        DB_URL = "jdbc:mysql://localhost:3306/test";
    }
}
// 调用方式：类名.常量名（无需创建对象）
public class ConstantTest {
    public static void main(String[] args) {
        System.out.println("端口号：" + Config.PORT);
        System.out.println("数据库地址：" + Config.DB_URL);
    }
}
```

