### 1.配置项目的Java版本

打开IDEA开一个新项目，配置sdk版本和语言级别，系统会默认配置版本，可能会出现问题，保证sdk与语言级别相同，最好还是自己选

![](assets/如何通过IDEA开发JavaWeb工程并部署/file-20260221211133211.png)

### 2.开一个新模块作为一个webapp目录并为其添加框架支持

![](assets/如何通过IDEA开发JavaWeb工程并部署/file-20260221211558222.png)

![](assets/如何通过IDEA开发JavaWeb工程并部署/file-20260221211723256.png)

如果出现版本较低，比如上面这里只有4.0版本，这里需要添加依赖，这里选择的是导入Tomcat的依赖

![](assets/如何通过IDEA开发JavaWeb工程并部署/file-20260221212948457.png)

