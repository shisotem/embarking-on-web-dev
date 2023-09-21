// Note: nvm (node version manager)

// ** global.process **
// process.version
// process.release
// process.cwd()
console.log(process.argv);

const args = process.argv.slice(2);
for (const arg of args) {
    console.log(`Hello ${arg}!`);
}