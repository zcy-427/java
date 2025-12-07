# abstract

abstract 是 Java 中用于**构建抽象层**的核心关键字，核心作用是「定义抽象元素」—— 修饰类（抽象类）或方法（抽象方法），用于抽取共性、强制子类实现具体逻辑，是面向对象「抽象性」和「多态性」的重要体现。

----

abstract可以修饰两者，类与方法

### abstract类

被 `abstract` 修饰的类是「抽象类」，本质是 **“不完整的类”**，无法进行实例化，其主要作用是充当一个类模板

抽象类也可以包含所有普通类的元素，比如构造器，方法，属性等等

对与继承其的子类，如果不是抽象类，则必须实现其所有的抽象方法，反之，可暂不实现（延迟到更底层子类实现）。

```java
abstract public class abstract_class {
    protected String name;
    //构造器，供子类调用（子类通过 super() 初始化父类成员）
    public abstract_class (String name) {
        this.name = name;
    }
    //抽象方法仅声明，其子类必须实现该方法
    public abstract void doSomething();
}

```

子类：

```java
public class son_of_abstractclass extends abstract_class{
    public son_of_abstractclass(String name) {
        super(name);
    }

    @Override
    public void doSomething() {
        System.out.println(this.name);
    }
}
```

---

### abstract方法

被 `abstract` 修饰的方法是「抽象方法」，**只有方法签名（返回值、方法名、参数），没有方法体**

**关键特性**

- **必须在抽象类中**：普通类不能包含抽象方法（否则编译报错）；

- **无方法体**：不能写 `{}`，必须以 `;` 结束（如 `public abstract void run();`）；

- **子类必须重写**：非抽象子类必须实现所有抽象方法（用 `@Override` 标注）；

- 不能与某些关键字共存

  不能与 `final` 共存：`final` 方法禁止重写，`abstract` 方法强制重写，冲突；

  不能与 `static` 共存：`static` 方法属于类，不依赖对象，而抽象方法需要子类实例实现，冲突；

  不能与 `private` 共存：`private` 方法对子类不可见，无法重写，冲突。

示例同上；