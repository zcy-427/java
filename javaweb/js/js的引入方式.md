## 1.行内js
直接写在 HTML 标签的事件属性里（比如点击事件 `onclick`）。

```html
<button onclick="alert('后端接口报错啦！')">点我测试</button>
```
但是代码和 HTML 混在一起，极难维护。

## 2.内部 JS
在 HTML 文件里，使用 `<script>` 标签包裹 JS 代码。

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>JS Demo</title>
</head>
<body>
    <h1>看控制台</h1>

    <script>
        // 这是 JS 代码注释
        console.log("Java 导师：网页加载完成了！");

        // 定义一个变量
        var message = "Hello Backend";
    </script>
</body>
</html>
```

适合写只有当前页面用到的小逻辑。

## 3.外部 JS
把 JS 代码单独写在后缀为 `.js` 的文件中，然后通过 HTML 引入。这是 **前后端分离** 开发的基础。

1. 新建js文件
```js
/* logic.js */
function checkLogin() {
    alert("正在请求 Java 后端接口...");
}
```
2. 在HTML当中引入
```html
<script src="logic.js"></script>
```

## js应该放在哪里

**正确做法 1 (传统)**： 把 `<script>` 标签放在 **`<body>` 的最底部**（在 `</body>` 闭合标签之前）。
原理：先让 HTML 骨架和 CSS 样式加载完，显示给用户看，最后再加载 JS 脚本。

**正确做法 2 (现代标准 - 推荐)**： 放在 `<head>` 里，但是加上 **`defer`** 属性。
```HTML
<head>
    <script src="main.js" defer></script>
</head>
```


## 注意事项
1.一个html中可以有多个script标签
2.一对script标签不能在引入外部js文件的同时定义内部脚本
3.script标签如果用于引入外部js文件，中间最好不要有任何字符包括空格与换行