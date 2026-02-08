## 绑定事件的方式

##### 1.HTML 属性绑定
直接把 JS 代码写在 HTML 标签里。
```HTML
<button onclick="alert('别点我！')">点击</button>
```

#### 2.DOM 属性绑定 (只能存一个)
```js
let btn = document.getElementById("btn");
btn.onclick = function() {
    console.log("第一次绑定");
};
// 坏处：如果你写了第二行，第一行就被覆盖了（像 HashMap key 冲突）
btn.onclick = function() {
    console.log("第二次绑定"); // 只有这个生效
};
```

#### 3.`addEventListener` (标准推荐)

这是 **观察者模式 (Observer Pattern)** 的标准实现。你可以给同一个按钮添加 10 个不同的监听器，它们都会执行。
```js
let btn = document.getElementById("btn");

// 语法：element.addEventListener(事件类型, 回调函数)
btn.addEventListener("click", () => {
    console.log("发送日志...");
});

btn.addEventListener("click", () => {
    console.log("提交表单...");
});
```

## 事件对象 (Event Object) —— 案发现场的数据包

当事件发生时，浏览器会自动创建一个对象（通常命名为 `event` 或简写 `e`），传给你的回调函数。
这个对象里包含了 **“谁点的？什么时候点的？点的哪里？”** 等所有信息。

```js
document.addEventListener("click", (e) => {
    console.log(e); // 打印整个事件对象看看
    
    // 1. e.target: 真正触发事件的元素 (谁点的？)
    console.log("被点击的元素是：", e.target);
    
    // 2. e.preventDefault(): 阻止默认行为 (关键！)
    // 场景：点击 <a> 标签不跳转，点击 submit 按钮不刷新页面
    e.preventDefault();
});
```

## 常见事件类型

| **类别** | **事件名**            | **触发时机** | **典型场景**                   |
| ------ | ------------------ | -------- | -------------------------- |
| **鼠标** | `click`            | 点击       | 提交按钮、菜单展开                  |
| **键盘** | `keydown`          | 键盘按下     | 监听“回车键”登录                  |
| **表单** | `submit`           | 表单提交     | **拦截表单，改为 AJAX 提交**        |
|        | `input`            | 输入内容时    | 搜索框实时联想 (输入一个字搜一次)         |
|        | `change`           | 失焦且值改变   | 下拉菜单 (`<select>`) 切换省份     |
| **页面** | `DOMContentLoaded` | HTML加载完  | 初始化页面数据 (替代 window.onload) |

## 事件冒泡 (Event Bubbling) —— JS 的奇葩特性

假设你有一个 `div`，里面有个 `p`，里面有个 `span`。 如果你给这三个标签都绑定了 `click` 事件。当你点击最里面的 `span` 时： **浏览器会先触发 `span` 的点击，然后触发 `p` 的点击，最后触发 `div` 的点击。**

就像水底的气泡，从最底层一直往上冒，直到水面（`window` 对象）。

如果你只想让 span 响应该事件，不想惊动它的父亲 div，你需要调用：
```JS
e.stopPropagation(); // 停止传播
```

## 事件委托 (Event Delegation)

**场景**： 你有一个列表 `<ul>`，里面有 1000 个 `<li>`。你需要给每个 `<li>` 都绑定点击事件，点击后变色。

```HTML
<ul id="list">
    <li>Java</li>
    <li>Python</li>
    <li>Go</li>
    </ul>

<script>
    let list = document.getElementById("list");
    
    // 只绑定一次！绑定在父容器上
    list.addEventListener("click", (e) => {
        // e.target 是实际被点击的元素
        // 检查点击的是不是 li 标签 (tagName 必须大写)
        if (e.target.tagName === "LI") {
            e.target.style.color = "red"; // 让被点的那个变色
            console.log("你点击了：" + e.target.innerText);
        }
    });
</script>
```