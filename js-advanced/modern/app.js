// default arg
function greet(person, msg = "hello", suffix = "!") {
    console.log(`${msg} ${person} ${suffix}`);
}
greet("yamada");
greet("yamada", undefined, "?");


// spread
const nums = [1, 4, 2, 4, 6, 3, 2];
console.log(Math.max(nums)); // NaN
console.log(Math.max(...nums));
console.log("ABCDE");
console.log(..."ABCDE");

const arrA = [1, 2, 3, 4];
const arrB = [5, 6, 7, 8, 9];
console.log(arrA.concat(arrB));
console.log([...arrA, ...arrB]);
console.log([...arrA, "foo", ...arrB]);
console.log([..."XYZ"]);

const cat = {
    size: "tiny",
    tail: "thin",
    favs: "fish"
};
const dog = {
    cry: "woof!",
    tail: "thick",
    favs: "meat"
};
// オブジェクトの複製
console.log({ ...dog });
console.log({ ...dog, ...cat });
console.log({ ...cat, ...dog });
console.log({ ...cat, ...dog, foo: "!!!" });

console.log({ ...[2, 4, 3, 5, 6] });
console.log({ ..."AIFLD" });


// arguments
// 配列のように振る舞うが、length以外のプロパティはほぼ使用不可 / arrow関数では使用不可
function sumByArguments() {
    let sum = 0;
    for (let i = 0; i < arguments.length; i++) {
        sum += arguments[i];
    }
    return sum;
}
console.log(sumByArguments(1, 2, 3));


// rest arg
function sum(...nums) {
    return nums.reduce((sum, num) => sum + num);
}
console.log(sum(1, 2, 3));

function colors(gold, silver, ...rest) {
    console.log(`金: ${gold}`);
    console.log(`銀: ${silver}`);
    console.log(`その他: ${rest}`);
}
colors("G", "S", "R", "G", "B");


// destructuring assignment
const arr = [12, 34, 56, 78, 90];
const [zero, one, two, ...rest] = arr;
console.log(zero, one, two, rest);

const user = {
    name: "Alexandre",
    age: 75,
    address: "silicon-valley",
    pet: "poodle",
};
const { name, age } = user;
console.log(name, age);
const { address: town } = user;
console.log(town);
// default value
const { pet: friend = "dog", favs = "pizza" } = user;
console.log(friend); // poodle
console.log(favs); // undefined => pizza

function election({ age = "secret", name }) {
    console.log(age, name);
}
election(user);
const animals = [
    {
        species: "dog",
        food: "yakiimo",
        cute: 100,
        weight: 25000
    },
    {
        species: "cat",
        food: "chuuuulu",
        cute: 85,
        weight: 3000
    },
    {
        species: "bird",
        food: "himawarinotane",
        cute: 95,
        weight: 500
    }
];
// {}を囲む、引数の()は省略不可
const cuteHeavyAnimals = animals
    .filter(({ cute, weight }) => cute >= 95 && weight >= 3000)
    .map(animal => animal.species);
console.log(cuteHeavyAnimals);