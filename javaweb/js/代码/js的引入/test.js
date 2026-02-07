function verify() {
    alert("this is a btn");
}

class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }   
    sayHello() {
        console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
    }
}

let person1 = new Person("Alice", 30);
person1.sayHello();