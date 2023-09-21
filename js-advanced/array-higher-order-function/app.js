// forEach
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
nums.forEach(function (num) {
    console.log(num ** 3);
});
// 視認性のよいfor-ofの使用が増えてきている
for (const num of nums) {
    console.log(num ** 3);
}

const animals = [
    {
        species: "dog",
        food: "yakiimo",
        cute: 100
    },
    {
        species: "cat",
        food: "chuuuulu",
        cute: 85
    },
    {
        species: "bird",
        food: "himawarinotane",
        cute: 95
    }
];
animals.forEach(function (animal) {
    console.log(`${animal.species}: ${animal.food}`);
});


// map
const cube = nums.map(function (num) {
    return num ** 3;
});
console.log(cube);

const pets = animals.map(function (animal) {
    return animal.species;
});
console.log(pets);


// filter
const evens = nums.filter(num => num % 2 === 0);
console.log(evens);

const superCuteAnimal = animals
    .filter(animal => animal.cute >= 95)
    .map(animal => animal.species);
console.log(superCuteAnimal);

const validUserNames = arr => {
    return arr.filter(str => str.length < 10);
};


// some, every
const someOver10 = nums.some(num => num >= 10);
const someOver15 = nums.some(num => num >= 15);
console.log(someOver10, someOver15); // true false
const everyOver1 = nums.every(num => num >= 1);
const everyOver10 = nums.every(num => num >= 10);
console.log(everyOver1, everyOver10); // true false


// reduce (accumulator, currentValue)
const sum = nums.reduce((sum, num) => sum + num);
const sumDefault100 = nums.reduce((sum, num) => sum + num, 100);
console.log(sum, sumDefault100);

const min = nums.reduce((min, num) => {
    if (min > num) {
        return num;
    } else {
        return min;
    }
})
console.log(min)


// 難: arrow & this vs function & this (no.224)
// Point: アロー関数と普通の関数ではthisの決まり方が違う！
console.log(this);
const person = {
    firstName: "Taro",
    lastName: "Yamada",
    sayFullName: function () {
        console.log(`${this.lastName} ${this.firstName}`);
    },
    sayDelayName: function () {
        setTimeout(() => {
            console.log(this);
            this.sayFullName();
        }, 2000);
    }
};
person.sayDelayName();


// 番外編
// arrow function
const arrowCube = nums.map(num => num ** 3);
const noArg = () => {
    console.log("引数がない場合、()は省略できない");
    return null;
};


// setTimeout（clearIntervalで中止することも可能）
// console.log("one: 前");
// setTimeout(() => {
//     console.log("three: 3000ms経って表示（処理の流れを止めるわけではない！）")
// }, 3000);
// console.log("two: 後");


// setInterval（clearIntervalで止めない限り、2000ms間隔で繰り返す）
// const id = setInterval(() => {
//     console.log(Math.floor(Math.random() * 6) + 1);
// }, 2000);
// clearInterval(id);