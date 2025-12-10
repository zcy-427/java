
Selector（多路复用器）是**Java NIO（Non-Blocking IO）** 实现 IO 多路复用的核心组件，它允许**单个线程**监控多个 NIO Channel（通道）的就绪状态（读、写、连接、接受连接等），仅当 Channel 有就绪事件时才执行 IO 操作。这种机制解决了传统 BIO（阻塞 IO）“一连接一线程” 的线程膨胀问题，是高并发网络编程（如 IM、网关、RPC 框架）的基石。

## 为什么需要Selector?

对比 BIO 和 NIO 的核心差异，理解 Selector 的价值：

| 模型       | 核心特点                       | 高并发问题                            |
| -------- | -------------------------- | -------------------------------- |
| BIO（阻塞）  | 一连接一线程，线程阻塞在 IO 操作上        | 十万级连接需要十万个线程，线程创建 / 上下文切换开销爆炸    |
| NIO（非阻塞） | 单线程通过 Selector 管理多 Channel | 线程数固定（通常等于 CPU 核心数），仅处理就绪事件，开销极低 |

## Selector关键组件

| 组件           | 作用                                                                                                                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Selector     | 多路复用器本身，负责注册 Channel、监听就绪事件、返回就绪的事件集合                                                                                                                                           |
| Channel      | 必须是非阻塞模式（`configureBlocking(false)`），支持注册到 Selector。常用：`ServerSocketChannel`（监听连接）、`SocketChannel`（读写数据）、`DatagramChannel`（UDP）；**FileChannel 不支持**（天生阻塞）                       |
| SelectionKey | Channel 注册到 Selector 后返回的 “注册凭证”，包含：Channel 与 Selector 的关联、关注的事件、就绪的事件、自定义附件（业务数据）                                                                                              |
| 就绪事件         | SelectionKey 定义的常量（位掩码，可通过组合）：<br>-`OP_ACCEPT`(16)：ServerSocketChannel有新连接<br>-`OP_CONNECT`(8)：SocketChannel连接完成<br>-`OP_READ`(1)：Channel有数据可读<br>-`OP_WRITE` (4)：Channel 可写入数据 |

**核心原理：**

1. 将非阻塞 Channel 注册到 Selector，并指定要关注的事件（如 OP_READ）；
2. 调用 Selector 的`select()`方法，线程阻塞等待内核通知 “有 Channel 就绪”；
3. 内核遍历所有注册的 Channel，标记就绪的 Channel；
4. Selector 返回就绪的 SelectionKey 集合，线程仅处理这些就绪事件；
5. 处理完事件后，更新 / 取消 SelectionKey，进入下一轮循环。

## Selector 核心方法

|方法|作用|
|---|---|
|`Selector.open()`|创建 Selector 实例（底层依赖操作系统多路复用器）|
|`select()`|阻塞，直到至少一个 Channel 就绪，返回就绪的事件数|
|`select(long timeout)`|带超时的阻塞（毫秒），超时返回 0|
|`selectNow()`|非阻塞，立即返回就绪数（不管有没有）|
|`wakeup()`|唤醒阻塞在`select()`上的线程（即使没有就绪事件，`select()`也会返回）|
|`selectedKeys()`|返回**就绪的 SelectionKey 集合**（核心，需遍历处理）|
|`keys()`|返回所有注册到 Selector 的 SelectionKey 集合（包括未就绪的）|
|`close()`|关闭 Selector，自动取消所有注册的 SelectionKey，释放资|

### SelectionKey 核心方法

| 方法                   | 作用                                             |
| -------------------- | ---------------------------------------------- |
| channel()            | 获取关联的 Channel                                  |
| selector()           | 获取关联的 Selector                                 |
| interestOps()        | 返回当前关注的事件（位掩码）                                 |
| interestOps(int ops) | 修改关注的事件（如 `key.interestOps (OP_READOP_WRITE)`） |
| readyOps()           | 返回当前就绪的事件（位掩码）                                 |
| isReadable()         | 快捷判断：是否可读（等价于`(readyOps() & OP_READ) != 0`）    |
| isAcceptable()       | 快捷判断：是否有新连接                                    |
| attach(Object obj)   | 绑定自定义附件（如 ByteBuffer、业务对象）                     |
| attachment()         | 获取绑定的附件                                        |
| cancel()             | 取消 Channel 在 Selector 上的注册（取消后 Key 会被标记为无效）    |

## Selector 完整使用流程（代码示例）

 NIO 服务端示例，完整展示 Selector 的使用：
```java

```