# String

`String`类是处理字符串的核心类，位于`java.lang`包下

## 核心特性及其实现

1.**不可变性**

`String`是**final 类**（不可被继承），实现了`Serializable`（序列化）、`Comparable<String>`（可比较）、`CharSequence`（字符序列）接口。

其核心特性是**不可变性**：内部存储字符的数组被定义为`private final char[] value`（JDK8 及之前），或`private final byte[] value`（JDK9 及之后，配合`coder`标记编码格式），且没有提供修改数组的方法。任何对字符串的修改操作（如拼接、替换）都会返回**新的 String 对象**，原对象不变。

2.**底层的优化（jdk9+)**

JDK9 之前，`String`用`char[]`存储（每个 char 占 2 字节），但多数字符串是 ASCII 字符（仅需 1 字节）。JDK9 后改为`byte[]`，并通过`private final byte coder`标记编码：

- `LATIN1`（0）：存储 ASCII 字符，占 1 字节 / 字符；
- `UTF16`（1）：存储非 ASCII 字符，占 2 字节 / 字符。

3.**字符常量池（String pool）**

字符串常量池是 JVM 为优化字符串创建设计的**内存区域**（JDK7 后从永久代移至堆），存储唯一的字符串字面量。

- **字面量创建**：`String s = "abc"`，JVM 先检查常量池，存在则直接引用，不存在则创建并放入；
- **new 创建**：`String s = new String("abc")`，会在堆中创建新对象，同时常量池若不存在 "abc" 则创建；
- `intern()`方法：调用该方法时，若常量池已存在当前字符串，则返回常量池引用；否则将当前字符串加入常量池并返回引用。例如：

```java
public class StringTest {
    public static void main(String[] args) {
        String str ="abc".intern();
        String str2="abc" ;
        System.out.println(str==str2);//输出true
    }
}
```

---

## 常用方法

| 方法分类        | 典型方法                                                     |
| --------------- | ------------------------------------------------------------ |
| 比较与哈希      | `equals(Object)`（内容比较）、`==`（引用比较）、`hashCode()`、`compareTo(String)` |
| 字符 / 长度操作 | `charAt(int index)`、`length()`、`isEmpty()`（是否空串）、`isBlank()`（是否空白） |
| 子串与查找      | `substring(int begin)`、`indexOf(String)`、`lastIndexOf(char)` |
| 修改与替换      | `replace(char old, char new)`、`replaceAll(String regex)`、`trim()`（去首尾空格）、`strip()`（支持 Unicode 空白） |
| 拼接与转换      | `concat(String)`、`toLowerCase()`、`toUpperCase()`、`valueOf(Object)`（静态方法，转字符串） |

```java
public class StringTest {
    public static void main(String[] args) {
        String str="hello world,Amadeus";
        //获取字符串长度
        System.out.println("字符串长度："+str.length());

        //获取指定字符的索引
        int index=str.indexOf('e');//该方法获取到的是字符e在字符串中第一次出现的索引
        System.out.println("index："+index);
        int lastindex=str.lastIndexOf('e');//该方法获取到的是字符e在字符串中最后一次出现的索引
        System.out.println("lastindex："+lastindex);

        //对于子串,其索引为第一个字符的索引
        int index2=str.indexOf("world");
        System.out.println("index2："+index2);

        //获取指定索引位置的字符
        char ch=str.charAt(6);
        System.out.println("ch："+ch);

        //去除字符串首尾的空格
        String str2="   hello   ";
        System.out.println("str2去除空格后："+str2.trim());

        //转大小写
        String str3="AbCdeF";
        System.out.println("str3大写："+str3.toUpperCase());
        System.out.println("str3小写："+str3.toLowerCase());

        //替换
        System.out.println("str替换："+str.replace("world","Java"));

        //分割
        String str4="a,b,c,d,e";
        String[] parts=str4.split(",");
        for (String part : parts) {
            System.out.println("part: " + part);
        }

        //组合
        String a="Hello";
        String b="World";
        String c=a+b;
        String concat=a.concat(b);
        System.out.println("c: "+c);
        System.out.println("concat: "+concat);

        //开头与结尾的判断
        System.out.println("str是否以hello开头："+str.startsWith("hello"));
        System.out.println("str是否以Amadeus结尾："+str.endsWith("Amadeus"));

        //判断是否包含子串
        System.out.println("str是否包含world："+str.contains("world"));

        //比较字符串是否相等
        String x="abc";
        String x1="abc";
        String y=new String("abc");
        String y1=new String("abc");
        System.out.println(x==x1);//true,因为字符串常量池的存在
        System.out.println(y==y1);//false,因为new出来的对象在堆内存中
        System.out.println(x==y);//false,指向的内存地不同
        System.out.println(x.equals(y));//true,内容相同,equals方法比较内容
    }
}
```

对与其中的组合方法，其实存在一定的性能消耗，这里推荐使用`StringBuilder`中的`append`方法

```java
StringBuilder s=new StringBuild();
s.append("abc");
s.append("def");
 System.out.println(s.tuString());
```

结果是`abcdef`

---

## 与String相关的类

`StringBuffer`（可变、线程安全）

- **特性**：可变字符序列，线程安全（所有方法加`synchronized`），底层用`char[]`（JDK9 后`byte[]`）存储，初始容量 16，扩容时新容量 = 旧容量 * 2+2；
- **适用场景**：多线程环境下的字符串拼接、修改；
- **常用方法**：`append(...)`（拼接）、`insert(int offset, ...)`（插入）、`reverse()`（反转）、`setCharAt(int index, char ch)`（修改指定位置字符）。

 `StringBuilder`（可变、非线程安全）

- **特性**：JDK5 引入，与`StringBuffer`功能几乎一致，但**无同步锁**，效率更高；
- **适用场景**：单线程环境下的字符串频繁修改（如循环拼接）；
- **注意**：字符串`+`拼接在编译期会被优化为`StringBuilder`（非循环场景），但循环中使用`+`会每次创建新`StringBuilder`，推荐显式使用`StringBuilder`。

如果开发中**需要频繁的针对于字符串进行增、删、改等操作**，建议使用`StringBuffer`或`StringBuilder`替换`String`, 因为使用`String`效率低。

**如果开发中，不涉及到线程安全问题**，建议使用`StringBuilder`替换`StringBuffer`。

