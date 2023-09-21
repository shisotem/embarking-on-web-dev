const fakeRequest = url => {
    return new Promise((resolve, reject) => {
        const delay = Math.floor(Math.random() * 4500) + 500;
        setTimeout(() => {
            if (delay > 4000) {
                reject('connection time out');
            } else {
                resolve(`dummy data (${url})`);
            }
        }, delay);
    })
}

async function makeRequest() {
    // try-catchブロックでPromiseをラップすることで、
    // Promiseがrejectされた場合にエラーをキャッチできる
    try {
        // awaitはPromiseがrejectされた場合にエラーを生じさせる
        const data1 = await fakeRequest('/dummy1');
        console.log('ok!');
        console.log(`data1: ${data1}`);
        const data2 = await fakeRequest('/dummy2');
        console.log('ok!');
        console.log(`data2: ${data2}`);
    } catch (e) {
        console.log('err!');
        console.log(e);
    }
}

makeRequest();