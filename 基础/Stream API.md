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

### 5. 其他特殊方式

- 从文件创建：`Files.lines(Path path)` 读取文件每行内容为 Stream：
```java
try {  
    Stream<String> fileStream = Files.lines(Paths.get("C:\\Users\\zcy\\Desktop\\test.txt"), StandardCharsets.UTF_8);  
    fileStream.forEach(System.out::println);  
}catch (IOException e)  
{  
    e.printStackTrace();  
}
```

- 基本类型范围流：`IntStream.range()`/`rangeClosed()`（LongStream/DoubleStream 同理）
```java
IntStream rangeStream = IntStream.range(1, 5); // 1,2,3,4（左闭右开）
IntStream rangeClosedStream = IntStream.rangeClosed(1, 5); // 1,2,3,4,5（左闭右闭）
```

## Stream 的操作

Stream 操作分为两类：**中间操作**（构建流水线）和 **终端操作**（触发执行并返回结果）。

### 1. 中间操作（Intermediate）

返回新的 Stream，**懒执行**（仅记录操作，不实际处理数据），分为：

- **无状态操作**：操作不依赖其他元素（如 filter、map），并行处理效率高；
- **有状态操作**：操作依赖其他元素（如 sorted、distinct），需缓存元素，并行成本高。

| 操作方法                            | 作用                                    | 示例（以 List<String> list = Arrays.asList ("apple", "banana", "cherry") 为例）   |
| ------------------------------- | ------------------------------------- | -------------------------------------------------------------------------- |
| `filter(Predicate)`             | 过滤满足条件的元素                             | `list.stream().filter(s -> s.length() > 5)` // 保留长度 > 5 的元素（banana、cherry） |
| `map(Function)`                 | 元素一对一转换（类型 / 值）                       | `list.stream().map(String::toUpperCase)` // 转大写（APPLE、BANANA、CHERRY）       |
| `flatMap(Function)`             | 元素一对多转换（将每个元素转为 Stream，再合并为一个 Stream） | `list.stream().flatMap(s -> Stream.of(s.split("")))` // 拆分为单个字符流           |
| `peek(Consumer)`                | 遍历元素（调试用，不修改元素）                       | `list.stream().peek(System.out::println).count()` // 打印元素并计数               |
| `distinct()`                    | 去重（基于 equals ()）                      | `Stream.of(1,2,2,3).distinct()` // 1,2,3                                   |
| `sorted()`/`sorted(Comparator)` | 自然排序 / 自定义排序                          | `list.stream().sorted(Comparator.comparing(String::length))` // 按长度排序      |
| `limit(long n)`                 | 截取前 n 个元素（短路操作）                       | `list.stream().limit(2)` // apple、banana                                   |
| `skip(long n)`                  | 跳过前 n 个元素                             | `list.stream().skip(1) // banana、cherry`                                   |
### 2. 终端操作（Terminal）

触发流的执行，返回非 Stream 类型结果，流执行后关闭。分为：

- **非短路操作**：需处理所有元素（如 collect、forEach）；
- **短路操作**：无需处理所有元素（如 findFirst、anyMatch），提升效率。

| 操作方法                      | 作用                         | 示例                                                                  |
| ------------------------- | -------------------------- | ------------------------------------------------------------------- |
| `forEach(Consumer)`       | 遍历元素（无返回值）                 | `list.stream().forEach(System.out::println)` // 打印所有元素              |
| `collect(Collector)`      | 收集元素到集合 / 自定义结构（核心操作）      | `list.stream().collect(Collectors.toList())` // 收集为 List            |
| `reduce()`                | 归约：将元素合并为单个值               | `Stream.of(1,2,3).reduce(0, Integer::sum)` // 求和（结果 6）              |
| `count()`                 | 返回元素个数（long 类型）            | `list.stream().count()` // 3                                        |
| `max(Comparator)`/`min()` | 返回最大 / 最小元素（Optional<T>）   | `list.stream().max(Comparator.comparing(String::length))` // cherry |
| `anyMatch(Predicate)`     | 是否存在满足条件的元素（boolean）       | `list.stream().anyMatch(s -> s.startsWith("a"))` // true            |
| `allMatch(Predicate)`     | 是否所有元素满足条件（boolean）        | `list.stream().allMatch(s -> s.length() > 3)` // true               |
| `noneMatch(Predicate)`    | 是否无元素满足条件（boolean）         | `list.stream().noneMatch(s -> s.isEmpty())` // true                 |
| `findFirst()`             | 返回第一个元素（Optional<T>，串行流稳定） | `list.stream().findFirst()` // Optional[apple]                      |
| `findAny()`               | 返回任意元素（Optional<T>，并行流效率高） | `list.parallelStream().findAny()` // 可能返回任意元素                       |
`reduce` 有三种重载，适配不同场景：

```java
// 1. 无初始值（返回Optional<T>，避免空流）
Optional<Integer> sum1 = Stream.of(1,2,3).reduce(Integer::sum);

// 2. 有初始值（返回T，空流返回初始值）
Integer sum2 = Stream.of(1,2,3).reduce(0, Integer::sum);

// 3. 并行流优化（初始值+累加器+组合器）
Integer sum3 = Stream.of(1,2,3).parallel().reduce(0, (a,b)->a+b, (a,b)->a+b);
```

## 核心工具：Collector 收集器

`collect()` 依赖 `Collector` 接口，`java.util.stream.Collectors` 提供了大量静态工具方法，满足常见收集需求。

