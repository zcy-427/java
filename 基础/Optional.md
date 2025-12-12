`Optional` 是 Java 8 引入的一个**容器类**，用于**优雅处理空值（null）**，避免繁琐的 `null` 检查和 `NullPointerException`（NPE）。它的核心思想是：**将可能为 null 的值包装到 Optional 对象中，通过统一的 API 处理存在 / 不存在两种状态**，而非直接操作 null。

## 设计的目的

1. 消除代码中的 `if (obj != null)` 嵌套（即 “空指针防御式编程”）；
2. 明确表达 “值可能不存在” 的语义，提升代码可读性；
3. 提供丰富的 API 简化空值处理逻辑；
4. 不替代 null，而是**封装** null 的处理逻辑。

## 基本特性

- `Optional` 是一个**不可变**的容器：
    - 包含一个非 null 值（`present` 状态）；
    - 或为空（`empty` 状态）。
- 不能被继承（`final` 类），且没有公共构造方法（通过静态方法创建实例）；
- 不建议用于：
    - 类的字段（序列化时会丢失值）；
    - 方法参数（会增加调用方复杂度，建议直接判空）；
    - 集合元素（集合本身可处理空，Optional 会增加内存开销）。

## 创建 Optional 实例

`Optional` 提供 3 个静态方法创建实例，**禁止直接 new Optional ()**：

### 1.`Optional.empty()`
创建一个空的 `Optional` 实例（empty 状态）。

```java
Optional<String> emptyOpt = Optional.empty();
```

### 2. `Optional.of(T value)`
创建包含非 null 值的 `Optional`，若传入 null 则直接抛出 `NullPointerException`。

```java
String nonNullStr = "hello";
Optional<String> opt = Optional.of(nonNullStr); // 正常

Optional<String> nullOpt = Optional.of(null); // 抛出 NPE
```

### 3. `Optional.ofNullable(T value)`
创建包含可能为 null 值的 `Optional`：
- 若 value 非 null → present 状态；
- 若 value 为 null → empty 状态（最常用）。

```java
String nullableStr = null;
String nonullableStr ="no null";
Optional<String> opt1= Optional.ofNullable(nullableStr); // empty 状态
optional<String> opt2= Optional.ofNullable(nonullableStr);// present 状态
```

## 核心 API

### 1.判断值是否存在（或者说判断状态）

#### `isPresent()`
返回 `boolean`：true 表示值存在，false 表示空（**不推荐优先使用**，本质还是判空，未体现 Optional 优势）。

```java
Optional<String> opt = Optional.of("hello");
System.out.println(opt.isPresent()); // true

Optional<String> emptyOpt = Optional.empty();
System.out.println(emptyOpt.isPresent()); // false
```
#### `isEmpty()`（Java 11+）
`isPresent()` 的反向方法，更符合语义（空时返回 true）。

```java
System.out.println(emptyOpt.isEmpty()); // true
```

### 2. 获取值

#### `get()`
获取 Optional 中的值：
- 若值存在 → 返回值；
- 若值为空 → 抛出 `NoSuchElementException`（**慎用**，需先通过 `isPresent()` 检查）。

```java
Optional<String> opt = Optional.of("hello");
System.out.println(opt.get()); // hello

Optional<String> emptyOpt = Optional.empty();
emptyOpt.get(); // 抛出 NoSuchElementException
```

### 3.安全消费值（推荐）

#### `ifPresent(Consumer<? super T> action)`
若值存在，则执行传入的消费逻辑；若为空，则不做任何操作（**替代 if (obj != null) { ... }**）。

```java
Optional<String> opt = Optional.of("hello");
opt.ifPresent(s -> System.out.println("值为：" + s)); // 输出：值为：hello

Optional<String> emptyOpt = Optional.empty();
emptyOpt.ifPresent(s -> System.out.println(s)); // 无操作
```
#### `ifPresentOrElse(Consumer<? super T> action, Runnable emptyAction)`（Java 9+）
值存在时执行 `action`，为空时执行 `emptyAction`。


```java
Optional<String> opt = Optional.empty();
opt.ifPresentOrElse(
    s -> System.out.println("值：" + s),
    () -> System.out.println("值不存在")
); // 输出：值不存在
```