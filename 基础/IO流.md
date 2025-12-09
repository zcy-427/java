Java IO（输入 / 输出）的核心是实现**程序与数据源（文件、网络、内存、外设等）之间的数据传输**，“流” 是对数据传输过程的抽象（类似水流逐字节 / 字符传输）。随着 Java 版本迭代，IO 体系从早期的 BIO（阻塞 IO）演进到 NIO（非阻塞 IO，JDK1.4），再到 NIO.2（JDK7+，JSR 203，增强文件系统操作）——**现代开发中 NIO.2 是首选**，本文将从核心概念到新版 API 逐层拆解。

## IO流的本质
IO 的核心是**打破程序内存边界**，实现程序与外部数据源（文件、网络、内存、外设）的双向数据传输：

- 输入（Input）：数据源 → 程序内存（读操作）；
- 输出（Output）：程序内存 → 数据源（写操作）；
- 流” 是对 “逐字节 / 字符传输过程” 的抽象（类似水管流水，只能单向流动，除非用 NIO Channel）。

## 核心分类
#### 1）按数据单位：字节流 vs 字符流（最易踩坑）

| 维度   | 字节流（InputStream/OutputStream） | 字符流（Reader/Writer）    |
| ---- | ----------------------------- | --------------------- |
| 数据单位 | 8 位字节（byte）                   | 16 位字符（char）          |
| 编码关联 | 无编码概念，直接操作原始字节                | 基于编码表（如 UTF-8）将字节转字符  |
| 适用场景 | 所有数据（文件、图片、视频、文本）             | 仅文本数据（txt、json、xml 等） |
| 核心痛点 | 处理文本需手动转码（易乱码）                | 未指定编码时用系统默认编码（易乱码）    |
| 底层关系 | 字符流 = 字节流 + Charset（编码表）      | 依赖字节流实现，是 “包装层”       |
**底层原理**：

计算机存储的所有数据都是字节，字符流的本质是：

`读取`：字节流读字节 → 编码表转字符 → 程序使用；

`写入`：程序写字符 → 编码表转字节 → 字节流写入数据源。
#### （2）按功能分层：节点流 vs 处理流（装饰器模式）

这是 IO 流的设计模式核心，所有增强型 IO 操作都基于此：

- **节点流（底层流）**：直接对接数据源，是 “基础管道”，无增强功能；
    
    示例：FileInputStream（文件节点流）、ByteArrayInputStream（内存节点流）；
- **处理流（包装流）**：包装节点流 / 其他处理流，增强功能（缓冲、序列化、格式化等）；
    
    示例：BufferedInputStream（缓冲增强）、ObjectInputStream（序列化增强）；
- **设计模式**：装饰器模式（对节点流功能动态扩展，不修改原流代码）；
- **核心规则**：关闭流时只需关 “最外层处理流”，底层流会被自动关闭。
---
## 核心API层

### BIO

| 类型    | 核心实现类                                    | 核心用途           | 关键注意点                                 |
| ----- | ---------------------------------------- | -------------- | ------------------------------------- |
| 字节节点流 | FileInputStream/FileOutputStream         | 文件字节读写         | 万能流，处理非文本优先用                          |
| 字节处理流 | BufferedInputStream/BufferedOutputStream | 字节缓冲（减少 IO 次数） | 必须配合节点流使用                             |
| 字节处理流 | ObjectInputStream/ObjectOutputStream     | 对象序列化 / 反序列化   | 类需实现 Serializable，指定 serialVersionUID |
| 字符桥接流 | InputStreamReader/OutputStreamWriter     | 字节流→字符流（指定编码）  | 替代 FileReader/FileWriter              |
| 字符处理流 | BufferedReader/BufferedWriter            | 字符缓冲 + 按行读写    | readLine () 返回 null 表示读完              |
| 字符处理流 | PrintWriter                              | 格式化输出 + 自动刷新   | 适合日志 / 控制台输出                          |
**示例**:

简单的文件读写
```Java
import java.io.*;  
  
public class rw {  
    public static void read(String targetFile)  
    {  
        // try-with-resources：自动关闭所有实现AutoCloseable的资源  
        try(FileInputStream fis = new FileInputStream(targetFile);//字节流  
            InputStreamReader isr = new InputStreamReader(fis, "UTF-8");//桥接流，字节转字符，显式指定编码格式  
             BufferedReader br = new BufferedReader(isr);//处理流，缓冲增强，按行读取  
        )  
        {  
            String line;  
            while ((line = br.readLine()) != null)  
            {  
                System.out.println("读取内容："+line);  
            }  
        }  
        catch (IOException e)  
        {  
            System.err.println("读取失败：" + e.getMessage());  
        }  
    }  
  
    public static void write(String targetFile,String content)  
    {  
        try(FileOutputStream fos=new FileOutputStream(targetFile,true);  
            OutputStreamWriter osw = new OutputStreamWriter(fos, "UTF-8");  
            BufferedWriter bw = new BufferedWriter(osw)  
        )  
        {  
            bw.write(content);//写入内容  
            bw.newLine();//跨平台换行，兼容Windows与Linux  
            bw.flush();// 缓冲流手动刷新（关闭时自动刷，大文件建议手动刷）  
        }catch (IOException e)  
        {  
            System.err.println("写入失败："+e.getMessage());  
        }  
    }  
  
    public static void main(String[] args) {  
        String targetFile="C:\\Users\\zcy\\Desktop\\test.txt";  
        write(targetFile,"Hello,world!");  
        write(targetFile,"你好，世界！");  
        read(targetFile);  
    }  
}
```

序列化（对象→字节）+ 反序列化（字节→对象）
```Java
import java.io.*;  
  
//对象必须要实现Serializable接口才能被序列化  
class User implements java.io.Serializable {  
    private static final long serialVersionUID = 1L;  
    private String name;  
    private int age;  
  
    public User(String name, int age) {  
        this.name = name;  
        this.age = age;  
    }  
  
    public String getName() {  
        return name;  
    }  
  
    public int getAge() {  
        return age;  
    }  
}  
public class Serialization {  
    public static void _Serialization(String Serialization_file, Object obj)  
    {  
        try(FileOutputStream fis=new FileOutputStream(Serialization_file);//节点流  
            ObjectOutputStream oos= new ObjectOutputStream(fis);//处理流  
            )  
        {  
            oos.writeObject(obj);  
            System.out.println("序列化成功");  
        }  
        catch (IOException e)  
        {  
            System.out.println("序列化失败："+e.getMessage());  
        }  
    }  
  
    public static void _Deserialization(String Serialization_file)  
    {  
        try(FileInputStream fis=new FileInputStream(Serialization_file);//节点流  
            ObjectInputStream ois= new ObjectInputStream(fis);//处理流  
        )  
        {  
            Object obj=ois.readObject();  
            if(obj instanceof User)  
            {  
                User user=(User)obj;  
                System.out.println("反序列化成功，name："+user.getName()+",age:"+user.getAge());  
            }  
        }  
        catch (IOException | ClassNotFoundException e)  
        {  
            System.out.println("反序列化失败："+e.getMessage());  
        }  
    }  
    public static void main(String[] args) {  
        String Serialization_file="C:\\Users\\zcy\\Desktop\\user.ser";  
        User user=new User("zhangsan",20);  
        _Serialization(Serialization_file,user);  
        _Deserialization(Serialization_file);  
    }  
}
```

BIO的缺陷:

|痛点|具体表现|解决方案|
|---|---|---|
|阻塞性|读写时线程阻塞，直到操作完成|NIO Selector（多路复用）|
|单向性|一个流只能读 / 写，无法双向操作|NIO Channel（双向通道）|
|API 繁琐|File 类方法返回值模糊（如 delete () 返回 boolean）|NIO.2 Path+Files API|
|编码隐患|FileReader/FileWriter 默认系统编码|显式指定 Charset|

---
### NIO：高并发 / 大文件核心（Buffer+Channel+Selector）

NIO（Non-Blocking IO）是 BIO 的升级，核心是 “缓冲区导向 + 非阻塞 + 多路复用”，适合大文件传输、高并发网络编程。

#### 1.**Buffer:数据容器(替代BIO的字节数组)**
所有 NIO 数据读写都通过 Buffer 完成，核心是 “标记位管理”。

**核心属性**

| 属性       | 含义                     | 初始值      | 写模式→读模式（flip ()） |
| -------- | ---------------------- | -------- | ---------------- |
| capacity | Buffer 能够容纳的**最大元素数量** | 分配时指定    | 不变               |
| position | 当前读写位置                 | 0        | 重置为 0            |
| limit    | 读写上限                   | capacity | 设为原 position     |
| mark     | 标记位（用于重置 position）     | -1       | 不变               |
这里以“写入 → 读取 → 重置” 为例，直观理解标记位变化：

| 操作                 | capacity | position | limit | mark | 说明                           |
| ------------------ | -------- | -------- | ----- | ---- | ---------------------------- |
| 初始化 `allocate(10)` | 10       | 0        | 10    | -1   | 写入模式，默认 limit=capacity       |
| 写入 3 个字节           | 10       | 3        | 10    | -1   | position 随写入后移               |
| `flip()`（翻转）       | 10       | 0        | 3     | -1   | 切换到读取模式，limit = 写入的 position |
| 读取 1 个字节           | 10       | 1        | 3     | -1   | position 随读取后移               |
| `mark()`（标记）       | 10       | 1        | 3     | 1    | 记录当前 position                |
| 读取 1 个字节           | 10       | 2        | 3     | 1    | position 继续后移                |
| `reset()`（重置）      | 10       | 1        | 3     | 1    | position 回退到 mark 位置         |
| `clear()`（清空）      | 10       | 0        | 10    | -1   | 重置为写入模式（不删除数据）               |
注意事项:
1. **`clear()` 不是删除数据**：仅重置 `position=0`、`limit=capacity`、`mark=-1`，数据仍存在，直到被覆盖；
2. **`flip()` 是读写切换核心**：写入后必须 `flip()` 才能读取，读取后若要重新写入，需调用 `clear()` 或 `compact()`；
3.  **`compact()` 适配边读边写**：将未读取的数据移到缓冲区开头，position 设为未读取数据的末尾，limit=capacity，适合部分读取后继续写入的场景。

**1.Buffer核心操作**
```java
import java.nio.ByteBuffer;  
import java.nio.charset.StandardCharsets;  
  
public class Bufferdemo {  
    public static void main(String[] args) {  
        ByteBuffer buffer=ByteBuffer.allocate(1024);//分配一个容量为1024字节的缓冲区,堆内存：allocate；直接内存：allocateDirect，效率更高  
        System.out.println("初始状态：position=" + buffer.position() + ", limit=" + buffer.limit() + ", capacity=" + buffer.capacity());  
        //写入数据：  
        String data="Hello, NIO Buffer!";  
        buffer.put(data.getBytes(StandardCharsets.UTF_8));//将字符串转换为字节数组并写入缓冲区,编码格式为UTF-8  
        System.out.println("写入数据后：position=" + buffer.position() + ", limit=" + buffer.limit() + ", capacity=" + buffer.capacity());  
        //切换为读模式：  
        buffer.flip();//必须调用flip()方法  
        System.out.println("切换读模式后：position=" + buffer.position() + ", limit=" + buffer.limit() + ", capacity=" + buffer.capacity());  
        //读取数据：  
        byte[] bytes=new byte[buffer.remaining()];//根据可读数据长度创建字节数组，remaining()=limit-position（剩余可读字节）  
        buffer.get(bytes);//将数据从缓冲区读取到字节数组  
        String readData=new String(bytes, StandardCharsets.UTF_8);//将字节数组转换为字符串  
        System.out.println("读取的数据：" + readData);  
        System.out.println("读取数据后：position=" + buffer.position() + ", limit=" + buffer.limit() + ", capacity=" + buffer.capacity());  
        //清空缓冲区（重用缓冲区）：  
        buffer.clear();//清空缓冲区，position=0，limit=capacity，但数据未被清除  
        System.out.println("清空缓冲区后：position=" + buffer.position() + ", limit=" + buffer.limit() + ", capacity=" + buffer.capacity());  
    }  
}
```

#### 2.**Channel：双向数据通道（替代 BIO 的单向流）**

Channel 是双向的（可同时读 / 写），必须配合 Buffer 使用，支持非阻塞模式。

**核心实现类**

| Channel 类型          | 用途        | 核心特性                           |
| ------------------- | --------- | ------------------------------ |
| FileChannel         | 文件读写 / 复制 | 支持零拷贝（transferTo/transferFrom） |
| SocketChannel       | TCP 客户端通道 | 非阻塞模式，支持连接 / 读写                |
| ServerSocketChannel | TCP 服务端通道 | 非阻塞模式，支持监听连接                   |
| DatagramChannel     | UDP 通道    | 无连接，支持广播 / 组播                  |
FileChannel：零拷贝复制大文件
```java
import java.io.FileInputStream;  
import java.io.FileNotFoundException;  
import java.io.FileOutputStream;  
import java.io.IOException;  
import java.nio.channels.FileChannel;  
  
public class FileChnannel_demo {  
    public static void copyFile(String srcPath, String destPath) {  
        long startTime = System.currentTimeMillis();  
  
        // 打开源文件和目标文件的Channel  
        try(FileChannel srcChannel=new FileInputStream(srcPath).getChannel();  
            FileChannel outChannel=new FileOutputStream(destPath).getChannel();  
        )  
        {  
            long transferred = 0;  
            long size = srcChannel.size();  
            //transferTo 存在 “单次传输上限”（受操作系统内核限制，如 Linux 通常单次最大传 8MB），无法保证一次传完所有数据，因此需循环直到所有字节传输完毕。  
            while (transferred < size) {  
                transferred += srcChannel.transferTo(transferred, size - transferred, outChannel);  
            }  
            System.out.println("复制完成，耗时：" + (System.currentTimeMillis() - startTime) + "ms");  
        }catch (FileNotFoundException e) {  
            System.out.println("error：" + e.getMessage());  
        } catch (IOException e) {  
            System.out.println("文件复制失败：" + e.getMessage());  
        }  
    }  
  
    public static void main(String[] args) {  
        String srcPath = "C:\\Users\\zcy\\Desktop\\test.txt";  
        String destPath = "C:\\Users\\zcy\\Desktop\\ccs\\";  
        copyFile(srcPath, destPath);  
    }  
}
```
**3.Selector：多路复用器（高并发核心）**

允许**一个线程管理多个 Channel**，仅处理 “就绪” 的 Channel，解决 BIO 线程阻塞问题。

//todo 学完[网络编程](网络编程.md)再来

### NIO.2（JDK7+）：现代文件 IO 主力（Path+Files）

NIO.2（JSR 203）重构了传统 File 类，是日常开发中最常用的 IO API，核心是`Path`（路径）和`Files`（文件工具）。

**1.Path：路径抽象（替代 File 类）**

```java
import java.nio.file.Path;  
import java.nio.file.Paths;  
  
public class Pathdemo {  
    public static void main(String[] args) {  
        // 1. 创建Path（推荐方式）  
        Path absolutePath = Paths.get("D:/test.txt"); // 绝对路径  
        Path relativePath = Paths.get("src", "main", "java"); // 相对路径（拼接）  
        Path fromFile = new java.io.File("test.txt").toPath(); // File→Path  
  
        // 2. 核心路径操作  
        System.out.println("绝对路径：" + relativePath.toAbsolutePath());  
        System.out.println("父路径：" + absolutePath.getParent());  
        System.out.println("文件名：" + absolutePath.getFileName());  
        System.out.println("是否以.txt结尾：" + absolutePath.endsWith("txt"));  
  
        // 3. 路径拼接（resolve）  
        Path subPath = absolutePath.resolve("sub.txt"); // D:/test/sub.txt  
        System.out.println("拼接路径：" + subPath);  
  
        // 4. 相对路径（relativize）  
        Path path1 = Paths.get("D:/a/b");  
        Path path2 = Paths.get("D:/a/c/d");  
        Path relative = path1.relativize(path2); // ../c/d 基于Path1到Path2的相对路径  
        System.out.println("相对路径：" + relative);  
    }  
}
```

**2.Files：文件操作工具类（一站式解决）**

小文件的读写:

```JAVA
import java.io.IOException;  
import java.nio.charset.StandardCharsets;  
import java.nio.file.Files;  
import java.nio.file.Paths;  
import java.nio.file.StandardOpenOption;  
import java.util.List;  
  
public class FILES_RW {  
    public static void main(String[] args) throws IOException {  
       //读取文本文件内容  
        List<String> lines= Files.readAllLines(Paths.get("C:\\Users\\zcy\\Desktop\\test.txt"), StandardCharsets.UTF_8);  
       lines.forEach(line-> System.out.println("读取内容："+line));  
       //写如文本文件（覆盖写入）  
        Files.write(Paths.get("C:\\Users\\zcy\\Desktop\\test.txt"),"Aamdeus".getBytes(StandardCharsets.UTF_8));  
        //追加写入文本文件  
        Files.write(Paths.get("C:\\Users\\zcy\\Desktop\\test.txt"),"\n追加内容".getBytes(StandardCharsets.UTF_8), StandardOpenOption.APPEND);  
        // 读取字节文件（如图片）  
        byte[] imageBytes = Files.readAllBytes(Paths.get("C:\\Users\\zcy\\Desktop\\c11cd4a3-3d6f-4c56-a1d5-d59444cd77d6.png"));  
        System.out.println("图片字节数：" + imageBytes.length);  
    }  
}
```

文件/目录操作(复制 移动 删除)

```Java
import java.io.IOException;  
import java.nio.file.Files;  
import java.nio.file.Path;  
import java.nio.file.Paths;  
import java.nio.file.StandardCopyOption;  
  
public class FileOpreator {  
    public static void main(String[] args) throws IOException {  
        Path srcPath= Paths.get("C:\\Users\\zcy\\Desktop\\test.txt");  
        Path destDir=Path.of("C:\\Users\\zcy\\Desktop\\test");  
        if (Files.notExists(destDir)) {  
            Files.createDirectories(destDir);  
        }  
        Path destPath=destDir.resolve(srcPath.getFileName());//追加文件名，解析出最终的文件Path  
        Files.copy(srcPath, destPath, StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.COPY_ATTRIBUTES);  
        System.out.println("文件复制完成");  
    }  
}
```

目录遍历

```java
import java.nio.file.Files;  
import java.nio.file.Paths;  
public class directory_traversal {  
    public static void main(String[] args) throws Exception {  
        // 1. 浅层遍历（仅当前目录，深度1）  
        System.out.println("=== 浅层遍历src目录 ===");  
        Files.list(Paths.get("src"))  
                .filter(Files::isRegularFile) // 仅文件  
                .filter(p -> p.toString().endsWith(".java")) // 仅Java文件  
                .forEach(p -> System.out.println(p));  
  
        // 2. 递归遍历（深度5，过滤可读文件）  
       System.out.println("\n=== 递归遍历src目录 ===");  
Files.walk(Paths.get("src"),5)  
        .filter(Files::isReadable) //判断是否可读  
        .filter(Files::isRegularFile)//判断是否为普通文件  
        .filter(p->p.toString().endsWith(".java"))//过滤出.java文件  
        .forEach(p-> System.out.println(p+"，大小："+p.toFile().length()+"字节"));
    }  
}
```

 这里需要说一下list与walk，list相当于是深度为1的walk

WatchService：文件监听（配置热加载）
```java
import java.io.IOException;  
import java.nio.file.*;  
  
public class WatchServer_demo {  
    public static void main(String[] args) {  
        //打开WatchService  
        try(WatchService watchService= FileSystems.getDefault().newWatchService())  
        {  
            //注册监听目录.监听创建、修改、删除事件  
            Path watchdir=Path.of("C:\\Users\\zcy\\Desktop\\WatchDir");  
            watchdir.register(watchService, StandardWatchEventKinds.ENTRY_CREATE,  
                    StandardWatchEventKinds.ENTRY_DELETE,  
                    StandardWatchEventKinds.ENTRY_MODIFY);  
            //持续监听事件  
            while(true)  
            {  
                WatchKey key=watchService.take();//获取下一个事件  
                for(WatchEvent<?> event :key.pollEvents())  
                {  
                    WatchEvent.Kind<?> kind=event.kind();  
                    if(kind==StandardWatchEventKinds.OVERFLOW)  
                    {  
                        continue;//事件丢失或溢出,跳过  
                    }  
                    Path fileName=(Path) event.context();  
                    System.out.println("事件类型："+kind.name()+",文件名："+fileName);  
                }  
  
                // 重置WatchKey，否则无法继续监听  
                boolean valid = key.reset();  
                if (!valid) {  
                    System.out.println("WatchKey失效，停止监听");  
                    break;  
                }  
            }  
        }catch (IOException | InterruptedException e)  
        {  
            e.printStackTrace();  
        }  
  
    }  
}
```

这里需要解释一下