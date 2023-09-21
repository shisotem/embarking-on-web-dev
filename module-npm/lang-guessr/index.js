const franc = require('franc');
const langs = require('langs');
const colors = require('colors');

const str = process.argv.slice(2).join(' ');

const langCode = franc(str, { minLength: 3 });

if (langCode === 'und') {
    console.log('Could not determine language!'.red);
} else {
    const language = langs.where('3', langCode).name;
    console.log(language.green);
}