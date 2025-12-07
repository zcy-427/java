# Comparator与Comparable接口

**`Comparable`** 和 **`Comparator`** 是用于解决**对象之间比较排序**的核心接口

---

### 一、`Comparable` 接口：内部比较器

`Comparable` 是**`java.lang`**包下的接口，属于**内部比较器**—— 即需要**待比较的类自身实现该接口**，通过重写 `compareTo()` 方法定义默认的比较规则。

`Comparable`仅包含一个抽象方法

```java
public int compareTo(T o);
```

实例：假设有一个Student类，我们将其集合按照年龄升序排列

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

class Student implements Comparable<Student>
{
    private String name;
    private int age;

    public Student() {
    }

    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public int getAge() {
        return age;
    }

    public String getName() {
        return name;
    }
    //升序排列
    @Override
    public int compareTo(Student o) {
        //简化写法Integer.compare(this.age,o.getAge());
        return this.age-o.getAge();
    }
}
public class Comparator_and_Comparable_demo {
    public static void main(String[] args) {
        List<Student> list=new ArrayList<>();
        list.add(new Student("zhang",10));
        list.add(new Student("wang",8));
        list.add(new Student("li",7));

        Collections.sort(list);// Collections.sort会自动调用Student的compareTo方法
        for(Student s:list)
        {
            System.out.println(s.getName()+" "+s.getAge());
        }
    }
}
```

### 二、`Comparator` 接口：外部比较器

`Comparator` 是**`java.util`**包下的接口，属于**外部比较器**—— 即不需要修改待比较类的源码，而是**单独定义一个比较器类（或匿名类 / Lambda）** 实现该接口，通过重写 `compare()` 方法定义灵活的比较规则。

`Comparator` 接口的核心抽象方法是：

```java
int compare(T o1, T o2);
```

且在JDK8后，该接口被标记为函数式接口，支持 Lambda 表达式；同时提供了大量静态方法（如 `comparing()`、`thenComparing()`）和默认方法，简化比较器的编写。

示例：

**自定义比较器类**

```java
// 按姓名长度升序的比较器
public class NameLengthComparator implements Comparator<Student> {
    @Override
    public int compare(Student o1, Student o2) {
        return o1.getName().length() - o2.getName().length();
    }
}

// 按年龄降序的比较器
public class AgeDescComparator implements Comparator<Student> {
    @Override
    public int compare(Student o1, Student o2) {
        return o2.getAge() - o1.getAge(); // 降序：o2 - o1
    }
}
```

**匿名内部比较类**

```java
Collections.sort(students, new Comparator<Student>() {
    @Override
    public int compare(Student o1, Student o2) {
        return o2.getAge() - o1.getAge(); // 年龄降序
    }
});
```

**Lambda 表达式（Java 8+）**

```java
// 年龄降序
Collections.sort(students, (o1, o2) -> o2.getAge() - o1.getAge());

// 姓名字典序
Collections.sort(students, (o1, o2) -> o1.getName().compareTo(o2.getName()));
```

**方法引用 + 链式比较（Java 8+）**

```java
// 先按年龄升序，年龄相同则按姓名字典序
Comparator<Student> comparator = Comparator.comparing(Student::getAge)
                                           .thenComparing(Student::getName);
Collections.sort(students, comparator);
```

这里提一下方法引用+链式比较，`comparing()`中的比较内容是第一优先级，`thenComparing()`中的为第2优先级，以此类推，后面还可以通过`thenComparing()`继续添加条件

### 总结一下

1. **用 `Comparable`**：当你是类的设计者，且该类只有一种核心排序规则（如 `String` 按字典序、`Integer` 按数值大小）。
2. 用 `Comparator`：
   - 类是第三方提供的（无法修改源码）；
   - 类需要多种排序规则（如学生既需要按年龄排，也需要按姓名排）；
   - 排序规则需要动态调整（如运行时选择升序 / 降序）。

