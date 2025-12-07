在 Java 中，`File`类用于操作文件 / 目录的**元数据**（路径、名称、大小、权限等），但不处理文件内容；IO 流（Input/Output Stream）则专注于文件 / 设备间的**数据传输**（读 / 写内容）。两者结合可完成文件的创建、删除、读写等核心操作。注意本章只介绍java7+前的File类,对于Files类的介绍在这里:[Files类](Files类.md)

## File类

### 关键概念

|概念|说明|
|---|---|
|绝对路径|从根目录开始的完整路径（如`D:\test\file.txt`、`/usr/test/file.txt`）|
|相对路径|相对于当前项目 / 程序运行目录的路径（如`test/file.txt`）|
|路径分隔符|Windows 用`\`，Linux/Mac 用`/`；`File.separator`为跨平台分隔符|
|名称分隔符|Windows 用`;`，Linux/Mac 用`:`；`File.pathSeparator`为跨平台分隔符|

### 构造方法

| 构造方法                                | 说明                        |
| ----------------------------------- | ------------------------- |
| `File(String pathname)`             | 通过路径名创建 File 对象（文件 / 目录）  |
| `File(String parent, String child)` | 父路径 + 子路径创建 File 对象       |
| `File(File parent, String child)`   | 父 File 对象 + 子路径创建 File 对象 |

示例：
```java
File file1=new File("C:\\Users\\zcy\\IdeaProjects\\classdemo\\test.txt");//绝对路径 
File file2=new  File("test.txt");//相对路径，相对于工程目录  
File file3=new File("C:\\Users\\zcy\\IdeaProjects\\classdemo","test.txt");//父路径+子路径  
File parent=new File("C:\\Users\\zcy\\IdeaProjects\\classdemo");  
File file4=new File(parent,"test.txt");//父路径对象+子路径
```
### 核心方法
#### 1.创建操作
|方法|说明|
|---|---|
|`createNewFile()`|创建空文件，文件已存在则返回`false`；需处理`IOException`|
|`mkdir()`|创建单级目录，父目录不存在则失败，返回`false`|
|`mkdirs()`|创建多级目录（父目录不存在则自动创建），返回`boolean`|
|`createTempFile(prefix, suffix)`|创建临时文件（默认在系统临时目录）|
示例：
```java
File file = new File("test.txt"); // 创建空文件 
if (!file.exists()) { boolean isCreated = file.createNewFile(); System.out.println("文件创建：" + isCreated); }
// 创建单级目录（如果依赖父目录创建，而父目录不存在，则无法创建）
File dir1 = new File("testDir"); dir1.mkdir(); 
// 创建多级目录（父目录不存在也能创建） 
File dir2 = new File("testDir/subDir1/subDir2"); dir2.mkdirs();
// 创建前缀为"test"、后缀为".tmp"的临时文件
File tempFile = File.createTempFile("test", ".tmp");
tempFile.deleteOnExit(); // JVM退出时删除
System.out.println("临时文件路径：" + tempFile.getAbsolutePath());
```
这里需要说明一下`createTempFile(prefix, suffix)`

`prefix`表示临时文件的前缀（必须至少 3 个字符），比如 "temp_"；`suffix`：文件名后缀（可传 `null`，默认生成 `.tmp` 后缀），例如 `.txt`。其文件名由指定的前缀（prefix）、后缀（suffix）和自动生成的随机字符组成，以保证多线程 / 多进程下文件名不重复。最终文件名格式：`[prefix][随机字符][suffix]`

### 2.删除操作
|方法|说明|
|---|---|
|`delete()`|删除文件 / 空目录，成功返回`true`；非空目录删除失败（需先删内部文件）|
|`deleteOnExit()`|JVM 退出时删除文件 / 目录（用于临时文件清理）|
示例:
```java
File file = new File("test.txt");
// 立即删除文件
if (file.exists()) {
    file.delete();
}

// JVM退出时删除临时目录
File tempDir = new File("temp");
tempDir.deleteOnExit();
```
这里需要注意,Delete只能够删除空目录，删除非空目录需递归删除内部所有文件 / 子目录；

示例:
```

```
### 3.判断操作
| 方法                       | 说明            |
| ------------------------ | ------------- |
| `exists()`               | 判断文件 / 目录是否存在 |
| `isFile()`               | 判断是否为文件（非目录）  |
| `isDirectory()`          | 判断是否为目录（非文件）  |
| `isAbsolute()`           | 判断路径是否为绝对路径   |
| `canRead()`/`canWrite()` | 判断文件是否可读 / 可写 |
示例:
```java
File file = new File("test.txt");   
//创建空文件  
if (!file.exists()) {  
	boolean isCreated = file.createNewFile();  
	System.out.println("File created: " + isCreated);  
}  
System.out.println("文件名："+file.getName());  
System.out.println("文件绝对路径："+file.getAbsolutePath());  
System.out.println("文件父路径："+file.getParent());  
System.out.println("文件大小（字节）："+file.length());  
System.out.println("文件是否存在："+file.exists());  
System.out.println("是否为文件："+file.isFile());  
System.out.println("是否为目录："+file.isDirectory());  
System.out.println("是否可读："+file.canRead());  
System.out.println("是否可写："+file.canWrite());
```
### 4.获取信息
|方法|说明|
|---|---|
|`getName()`|获取文件名 / 目录名（不含路径）|
|`getPath()`|获取构造时的路径（可能是相对路径）|
|`getAbsolutePath()`|获取绝对路径（可能包含冗余如`../`）|
|`getCanonicalPath()`|获取规范路径（解析冗余路径，需处理`IOException`）|
|`length()`|获取文件大小（字节）；目录返回 0|
|`lastModified()`|获取最后修改时间（毫秒值，可转`Date`）|
### 5.目录遍历
|方法|说明|
|---|---|
|`list()`|返回目录下所有文件 / 目录名的字符串数组；非目录返回`null`|
|`listFiles()`|返回目录下所有文件 / 目录的`File`数组；非目录返回`null`|
|`listFiles(FilenameFilter)`|按过滤器筛选目录下的`File`对象|
示例:
```java
File dir = new File("testDir");
if (dir.isDirectory()) {
    // 遍历所有文件/目录
    File[] files = dir.listFiles();
    for (File f : files) {
        System.out.println(f.getName() + " | " + (f.isFile() ? "文件" : "目录"));
    }
    
    // 筛选txt文件
    File[] txtFiles = dir.listFiles((d, name) -> name.endsWith(".txt"));
}
```