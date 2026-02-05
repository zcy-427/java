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

