## 字面量方式 (Object Literal)

```js
// 不需要 class User { ... }
const student = {
    // 属性 (Property)
    name: "张三",
    age: 18,
    isGraduated: false,

    // 方法 (Method) - 这是一个匿名函数
    study: function() {
        console.log(this.name + " 正在学习 Java");
    },
    
    // ES6 简写方法 (推荐，更像 Java)
    sleep() {
        console.log("睡觉中...");
    }
};

// 调用
console.log(student.name); // 张三
student.study();           // 张三 正在学习 Java
```

## 构造函数方式 (Constructor Function)

```js
// 定义一个“构造函数”
function Student(name, age) {
    this.name = name;
    this.age = age;
    this.study = function() {
        console.log(this.name + " 正在复习");
    }
}

// 使用 new 关键字来创建
const s1 = new Student("李四", 20);
const s2 = new Student("王五", 22);

console.log(s1.name);
console.log(s2.name);
```

## ES6 类 (Class)

```js
class Person {
    // 构造器 (Java 里是类名，JS 里固定叫 constructor)
    constructor(name, job) {
        this.name = name; // 属性直接定义在 this 上，不需要在类顶部先声明
        this.job = job;
    }

    // 定义方法 (不需要 function 关键字)
    sayHi() {
        console.log(`大家好，我是 ${this.name}，职业是 ${this.job}`);
    }
}

// 实例化
const p1 = new Person("Java导师", "程序员");
p1.sayHi();
```