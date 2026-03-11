
**Servlet（Server Applet，服务器端小程序）** 是 Java EE（现为 Jakarta EE）规范中的一种核心技术组件。它是一段基于 Java 语言编写的服务器端程序，运行在 Servlet 容器（Servlet Container，如 Apache Tomcat、Jetty）中。

从面向对象和 API 的角度而言，Servlet 是一个实现了 javax.servlet.Servlet（或 jakarta.servlet.Servlet）接口的 Java 类。其主要功能是**基于请求-响应（Request-Response）模型，接收并解析客户端（通常通过 HTTP 协议）发送的请求，执行业务逻辑，并动态生成响应数据返回给客户端**。

Servlet 是早期为了解决传统 CGI（Common Gateway Interface，通用网关接口）性能低下（每次请求创建一个独立进程）而诞生的技术，它采用**“单实例多线程”**的模型，显著提升了高并发场景下的服务器吞吐量。

**简单来说：Servlet 就是运行在 Web 服务器上的一个 Java 小程序。**  
它的核心任务就两个：**接收用户的请求**，然后**给用户返回结果**

### 二、 Servlet 的核心工作原理

Servlet 无法独立运行，它必须依赖于**Servlet 容器**（如 Tomcat）。容器负责网络通信的底层细节、解析 HTTP 报文以及管理 Servlet 的生命周期。

一次完整的 HTTP 请求处理流程如下：

1. **请求建立与解析：**  
    客户端（浏览器）通过 TCP/IP 协议向 Web 服务器发起 HTTP 请求。Servlet 容器监听到请求后，解析 HTTP 报文。
    
2. **对象封装：**  
    容器将解析后的 HTTP 请求报文封装为 HttpServletRequest 对象（包含请求头、参数、URI等），并创建一个空的 HttpServletResponse 对象用于接收响应数据。
    
3. **路由映射（URL Mapping）：**  
    容器根据请求的 URI，查找部署描述符（web.xml）或注解（@WebServlet），匹配并定位到负责处理该请求的特定 Servlet 类。
    
4. **线程池分配（并发处理）：**  
    Servlet 容器从线程池中分配一个工作线程（Worker Thread）来处理该请求。该线程调用目标 Servlet 的 service() 方法，并将 request 和 response 对象作为参数传入。
    
5. **方法分发与业务逻辑执行：**  
    在 HttpServlet 基类的 service() 方法中，会根据 HTTP 请求的方法类型（GET、POST、PUT、DELETE 等），将请求向下分发给相应的 doGet()、doPost() 等具体方法。开发者在这些方法体内部实现业务逻辑，并操作数据库或其它资源。
    
6. **响应生成与返回：**  
    业务逻辑执行完毕后，Servlet 通过 HttpServletResponse 对象提供的输出流（PrintWriter 或 ServletOutputStream），将动态生成的数据（如 HTML 文本、JSON 格式字符串）写入响应体。容器负责将这些数据按照 HTTP 协议规范重新组装成响应报文，并由底层 Socket 返回给客户端。
    
7. **线程回收：**  
    响应发送完毕后，工作线程被回收至容器的线程池，request 和 response 对象被销毁（等待 JVM 的垃圾回收机制回收）。


> [!NOTE] 对于tomcat来说
> 1. tomcat接收到请求后，会将请求报文的信息转换一个HttpServletRequest对象，该对象中包含了请求中的所有信息请求行请求头请求体
> 2.  tomcatl同时创建了一个HttpServletResponse对象，该对象用于承装要响应给客户端的信息，后面，该对象会被转换成响应的报文响应行响应头响应体
> 3. tomcat根据请求中的资源路径找到对应的servlet,将servlet实例化，调用service,方法，同时将HttpServletRequest和HttpServletResponse对象传入







