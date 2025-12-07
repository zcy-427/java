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
