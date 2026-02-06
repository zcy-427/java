## css的3种引入方式

#### 1.行内样式 (Inline Style) —— “临时工”、

直接在 HTML 标签内部，使用 `style` 属性来写 CSS。
```html
<p style="color: red; font-size: 20px;">这是一段警告信息</p>
```
**无法复用**：如果你有 100 个段落都要变红，你得复制粘贴 100 次。
#### 2.内部样式 (Internal Style) —— “单间独享”

在 HTML 文件的 `<head>` 标签里面，使用 `<style>` 标签来写。

```html
<head>
    <style>
        /* 这里的样式只对当前这个 HTML 文件有效 */
        p {
            color: blue;
        }
        h1 {
            text-align: center;
        }
    </style>
</head>
```

**只能管当前页面**。如果你有 `index.html` 和 `about.html`，你想让它们的标题都变成绿色，你得在两个文件里都写一遍。

#### 3.外部样式 (External Style) —— “企业标准” 👑

把 CSS 代码单独写在一个后缀为 `.css` 的文件中，然后在 HTML 里通过 `<link>` 标签引入。

- 新建一个文件 `style.css`。
```css
/* style.css 文件内容 */
body {
    background-color: #f0f0f0; /* 灰色背景 */
}
h1 {
    color: green;
}
```
- 在 HTML 的 `<head>` 里引入它。
```HTML
<head>
    <link rel="stylesheet" href="style.css">
</head>
```

如果我在同一个 `<p>` 标签上，同时用了这三种方式
**行内样式** > **内部样式** = **外部样式** (后写的覆盖先写的)

## css选择器

#### 1.基础
##### 标签选择器 (Tag Selector)

选中页面上**所有**该类型的标签。它是“扫射模式”。
```css
/* 让页面上所有的 <p> 标签文字变红 */
p {
    color: red;
}
```

##### 类选择器 (Class Selector)

选中所有拥有特定 `class` 属性的元素。它是“精准打击模式”。 **后端注意**：这是最推荐使用的方式，因为可以复用。
语法：**`.`** + 类名
```css
/* 选中所有 class="user-card" 的元素 */
.user-card {
    border: 1px solid #ccc;
    padding: 10px;
}
```
##### ID 选择器 (ID Selector)

选中**唯一**的一个元素。
语法：**`#`** + ID名
```css
/* 选中 id="submit-btn" 的那个元素 */
#submit-btn {
    background-color: blue;
}
```

#### 2.层级关系 (结构化)

##### 后代选择器 (Descendant Selector)

语法：空格
```css
/* 选中 class="form-box" 里面 所有的 label */
.form-box label {
    font-weight: bold;
}
```

##### 通配符选择器 (Universal Selector)

选中页面上的**一切**。
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box; 
}
```

#### 3.属性与状态

##### 属性选择器 (Attribute Selector)

根据元素的属性值来找。 **语法**：`[属性名="属性值"]`
```css
/* 选中所有 type="text" 的输入框 */
input[type="text"] {
    width: 200px;
}

/* 选中 name="password" 的那个框 (精准!) */
input[name="password"] {
    background-color: #f0f0f0;
}
```

##### 伪类选择器 (Pseudo-class Selector)

```css
/* 当鼠标悬停在按钮上时，变色 */
button:hover {
    background-color: orange;
    cursor: pointer; /* 鼠标变成小手 */
}
```

**权重排行榜：**

1. **`!important`** (强制生效，尽量别用)
    
2. **行内样式** (`style="..."`)
    
3. **ID 选择器** (`#id`)
    
4. **类选择器** (`.class`)
    
5. **标签选择器** (`div`, `p`)

## css的浮动机制

`float` 属性最初被设计出来，**并不是为了布局**（把菜单放左边，内容放右边），而是为了实现 **“文字环绕图片”** 的效果。

就像报纸上，插一张图在左边，文字会自动绕着图片走。

- **`float: left;`**：元素靠左，文字环绕在右侧。
    
- **`float: right;`**：元素靠右，文字环绕在左侧。
    
- **`float: none;`**：默认值，不浮动。

想象一下，你的网页是一个**排队窗口**（文档流），所有的 `div` 都在老老实实排队。

当你给一个 `div` 加上 `float: left` 时：

1. **它“飘”起来了**：它脱离了原本的排队队伍，浮在了空中（虽然看起来还是贴在页面上）。
    
2. **后面的元素补位**：因为第一个 `div` 飘走了，它原来的位置就空了，后面的元素会**无视它**，直接挤占它的位置。
    
3. **文字依然避让**：虽然后面的盒子会无视浮动元素，但盒子里的**文字**还能感知到它，会围着它转。

```html
<div class="parent">
    <div class="sidebar">我是侧边栏</div>
    <div class="main">我是主内容</div>
</div>
```

```css
.sidebar {
    width: 200px;
    height: 300px;
    background-color: pink;
    float: left; /* 关键：让它飘到左边 */
}

.main {
    width: 500px;
    height: 300px;
    background-color: lightblue;
    float: left; /* 关键：让它也飘起来，紧挨着 sidebar */
}
```

***浮动的副作用***：高度塌陷 (Height Collapse)

如果不给父容器（`.parent`）设置高度，而是希望里面的子元素（`.sidebar`, `.main`）自动把父亲撑开。

**清除该副作用的方法**
简单方法(对于非前端来说)
```css
.parent {
    overflow: hidden; /* 或者是 auto */
}
```


## css的定位机制

#### static

这是所有 HTML 元素的默认状态：老老实实排队（文档流）。

#### relative

元素**相对于它原本的位置**进行移动

- **移动**：你可以用 `top: 20px; left: 20px;` 让它向右下角偏移。
    
- **占位**：**它的肉身虽然移走了，但它的“灵魂”还占着原来的坑位。** 后面的元素不会挤上来。

