在浏览器眼里，你写的 HTML 字符串会被解析成一棵倒挂的树，每一个标签（元素）、每一段文字，都是这棵树上的一个**对象**。

掌握 DOM，就是掌握前端的“增删改查”。

### 1.🔍 查 (Read) —— 获取页面元素

就像 Java 里用 MyBatis 写 `SELECT` 语句一样，你需要先找到对应的 HTML 标签，才能操作它。

- **精确主键查询 (找单个)**：
```js
// 速度最快，相当于根据 ID 查数据库
let box = document.getElementById("myBox");
```
- **万能条件查询 (找单个/多个) 👑 现代推荐**： 这是目前最流行的写法，里面的语法和 **CSS 选择器** 一模一样。
```js
// 找第一个匹配的 (相当于 LIMIT 1)
let firstBtn = document.querySelector(".btn-class"); 

// 找所有匹配的 (相当于返回 List<Element>)
let allItems = document.querySelectorAll("ul li"); 
// 注意：拿到的是一个 NodeList (类似数组)，可以使用 for...of 遍历
```
### 2.✍️ 改 (Update) —— 修改元素属性

拿到元素对象后，你可以像调用 Java 对象的 Setter 方法一样去修改它。

- **改内容** (之前讲过的三剑客)：
    
    - `element.innerText = "新文本"` (普通标签文字)
        
    - `element.innerHTML = "<b>加粗</b>"` (写入 HTML 结构)
        
    - `element.value = "admin"` (表单输入框的值)
        
- **改样式 (不推荐直接改)**： 虽然可以用 `element.style.color = "red"`，但如果有 10 个样式要改，代码会非常臃肿。
    
- **改 Class 类名 (👑 现代推荐)**： 最好的做法是，提前在 CSS 里写好一个 `.active` 的高亮样式。然后用 JS 去动态给元素**添加/移除**这个 Class。
```js
let box = document.getElementById("myBox");

// 相当于给元素加上 class="active"
box.classList.add("active");    

// 移除 class
box.classList.remove("active"); 

// 切换：如果有就移除，如果没有就加上 (做折叠面板的神器！)
box.classList.toggle("active");
```
### 3. ➕ 增 (Create) —— 无中生有造元素

有时候你需要根据后端返回的 `List<User>` 数据，动态在页面上生成一个表格。这就需要“凭空捏造” HTML。

分为两步：**先 `new` 出来，再存进树里。**
```js
// 第一步：在内存里创建一个空的 <li> 标签 (相当于 Java 的 new Object())
let newLi = document.createElement("li");

// 给它加工一下，塞点内容
newLi.innerText = "我是用 JS 动态生成的新列表项";
newLi.classList.add("item");

// 第二步：把它挂载到页面上已有的 DOM 树上 (相当于 list.add())
let ulNode = document.getElementById("myList");
ulNode.appendChild(newLi); // 把它作为子节点，追加到 ul 的最后面
```
### 4. 🗑️ 删 (Delete) —— 移除元素

这个最简单。用户点击“删除”按钮时，不仅要发请求告诉后端删数据库，前端页面也要立刻把这行消失掉（为了用户体验）。
```js
let badNode = document.getElementById("ad-banner"); // 找到广告节点

// 现代浏览器直接调用自身的 remove 方法即可自杀
badNode.remove();
```