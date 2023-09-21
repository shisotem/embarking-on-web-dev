const delayedColorChange = (newColor, delay) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            document.body.style.backgroundColor = newColor;
            resolve();
        }, delay);
    });
};

// delayedColorChange('red', 1000)
//     .then(() => delayedColorChange('orange', 1000))
//     .then(() => delayedColorChange('yellow', 1000))
//     .then(() => delayedColorChange('green', 1000))
//     .then(() => delayedColorChange('blue', 1000))
//     .then(() => delayedColorChange('indigo', 1000))
//     .then(() => delayedColorChange('violet', 1000));


// awaitはasyncFuncの中でしか使えない 
async function rainbow() {
    // await: Promise（delayedColorChange('red', 1000)）が、
    // resolveまたはrejectするまで、asyncFuncの実行を停止する!
    await delayedColorChange('red', 1000);
    await delayedColorChange('orange', 1000);
    await delayedColorChange('yellow', 1000);
    await delayedColorChange('green', 1000);
    await delayedColorChange('blue', 1000);
    await delayedColorChange('indigo', 1000);
    await delayedColorChange('violet', 1000);
}

// // rainbow()自身もPromiseをresolveで返す
// rainbow()
//     .then(() => {
//         console.log('Finish');
//     });

async function printRainbow() {
    await rainbow();
    console.log('Finish');
}

printRainbow();