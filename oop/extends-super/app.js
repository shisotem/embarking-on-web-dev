class Pet {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    eat() {
        return `${this.name} is eating food`;
    }
}
// Cat（子）はPet（親）を継承する
class Cat extends Pet {
    constructor(name, age, jumpHeight = 5) {
        // this.name = name;
        // this.age = age;
        super(name, age); // 親（super）のコンストラクタを実行
        this.jumpHeight = jumpHeight;
    }
    meow() {
        return 'meow!';
    }
    // 子にeat()がなければ、親に親にと辿っていく
}

class Dog extends Pet {
    woof() {
        return 'woof!';
    }
    eat() {
        return `${this.name} is full`;
    }
}

// (子) HTMLBodyElement -継承-> HTMLElement -継承-> Element (親)