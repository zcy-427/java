## 1.基本概念
**HTML (HyperText Markup Language)**，全称是“超文本标记语言”。
它只告诉浏览器：“这是一段标题”、“这是一个按钮”、“这里有一张图片”。

如果把网页比作一个人，**HTML 是骨架**（支撑结构），CSS 是衣服和化妆（好看），JavaScript 是肌肉（动作和交互）

## 2.基础结构

HTML 不是一堆杂乱的文字，它是一个**树形结构**（Tree Structure），我们称之为 **DOM (Document Object Model)**。理解这种层级关系对你将来写爬虫或者解析 XML/JSON 非常有帮助。

一个标准的 HTML 页面像这样：

HTML
```
<!DOCTYPE html> 
 <html>
    <head>
        <meta charset="UTF-8">
        <title>我的第一个网页</title>
    </head>
    <body>
        <h1>你好，Java导师！</h1>
        <p>这是一个段落。</p>
    </body>
</html>
```

- **`<html>`**：根节点，包裹所有内容。
    
- **`<head>`**：**“大脑”**。存放网页标题、字符集编码（防止乱码，后端常遇到的坑）、引入 CSS/JS 文件的地方。
    
- **`<body>`**：**“身体”**。所有可见的按钮、图片、文字都在这里。


> [!NOTE] HTML的注释写法
> <--!
> 注释内容
> -->

## 3.专业词汇

- **tag(标签):** 页面的一对<>
- **attribute(属性)：** 对标签特征进行设置的一种方式，属性一般在开始标签当中定义
- **text(文本)：** 双标签当中的文字
- **element(元素)：** 开始标签+属性+文本+结束标签 称之为一个元素


## 4.语法细节

1. 根标签有且只能有一个
2. 无论是双标签还是单标签都需要正确关闭
3. 标签可以嵌套但不能交叉嵌套
4. 注释语法为<！-->，注意不能嵌套
5. 属性必须有值，值必须加引号，H5中属性名和值相同时可以省略属性值
6. HTML中不严格区分字符串使用单双引号
7. HTML标签不严格区分大小写，但是不能大小写混用
8. HTML中不允许自定义标签名，强行自定义则无效


## 5.常见标签

- 标题标签 (Headings): `<h1>` 到 `<h6>`:
	**`<h1>` 的唯一性**：在一个页面中，通常**只允许出现一个 `<h1>`**（通常是页面的主标题或 Logo）。这对 SEO（搜索引擎优化）至关重要。
	
- 段落标签 (Paragraph): `<p>`:
	**绝对禁止嵌套块级元素！** 这是初学者常犯的错误。你**不能**在 `<p>` 标签里面放 `<div>`、`<h1>` 或表格。
	
- 换行标签 (Line Break): `<br />`
	理解为换行符
	
- 水平分割线: `<hr />`
	在页面上画一条横线，表示话题的转换
	
- 列表标签
	- 无序列表 (Unordered List): `<ul>`
	- 有序列表 (Ordered List): `<ol>`
		- - `type="A"` -> 显示 A, B, C...
		- `type="I"` -> 显示罗马数字 I, II, III...
		- `start="10"` -> 从第 10 开始数。
	- 定义列表 (Definition List): `<dl>`
		- `<dl>` (Definition List)：列表容器。
	    - `<dt>` (Definition Term)：**标题/名字**（Key）。
	    - `<dd>` (Definition Description)：**描述/值**（Value）。
	- 子列表 `<ul>` 或 `<ol>` 必须放在父级的 `<li>` 标签**内部**，而不能直接放在 `<ul>` 下面。
- 图片标签
	标签：`<img src="..." />`
	属性：src:图片的存放地址；title：鼠标悬停在图片上显示的文字；alt：图片加载失败显示的文字

## 6.超链接标签

基本的语法：
```html
<a href="目标地址">点击这里</a>
```
例如你点击这样的一个链接
```html
<a href="/user/profile?id=10086">查看个人主页</a>
```
**浏览器** 会做以下动作：
1. 解析 `href` 里的地址。
    
2. 向服务器发起一个 **HTTP GET 请求**。
    
3. 携带参数：`id=10086`。

`href` 的三种写法（路径问题）
- **绝对路径 (Absolute Path)**：
    
    - **完整的网址**：`href="https://www.baidu.com"`
        
    - **场景**：跳转到别人的网站（站外跳转）。
        
- **相对路径 (Relative Path)**：
    
    - **同级目录**：`href="about.html"` 或 `href="./about.html"`
        
    - **上级目录**：`href="../index.html"` (`..` 代表退回到上一层文件夹)
        
    - **场景**：站内跳转。
        
- **根路径 (Root Path)**：
    
    - **以 `/` 开头**：`href="/login"`
        
    - **含义**：直接从网站的根目录开始找。
        
    - **后端推荐**：在 Web 开发中，尽量使用根路径或者由模板引擎（Thymeleaf）生成的路径，这样不容易出错。

`target` 属性：在哪里打开
- **`target="_self"`**：默认值。在当前标签页打开。
    
- **`target="_blank"`**：**在新标签页打开**。

## 7.表格标签

表格不是一个标签就能搞定的，它像 Excel 一样，有行、有列。

- **`<table>`**：大容器，定义“这是一个表格”。
    
- **`<tr>` (Table Row)**：**行**。表格必须先有行。
    
- **`<td>` (Table Data)**：**单元格**。这是真正放数据的地方。
为了让代码更清晰，也为了让浏览器渲染得更快，标准写法会把表格分成三个部分。

- **`<thead>`**：表头区域。里面的单元格通常用 **`<th>` (Table Header)**，文字会自动加粗居中。
    
- **`<tbody>`**：表身区域。放真正的数据。
    
- **`<tfoot>`**：表脚区域（很少用，通常用于显示“总计”）。
对于表格合并
- **`rowspan`**：**跨行合并**（垂直方向）。
    
    - `rowspan="2"`：我要占两行的高度。
        
- **`colspan`**：**跨列合并**（水平方向）。
    
    - `colspan="3"`：我要占三列的宽度。

## 8.表单标签

### `<form>`
`<form> </form>`表示这是一个表单容器
- action表示**目的地**。告诉浏览器，填好的数据要发给后端的哪个接口（URL）。
- **`method`**：**发送方式**。主要有两种：
	-  **`GET`**：数据会拼接到 URL 后面（如 `?name=abc`）。**不安全**，且有长度限制。通常用于**搜索**。
    
	- **`POST`**：数据放在请求体（Body）里，URL 上看不见。**安全**，无大小限制。通常用于**登录、注册、保存数据**。

### `<input>` 控件

#### 文本输入类

```html
用户名：<input type="text" name="username" placeholder="请输入账号" />

密 码：<input type="password" name="pwd" />
```

#### 选择类 (单选/多选)

这里有一个后端经常遇到的坑：**分组**。

- **单选框 (`radio`)**：比如选性别。
    - **关键点**：一组单选框的 **`name` 必须相同**，否则它们无法互斥（可以同时选男和女）。
    - **`value`**：必须写！因为用户不输入文字，你需要告诉后端选了这个代表什么值。
    
- **复选框 (`checkbox`)**：比如选爱好。
```HTML
性别：
<input type="radio" name="gender" value="male">男
<input type="radio" name="gender" value="female">女

爱好：
<input type="checkbox" name="hobby" value="code">写代码
<input type="checkbox" name="hobby" value="game">打游戏
```

#### 功能类

- **隐藏域 (`hidden`)**：**后端神器**。
    
    - 页面上看不见，但提交表单时会一起发给后端。
    - **场景**：修改用户信息时，需要把用户的 `id` 传回后台，但不想让用户看到或修改它。
    
```html
  <input type="hidden" name="user_id" value="10086" />
```
- **文件上传 (`file`)**：
 ```HTML
 <input type="file" name="avatar" /> 
 ```

### 下拉菜单：`<select>` 和 `<option>`
所在城市：
```HTML
<select name="city">
    <option value="bj">北京</option>
    <option value="sh">上海</option>
    <option value="sz" selected>深圳</option>
</select>
```

### 多行文本域：`<textarea>`
```HTML
<textarea name="intro" rows="5" cols="30">默认文字...</textarea>
```

### 提交按钮：`<button>`

- **`type="submit"`**：**默认值**。点击后，浏览器会自动收集所有数据，按照 `<form>` 的 `action` 地址发出去。
    
- **`type="button"`**：普通按钮。点击没反应，通常用来绑定 JavaScript 事件（比如“点击获取验证码”）。
    
- **`type="reset"`**：重置按钮。点击把表单清空（现在很少用了）。
    
```HTML
<button type="submit">立即注册</button>
<button type="button">检查用户名是否重复</button>
```

## 9.布局标签

### 布局万金油：`<div>`
- **含义**：它是一个**没有任何语义的块级容器**。
    
- **作用**：它就像一个空的**纸箱子**。你往里面装什么都可以。
    
- **用法**：我们通常给它加上 `id` 或 `class`，然后用 CSS 来控制这个“箱子”长什么样。

```HTML
<div id="header">
    <img src="logo.png">
</div>

<div class="content">
    <p>这里是正文...</p>
</div>
```

### 行内微调：`<span>`

如果说 `<div>` 是大箱子，`<span>` 就是**透明的小袋子**。

```HTML
<p>
    欢迎来到 <span style="color: red;">Java</span> 世界。
</p>
```

### 核心结构标签

1. **`<header>`**：**页眉**。
    
    - 通常放 Logo、导航菜单、搜索框。
    
    - _注意：不是 `<head>`（那是放配置的），这是 `<header>`（可视区域的头部）。_
    
2. **`<nav>`**：**导航栏** (Navigation)。
    
    - 里面通常放 `<ul>` + `<a>` 链接。
    
3. **`<main>`**：**主要内容区**。
    
    - 一个页面最好只有一个 `<main>`。这是用户真正想看的内容。
    
4. **`<footer>`**：**页脚**。
    
    - 放版权信息、备案号、联系方式。
    

### 内容区块标签

5. **`<section>`**：**章节/区块**。
    
    - 比如一个页面分“产品介绍”、“用户评价”、“联系我们”三段，每一段就是一个 `<section>`。
    
6. **`<article>`**：**独立文章**。
    
    - 一篇完整的博客、一条新闻、一条论坛帖子。
    
7. **`<aside>`**：**侧边栏/旁支内容**。
    
    - 放广告、推荐阅读、目录。

## 10.特殊符号标签

| **符号** | **实体代码 **  | **含义**                                |
| ------ | ---------- | ------------------------------------- |
| **空格** | `&nbsp;`   | Non-Breaking Space (不换行空格)  <br>非换行空格 |
| **<**  | `&lt;`     | Less Than (小于号)                       |
| **>**  | `&gt;`     | Greater Than (大于号)  大于号               |
| **&**  | `&amp;`    | Ampersand (和号)                        |
| **"**  | `&quot;`   | Quotation Mark (双引号)  " (双引号)         |
| ©      | `&copy;`   | 版权符号 (Copyright)                      |
| ®      | `&reg;`    | 注册商标 (Registered)                     |
| ™      | `&trade;`  | 商标 (Trademark)                        |
| ¥      | `&yen;`    | 人民币/日元符号                              |
| ×      | `&times;`  | 乘号 (不是字母 x，这个是数学符号)                   |
| ÷      | `&divide;` | 除号                                    |

