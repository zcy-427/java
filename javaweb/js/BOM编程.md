**BOM (浏览器对象模型)**：它是操作 **浏览器本身** 的。比如控制页面的跳转、刷新、弹窗、获取网址。

BOM 有 4 个极其重要的核心部件

### 1.导航仪：`location` 对象 📍 (路由与跳转)
这是你和前端配合最频繁的 BOM 对象。它掌管着浏览器地址栏里的 **URL**。

**场景 1：获取请求参数 (Query String)**
假设你的 Java 接口做了一个第三方登录验证，验证成功后跳转回前端页面：`http://localhost:8080/index.html?token=abc1234`。 前端需要用 BOM 把这个 `token` 抠出来：

```js
// 打印整个网址
console.log(location.href); 

// 现代玩法：优雅地获取 URL 里的参数
let params = new URLSearchParams(location.search);
let myToken = params.get("token"); 
console.log("拿到了后端传来的 Token: " + myToken);
```
**场景 2：页面重定向 (Redirect)** 前端判断用户没登录，用 JS 把他踢回登录页：
```js
// 只要给 href 赋值，浏览器就会立刻跳转！
location.href = "http://www.yoursite.com/login.html";

// 重新加载当前页面 (相当于按 F5)
location.reload();
```

### 2.定时炸弹与闹钟：定时器 ⏱️ (轮询后端)

在 Java 里我们有 `ScheduledExecutorService` 做定时任务，在 JS 的 BOM 里，我们有两大定时神器。

**`setTimeout` (延迟执行，只干一次)**
```js
setTimeout(() => {
    console.log("3秒到了，执行任务！");
    location.href = "/home.html";
}, 3000); // 3000 毫秒 = 3 秒
```
**`setInterval` (循环执行，停不下来)**

```js
let timer = setInterval(() => {
    console.log("正在向 Java 后端查询支付状态...");
    // 如果查到支付成功，必须手动停止它！否则会永远执行下去内存溢出。
    // clearInterval(timer); 
}, 2000);
```

### 3.时光机：`history` 对象 ⏳ (前进与后退)

它掌管着浏览器的“历史记录”栈。

```js
// 退回上一页 (相当于点击浏览器左上角的 ← 按钮)
history.back();

// 前进一页 (相当于点击 →)
history.forward();

// 灵活跳转 (-1 是后退一页，-2 是后退两页，1 是前进一页)
history.go(-1);
```

### 4.浏览器的“数据库”：`Web Storage`
严格来说它是 HTML5 引入的新 API，但经常和 BOM 放在一起讲。 在过去，浏览器存数据只能用 **Cookie**（又小又麻烦，每次发请求还自动带给后端，容易被攻击）。 现在，浏览器提供了强大的本地存储仓库。

**`localStorage` (持久存储)**：除非用户手动清除浏览器缓存，否则数据永远都在。
```js
// 存数据 (只能存字符串)
localStorage.setItem("userToken", "eyJhbGciOiJIUzI1NiIsIn...");

// 取数据 (每次发送 AJAX 请求给后端前，从这里取出来放到 Header 里)
let token = localStorage.getItem("userToken");

// 删数据 (退出登录时调用)
localStorage.removeItem("userToken");
```
**`sessionStorage` (会话存储)**：用法和上面一模一样，但只要**关掉当前浏览器标签页**，数据就灰飞烟灭。
