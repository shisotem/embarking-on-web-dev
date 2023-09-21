// JSON形式のデータにはundefinedが存在しない
Data = "{\"name\": \"GitHub Copilot\",\"age\": 2,\"isAI\": true,\"languages\": [\"Python\", \"JavaScript\", \"Java\", \"C++\"],\"address\": {\"city\": \"San Francisco\",\"state\": \"California\",\"country\": \"United States\"}}";
console.log(Data);
console.log(Data.name);

const parsedData = JSON.parse(Data);
console.log(parsedData);
console.log(parsedData.address.city);


// Array中にないundefinedは省略される
let dog = {name: 'Lucia', color: ['gray'], dislike: undefined};
console.log(JSON.stringify(dog));

// Array中のundefinedはnullに変換される
dog = {name: 'Lucia', color: ['gray', undefined]};
console.log(JSON.stringify(dog));