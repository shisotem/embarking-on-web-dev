// console.log("if 5 or 6 -> print!");
// const diceNum = Math.floor(Math.random() * 6) + 1;
// if (diceNum == 5 || diceNum == 6) {
//     console.log(`Number is ${diceNum}!`);
// }

// console.log("---");

// const dayNum = parseInt(prompt("Please input day-number"));
// switch (dayNum) {
//     case 1:
//         console.log("Mon");
//         break;
//     case 2:
//         console.log("Tue");
//         break;
//     case 3:
//         console.log("Wed");
//         break;
//     case 4:
//         console.log("Thu");
//         break;
//     case 5:
//         console.log("Fri");
//         break;
//     case 6:
//     case 7:
//         console.log("Holiday!");
//         break;
//     default:
//         console.log("Invalid input");
// }

// console.log("---");

// const board = [
//     [1, 2, 3],
//     [4, 5, 6],
//     [7, 8, 9]
// ];
// // row num はこの場合 let ではなく const 推奨
// for (const row of board) {
//     for (const num of row) {
//         console.log(num);
//     }
// }

// console.log("---");

// const ascii = {
//     A: 65,
//     B: 66,
//     C: 67,
//     D: 68,
//     E: 69,
// };
// for (const alpha of Object.keys(ascii)) {
//     console.log(`${alpha} is No. ${ascii[alpha]}`);
// }
// // 同じ効果
// for (const alpha in ascii) {
//     console.log(`${alpha} is No. ${ascii[alpha]}`);
// }