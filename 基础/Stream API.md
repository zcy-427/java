Java 8 引入的 Stream API 是处理集合（Collection）的**声明式编程工具**，它以流水线式的方式操作数据源（集合、数组、I/O 等），结合 Lambda 表达式大幅简化集合处理代码，同时支持并行计算提升大数据量处理效率。

## 核心概念与特点

Stream（流）不是数据结构，而是**对数据源的操作序列**，核心特点如下：

|特点|说明|
|---|---|
|非存储性|不存储数据，仅操作数据源（集合、数组等），不修改原数据源（除非显式修改元素内部属性）|
|懒加载（延迟执行）|中间操作仅构建流水线，不立即执行；只有终端操作触发时，才会一次性执行所有中间操作|
|不可重复消费|流只能被消费一次（终端操作后流关闭），重复使用会抛出 `IllegalStateException`|
|支持并行处理|底层基于 Fork/Join 框架，可轻松实现并行计算，无需手动管理线程|
|函数式编程|依赖 Lambda 表达式，强调 “做什么” 而非 “怎么做”，代码|

## 如何创建Stream

### 1. 从集合创建（最常用）
所有 `Collection` 接口的实现类（List、Set、Queue 等）都提供 `stream()`（串行流）和 `parallelStream()`（并行流）方法：

```JAVA
List<String> list= Arrays.asList("a","b","c");  
//串行流  
Stream<String> stream1=list.stream();  
// 并行流  
Stream<String> parallelStream = list.parallelStream();  
```

### 2. 从数组创建
通过 `Arrays.stream()` 或 `Stream.of()`（底层调用 `Arrays.stream()`）创建：

```java
// 方式1：Arrays.stream  
String[] arr = {"x", "y", "z"};  
Stream<String> arrStream = Arrays.stream(arr);  
  
// 方式2：Stream.of（支持可变参数）  
Stream<String> ofStream = Stream.of("1", "2", "3");  
  
// 基本类型数组（用IntStream而非Stream<Integer>避免自动装箱）  
int[] intArr = {1, 2, 3};  
IntStream intStream = Arrays.stream(intArr);
```

### 3. 创建空流
用于避免空指针，返回空的 Stream：

```java
Stream<String> emptyStream = Stream.empty();
```

### 4. 创建无限流
通过 `generate()`（生成器）或 `iterate()`（迭代器）创建，需配合 `limit()` 限制元素数量：

```java
// 1. generate：基于Supplier生成无限流（元素无规律）
Stream<Double> randomStream = Stream.generate(Math::random).limit(5); // 5个随机数

// 2. iterate：基于种子值迭代生成（元素有规律）
Stream<Integer> numStream = Stream.iterate(1, n -> n + 2).limit(5); // 1,3,5,7,9
```

