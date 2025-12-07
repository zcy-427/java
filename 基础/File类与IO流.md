在 Java 中，`File`类用于操作文件 / 目录的**元数据**（路径、名称、大小、权限等），但不处理文件内容；IO 流（Input/Output Stream）则专注于文件 / 设备间的**数据传输**（读 / 写内容）。两者结合可完成文件的创建、删除、读写等核心操作。

## File类

### 关键概念

|概念|说明|
|---|---|
|绝对路径|从根目录开始的完整路径（如`D:\test\file.txt`、`/usr/test/file.txt`）|
|相对路径|相对于当前项目 / 程序运行目录的路径（如`test/file.txt`）|
|路径分隔符|Windows 用`\`，Linux/Mac 用`/`；`File.separator`为跨平台分隔符|
|名称分隔符|Windows 用`;`，Linux/Mac 用`:`；`File.pathSeparator`为跨平台分隔符|

### 构造方法

|构造方法|说明|
|---|---|
|`File(String pathname)`|通过路径名创建 File 对象（文件 / 目录）|
|`File(String parent, String child)`|父路径 + 子路径创建 File 对象|
|`File(File parent, String child)`|父 File 对象 + 子路径创建 File 对象|

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
```
### 删除操作
|方法|说明|
|---|---|
|`delete()`|删除文件 / 空目录，成功返回`true`；非空目录删除失败（需先删内部文件）|
|`deleteOnExit()`|JVM 退出时删除文件 / 目录（用于临时文件清理）|
示例:
