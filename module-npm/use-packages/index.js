const jokes = require('give-me-a-joke'); // ./ 不要
const colors = require('colors'); // ./ 不要

jokes.getRandomDadJoke(function (joke) {
    console.log(joke.rainbow);
});

// rainbow: String.prototype にrainbowプロパティを追加している！
// console.log(String.prototype);

// console.log(jokes);
// { getRandomCNJoke: [Function],
//   getCustomJoke: [Function],
//   getRandomDadJoke: [Function],
//   getRandomJokeOfTheDay: [Function] }