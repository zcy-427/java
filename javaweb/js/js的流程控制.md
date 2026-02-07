
## 1.条件判断：`if...else`

在 **JS** 中，**万物皆可判断**。任何数据类型都可以被自动转换成布尔值。

- **假值 (Falsy)**：会被当成 `false` 的值。**只有这 6 个**：
    
    1. `false`
        
    2. `0` (数字零)
        
    3. `""` (空字符串)
        
    4. `null`
        
    5. `undefined`
        
    6. `NaN` (Not a Number)
其他的都是真值

## 2.多重选择：`switch`
语法和 Java 99% 一样。

JS 的 `switch` 在比较时，使用的是 **`===` (严格等于)**。 这意味着：如果你 `switch(1)` 而 `case "1"`，是匹配不上的（类型不同）。

## 3.循环结构：`for` 与 `while`
与java一样

## 4.增强型循环：`for...in` vs `for...of`

#### `for...in` (遍历 Keys - 别乱用)

它是为了遍历**对象 (Object) 的属性名**而设计的。

```js
let person = { name: "Java导师", age: 30 };

for (let key in person) {
    console.log(key); // 输出 "name", "age" (属性名)
    console.log(person[key]); // 输出 "Java导师", 30 (属性值)
}
```

#### `for...of` (遍历 Values - 推荐使用)

这是 **ES6** 新出的，专门用来对标 Java 的增强 `for` 循环。它用来遍历**数组 (Array) 的值**。

```js
let skills = ["Java", "HTML", "CSS"];

// Java 写法: for (String skill : skills)
// JS 写法:
for (let skill of skills) {
    console.log(skill); // 输出 "Java", "HTML", "CSS"
}
```

