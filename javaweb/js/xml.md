你会发现 XML 长得和 HTML 极其相似，全是尖括号 `< >`。但它们有本质的区别：

- **HTML 是“死”的**：它的标签是固定的（`<div>`, `<span>`, `<a>`），主要用来**显示页面外观**。
    
- **XML 是“活”的**：它的标签是你**自定义**的，主要用来**存储和传输结构化数据**。
```xml
<?xml version="1.0" encoding="UTF-8"?>
<book>
    <name>《Java 编程思想》</name>
    <price>99.8</price>
    <is_available>true</is_available>
    <authors>
        <author>Bruce Eckel</author>
    </authors>
</book>
```
#### **xml的标准**

- **必须有且只有一个根元素 (Root Element)**： 就像一棵树只能有一个树干。所有的标签都必须包在一个最大的外层标签里（上面的例子中就是 `<book>`）。
    
- **标签必须严格闭合**： `<name>` 必须配对 `</name>`。如果是没有内容的空标签，必须写成 `<tag />`。
    
- **极其区分大小写**： `<Name>` 和 `<name>` 在 XML 眼里是两个完全不同的标签！
    
- **属性值必须加双引号**： `<book id="1001">` 是对的，`<book id=1001>` 直接报错。

#### **CDATA 区 (防爆神器)**

```xml
<select id="getMinorUsers">
    SELECT * FROM users WHERE age < 18
</select>
```
这样的一段sql查询代码会报错：因为XML 看到 `<`（小于号），会把它当成**标签的开头**！它会拼命去寻找对应的 `>` 闭合标签，结果直接解析崩溃

除了把 `<` 转义成 `&lt;` 这种反人类的写法外，我们通常使用 **`CDATA` (Character Data) 区块**。 它的作用是告诉解析器：“**这里面装的都是纯文本，千万别把它当成 XML 标签去解析！**”

```XML
<select id="getMinorUsers">
    SELECT * FROM users WHERE age <![CDATA[ < ]]> 18
</select>
```