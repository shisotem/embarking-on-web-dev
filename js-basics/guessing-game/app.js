let maxNum = parseInt(prompt("Input max number (>= 1)"));
while (isNaN(maxNum) || maxNum <= 0) {
    maxNum = parseInt(prompt("Invalid input. Input max number (>= 1)"));
}

const targetNum = Math.floor(Math.random() * maxNum) + 1;
let guessingNum = prompt("Input your guessing number");
let count = 1;

while (parseInt(guessingNum) !== targetNum) {
    if (guessingNum === "q") {
        break;
    } else if (isNaN(parseInt(guessingNum))) {
        guessingNum = prompt("Invalid input. Input your guessing \"number\"");
    } else if (guessingNum > targetNum) {
        guessingNum = prompt("too big!");
    } else if (guessingNum < targetNum) {
        guessingNum = prompt("too small!");
    }
    count++;
}

if (guessingNum === "q") {
    alert("Keyboard interruption")
} else {
    alert(`Your score: ${count} times guessing!`);
}