**BOM (浏览器对象模型)**：它是操作 **浏览器本身** 的。比如控制页面的跳转、刷新、弹窗、获取网址。

## BOM 有 4 个极其重要的核心部件
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


## 常用的Windows对象API

### 1. 💬 弹窗三剑客 (系统级对话框)

这就像是 Java Swing 里的 `JOptionPane`。浏览器原生的弹窗，样式不能改，但胜在极其简单，做内部管理系统时非常省事。

- **`alert(msg)` - 警告框**
    
    - **作用**：弹出一个带“确定”按钮的提示框。
        
    - **特点**：会**阻塞代码执行**！用户不点确定，后面的 JS 代码就不跑。
        
    - **场景**：简单的报错提示（`alert("网络请求失败！");`）。
        
- **`confirm(msg)` - 确认框 (⭐⭐⭐ 后端最常用)**
    
    - **作用**：弹出一个带“确定”和“取消”的对话框。
        
    - **返回值**：用户点确定返回 `true`，点取消返回 `false`。
        
    - **场景**：极其适合做**删除前的二次确认**。
```js
let isSure = confirm("你确定要删除这条商品数据吗？");
if (isSure) {
    console.log("正在发送 AJAX 请求删除数据...");
} else {
    console.log("用户取消了操作");
}
```
- **`prompt(msg, default)` - 输入框 (时代的眼泪)**
	- **作用**：弹出一个让用户输入文本的框。现在基本没人用了，大家都会自己画一个好看的 HTML 输入框。
### 2. 📏 视口与滚动 API (控制页面视野)

当你想用 JS 控制页面的滑动，或者获取当前屏幕的大小时，需要找 `window`。

| **API 方法/属性**               | **作用说明**               | **典型业务场景**                                 |
| --------------------------- | ---------------------- | ------------------------------------------ |
| **`window.innerWidth`**     | 获取浏览器窗口的内部可见宽度（不含边框）。  | 判断用户是用手机还是电脑访问（响应式布局）。                     |
| **`window.innerHeight`**    | 获取浏览器窗口的内部可见高度。        | 计算满屏的背景图需要多高。                              |
| **`window.scrollTo(x, y)`** | 把页面滚动到指定的坐标位置。         | **“回到顶部”按钮**的底层实现：`window.scrollTo(0, 0);` |
| **`window.scrollBy(x, y)`** | 在当前滚动位置的基础上，再相对滚动一段距离。 | 网页小说阅读器的“按空格键向下翻一屏”。                       |

### 3.🚪 窗口的打开与关闭

**`window.open(url, name, features)`**
- **作用**：用 JS 强行打开一个新的浏览器标签页或小窗口。
    
- **场景**：用户点击“查看服务协议”，为了不影响当前填写的表单，新开一个页面给他看。
```js
// 在新标签页打开百度
window.open("https://www.baidu.com", "_blank");
```
**`window.close()`**
- **作用**：关闭当前窗口。