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
```

```