NIO.2（Java 7 引入的 `java.nio.file` 包）提供的 `WatchService` 是**文件系统事件监控服务**，用于替代传统的「轮询文件系统」方式，高效监听目录（或文件）的创建、修改、删除等事件，是基于操作系统原生的文件监控机制实现（如 Linux 的 inotify、Windows 的 ReadDirectoryChangesW）。

核心特点：

- 异步非阻塞（可通过阻塞方法 `take()` 或超时方法 `poll()` 获取事件）；
- 面向目录监控（直接监控文件的场景有限，通常监控文件所在目录）；
- 轻量级（基于操作系统内核事件，无需轮询）。

### 核心相关类 / 接口

#### 1. WatchService（核心接口）

定义文件系统事件监控的核心服务，无法直接实例化，需通过 `FileSystem` 获取：

java

运行

```java
// 获取默认文件系统的 WatchService 实例
WatchService watchService = FileSystems.getDefault().newWatchService();
```

核心方法：

|方法|作用|
|---|---|
|`WatchKey take()`|阻塞等待，直到有事件触发或服务关闭，返回触发的 `WatchKey`（若服务关闭抛 `ClosedWatchServiceException`）|
|`WatchKey poll()`|非阻塞，立即返回：有事件则返回 `WatchKey`，无则返回 `null`|
|`WatchKey poll(long timeout, TimeUnit unit)`|超时阻塞，超时前有事件则返回 `WatchKey`，否则返回 `null`|
|`void close()`|关闭服务，释放资源（所有注册的 `WatchKey` 会失效）|

#### 2. Watchable（可监控接口）

标记「可注册到 `WatchService` 的对象」，`Path` 类实现了该接口，因此**目录 / 文件的 Path 可被监控**。

核心方法：

```java
// 注册 Path 到 WatchService，指定要监控的事件类型
WatchKey register(WatchService watcher, WatchEvent.Kind<?>... events);

// 重载：支持事件修饰符（如同步触发）
WatchKey register(WatchService watcher, WatchEvent.Kind<?>[] events, WatchEvent.Modifier... modifiers);
```

#### 3. WatchKey（监控密钥）

`Path` 注册到 `WatchService` 后返回的「注册凭证」，代表「监控服务 - 被监控路径」的关联关系，即WatchService与其监控的路径之间绑定在唯一的WatchKey上，所有在这个路径上触发的事件其对应的 `WatchKey`都是同一个。

|场景|是否生成新 WatchKey|示例|
|---|---|---|
|同一 Path 首次注册到 WatchService|是（生成唯一 Key）|注册 `./dir1` → 得到 Key1|
|同一 Path 触发多个事件（创建 / 修改 / 删除）|否（复用同一个 Key）|Key1 中包含「创建文件 A」「修改文件 A」「删除文件 A」三个事件|
|同一 Path 重复注册到同一个 WatchService|否（返回已有的 Key）|再次调用 `dir1.register(watcher, ...)` → 仍返回 Key1|
|不同 Path 注册到同一个 WatchService|是（每个 Path 对应一个 Key）|注册 `./dir2` → 得到 Key2；注册 `./dir3` → 得到 Key3|
|同一 Path 在不同 WatchService 中注册|是（不同服务生成不同 Key）|WatchService1 注册 `./dir1` → Key1；WatchService2 注册 `./dir1` → Key4|
|原 Key 失效后，重新注册同一 Path|是（生成新 Key）|Key1 失效（如目录被删除）→ 重新注册 `./dir1` → 得到 Key5|

**核心状态**：

- `READY`：初始状态，可接收新事件；
- `SIGNALED`：有事件触发，需处理；
- `INVALID`：失效（路径被删除、服务关闭、手动取消注册等），无法再接收事件。

核心方法：

|方法|作用|
|---|---|
|`List<WatchEvent<?>> pollEvents()`|获取该 Key 上所有待处理的事件列表|
|`boolean reset()`|重置 Key 为 `READY` 状态（必须调用，否则后续事件不会触发）；返回 `true` 表示 Key 仍有效，`false` 表示失效|
|`void cancel()`|取消注册，Key 变为 `INVALID`|
|`boolean isValid()`|判断 Key 是否有效|
|`Watchable watchable()`|返回该 Key 对应的被监控对象（即注册的 Path）|

#### 4. WatchEvent（监控事件）

表示触发的文件系统事件，泛型 `T` 为「事件上下文类型」（通常是 `Path`，代表触发事件的文件 / 子目录路径）。

核心组件：

- **Kind（事件类型）**：标识事件类型，由 `StandardWatchEventKinds` 定义标准类型；
- **Count（事件计数）**：事件触发次数（如多次修改可能合并为一个事件，计数 > 1）；
- **Context（事件上下文）**：触发事件的文件 / 目录的 `Path`（相对于注册的目录，而非绝对路径）。

核心方法：

|方法|作用|
|---|---|
|`WatchEvent.Kind<T> kind()`|获取事件类型（如创建、修改、删除）|
|`int count()`|获取事件触发次数|
|`T context()`|获取事件上下文（通常是触发事件的文件 Path）|

#### 5. StandardWatchEventKinds（标准事件类型）

定义了 NIO.2 内置的文件系统事件类型，是 `WatchEvent.Kind<Path>` 的实现：

|事件类型|含义|
|---|---|
|`ENTRY_CREATE`|目录内创建文件 / 子目录（包括重命名 / 移动进入）|
|`ENTRY_DELETE`|目录内删除文件 / 子目录（包括重命名 / 移动移出）|
|`ENTRY_MODIFY`|目录内文件 / 子目录被修改（注意：不同系统触发时机不同，如 Windows 改内容触发，Linux 保存触发，可能多次触发）|
|`OVERFLOW`|事件溢出（丢失部分事件），需优先处理，避免漏事件|

#### 6. WatchEvent.Modifier（事件修饰符）

标记事件的触发方式，目前仅提供一个标准实现：

- `StandardWatchEventModifiers.SYNCHRONOUS`：同步触发事件（操作系统层面同步通知，默认是异步）。

### WatchService 工作流程

1. **创建 WatchService 实例**；
2. **注册目标目录（Path）** 到 WatchService，指定要监控的事件类型；
3. **循环获取 WatchKey**（通过 `take()`/`poll()`）；
4. **处理 WatchKey 中的事件**（遍历 `pollEvents()` 结果）；
5. **重置 WatchKey**（`reset()`），使其回到 `READY` 状态以接收新事件；
6. **关闭 WatchService**（使用完毕后释放资源）。

### 示例代码：监控目录的创建 / 修改 / 删除事件


```java
import java.io.IOException;
import java.nio.file.*;
import java.util.List;

public class WatchServiceDemo {
    public static void main(String[] args) throws IOException, InterruptedException {
        // 1. 创建 WatchService 实例
        WatchService watchService = FileSystems.getDefault().newWatchService();

        // 2. 注册要监控的目录（绝对路径/相对路径均可）
        Path monitorDir = Paths.get("./monitor-dir");
        // 注册：监控创建、修改、删除事件（忽略 OVERFLOW 先演示核心逻辑）
        monitorDir.register(
            watchService,
            StandardWatchEventKinds.ENTRY_CREATE,
            StandardWatchEventKinds.ENTRY_MODIFY,
            StandardWatchEventKinds.ENTRY_DELETE
        );

        System.out.println("开始监控目录：" + monitorDir.toAbsolutePath());

        // 3. 循环监听事件
        while (true) {
            // 阻塞等待事件（take() 会阻塞直到有事件或服务关闭）
            WatchKey watchKey = watchService.take();

            // 4. 处理事件
            List<WatchEvent<?>> events = watchKey.pollEvents();
            for (WatchEvent<?> event : events) {
                // 跳过溢出事件
                if (event.kind() == StandardWatchEventKinds.OVERFLOW) {
                    continue;
                }

                // 获取事件类型和触发事件的文件路径（相对路径）
                WatchEvent.Kind<?> eventKind = event.kind();
                Path eventPath = (Path) event.context();

                // 输出事件信息
                System.out.printf(
                    "事件类型：%s，触发文件：%s%n",
                    eventKind.name(),
                    monitorDir.resolve(eventPath) // 转为绝对路径
                );
            }

            // 5. 重置 WatchKey（必须调用，否则后续事件不会触发）
            boolean isKeyValid = watchKey.reset();
            if (!isKeyValid) {
                // Key 失效（如目录被删除），退出循环
                System.out.println("监控目录失效，停止监控");
                break;
            }
        }

        // 6. 关闭服务（实际开发中建议用 try-with-resources 自动关闭）
        watchService.close();
    }
}
```

**使用说明**：

- 运行前需手动创建 `./monitor-dir` 目录；
- 在该目录下创建 / 修改 / 删除文件，控制台会输出对应的事件；
- 若删除 `monitor-dir` 目录，Key 会失效，程序停止监控。

### 注意事项

1. **仅监控目录**：`WatchService` 主要面向目录监控，直接注册文件的 Path 可能无效（或仅在文件被删除 / 重命名时触发事件）；
2. **非递归监控**：默认仅监控当前目录，子目录的事件不会触发，需手动递归注册所有子目录；
3. **系统差异**：`ENTRY_MODIFY` 事件的触发时机因操作系统而异（如 Linux 下修改文件内容后保存才触发，Windows 下实时触发）；
4. **OVERFLOW 事件**：必须处理，否则可能导致后续事件丢失；
5. **资源释放**：`WatchService` 需手动关闭（建议用 `try-with-resources`），否则会占用系统资源；
6. **Key 重置**：处理完事件后必须调用 `reset()`，否则 Key 会一直处于 `SIGNALED` 状态，不再接收新事件。