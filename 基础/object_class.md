# object

object类是java所有类的**顶层父类**，其本身没有父类，Java 中没有明确写 `extends Object` 的类，编译器会默认隐式添加

---

## 属性与构造器

object类没有定义属性，其本身的构造器也只有一个空参的构造器

```java
public object() {}
```

---

## 核心方法

### 1.`toString()`：对象的字符串表示

返回对象的 “字符串描述”，用于快速查看对象的属性信息（日志打印、调试常用）。

jdk源码的默认实现：

```java
public String toString() {
    return getClass().getName() + "@" + Integer.toHexString(hashCode());
}
```

格式：`全类名@哈希码的十六进制`（例如 `com.example.User@1b6d3586`）；

大多数情况下都会对其进行重写

```c++
class User {
    private String name;
    private int age;

    // 重写 toString()，打印对象属性
    @Override
    public String toString() {
        return "User{name='" + name + "', age=" + age + "}";
    }
}

// 测试
public class Test {
    public static void main(String[] args) {
        User user = new User("张三", 20);
        System.out.println(user); // 直接打印对象，默认调用 toString()
        // 输出：User{name='张三', age=20}（而非默认的全类名@哈希码）
    }
}
```

### 2. `equals(Object obj)`：对象相等性判断

判断两个对象是否 “逻辑相等”（而非物理相等），默认实现等价于 `==`。

jdk源码的默认实现：

```java
public boolean equals(Object obj) {
    return (this == obj);
}
```

#### 重写 `equals()` 的核心原则（必须遵守）

1. **自反性**：`x.equals(x)` 必须返回 `true`；
2. **对称性**：若 `x.equals(y)` 为 `true`，则 `y.equals(x)` 也必须为 `true`；
3. **传递性**：若 `x.equals(y)` 和 `y.equals(z)` 为 `true`，则 `x.equals(z)` 也为 `true`；
4. **一致性**：多次调用 `x.equals(y)`，结果始终一致（对象属性未修改时）；
5. **非空性**：`x.equals(null)` 必须返回 `false`。

```java
class User {
    private String name;
    private int age;

    @Override
    public boolean equals(Object o) {
        // 1. 自身比较（地址相同，直接返回true）
        if (this == o) return true;
        // 2. 非空判断 + 类型判断（避免ClassCastException）
        if (o == null || getClass() != o.getClass()) return false;
        // 3. 强制转型，比较核心属性（基本类型用==，引用类型用equals()）
        User user = (User) o;
        return age == user.age && Objects.equals(name, user.name);
    }
}
```

注意：引用类型属性（如 `name`）需用 `Objects.equals(a, b)`（避免空指针异常），而非直接 `a.equals(b)`。

### 3. `hashCode()`：对象的哈希码

返回对象的**哈希码（int 类型整数）**，用于哈希表（`HashMap`、`HashSet`、`Hashtable` 等）的快速查找（哈希桶定位）。

默认实现：

```java
 public native int hashCode();
```

`native` 方法（JVM 底层实现），通常根据对象的**内存地址**计算哈希码（不同对象哈希码大概率不同）；

- **与 `equals()` 的强绑定关系（必须遵守）**

若 `x.equals(y) == true`，则 `x.hashCode()` 必须等于 `y.hashCode()`（否则哈希表会出错，如 `HashMap` 无法找到元素）；

若 `x.hashCode() == y.hashCode()`，则 `x.equals(y)` 不一定为 `true`（哈希冲突，允许不同对象哈希码相同）；

所以说**如果重写了`equal`,则必须重写`hashcode`**，否则会破坏哈希表的正确性。

```java
class User {
    private String name;
    private int age;

    @Override
    public boolean equals(Object o) { /* 省略，同上 */ }

    @Override
    public int hashCode() {
        // 用 Objects.hash() 快速生成哈希码（自动处理null）
        return Objects.hash(name, age);
    }
}
```

### 4. `getClass()`：获取对象的运行时类型

返回对象的**运行时类型（Class 对象）**，用于反射、类型判断等场景。

默认实现：

```java
 public final native Class<?> getClass();
```

native方法，底层由JVM的c/c++代码实现

- **不可重写**：被 `final` 修饰，子类无法修改（保证返回真实的运行时类型）；
- **区别于 `instanceof`**：`getClass()` 严格判断类型（无继承关系匹配），`instanceof` 会匹配子类（如 `new Cat() instanceof Animal` 为 `true`）；

```java
abstract class Animal {}
class Cat extends Animal {}

public class Test {
    public static void main(String[] args) {
        Animal animal = new Cat();
        
        // getClass() 返回运行时类型（Cat）
        System.out.println(animal.getClass()); // 输出：class com.example.Cat
        System.out.println(animal.getClass() == Cat.class); // true
        System.out.println(animal.getClass() == Animal.class); // false
        
        // instanceof 匹配继承关系
        System.out.println(animal instanceof Cat); // true
        System.out.println(animal instanceof Animal); // true
    }
}
```

### 5. `wait()` 系列：线程等待（线程通信）

3个方法签名：

```java
// 1. 无限期等待，直到被 notify()/notifyAll() 唤醒
public final void wait() throws InterruptedException

// 2. 限时等待（毫秒），超时自动唤醒
public final native void wait(long timeout) throws InterruptedException

// 3. 限时等待（毫秒+纳秒），超时自动唤醒（纳秒精度低，实际很少用）
public final void wait(long timeout, int nanos) throws InterruptedException
```

让当前线程**释放对象锁**，进入该对象的 “等待队列”，直到被唤醒或超时（线程通信的核心方法，与 `notify()`/`notifyAll()` 配合使用）。

//todo ...
