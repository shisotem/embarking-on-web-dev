// ** dummy request **

// callback ver. (callback hell)
// const fakeRequestCallback = (url, success, failure) => {
//     const delay = Math.floor(Math.random() * 4500) + 500; // 500 <= delay < 5000
//     setTimeout(() => {
//         if (delay > 4000) {
//             failure('connection time out');
//         } else {
//             success(`dummy data (${url})`);
//         }
//     }, delay);
// };

// fakeRequestCallback('mountain.com/page1', function (response) {
//     console.log('ok1!', response);
//     fakeRequestCallback('mountain.com/page2', function (response) {
//         console.log('ok2!', response);
//         fakeRequestCallback('mountain.com/page3', function (response) {
//             console.log('ok3!', response);
//         }, function (err) {
//             console.log('err3!', err);
//         });
//     }, function (err) {
//         console.log('err2!', err);
//     });
// }, function (err) {
//     console.log('err1!', err);
// });

// promise ver.
const fakeRequestPromise = url => {
    return new Promise((resolve, reject) => {
        const delay = Math.floor(Math.random() * 4500) + 500;
        setTimeout(() => {
            if (delay > 4000) {
                reject('connection time out');
            } else {
                resolve(`dummy data (${url})`);
            }
        }, delay);
    });
};

// fakeRequestPromise('yelp.com/api/coffee/page1c')
//     .then(() => { // 成功時
//         console.log('ok1!');
//         fakeRequestPromise('yelp.com/api/coffee/page2')
//             .then(() => {
//                 console.log('ok2!');
//                 fakeRequestPromise('yelp.com/api/coffee/page3')
//                     .then(() => {
//                         console.log('ok3!');
//                     })
//                     .catch(() => {
//                         console.log('err3!')
//                     });
//             })
//             .catch(() => {
//                 console.log('err2!')
//             });
//     })
//     .catch(() => { // 失敗時
//         console.log('err1!')
//     });

fakeRequestPromise('yelp.com/api/coffee/page1')
    .then((data) => {
        console.log('ok1!', data);
        return fakeRequestPromise('yelp.com/api/coffee/page2');
    })
    .then((data) => {
        console.log('ok2!', data);
        return fakeRequestPromise('yelp.com/api/coffee/page3');
    })
    .then((data) => {
        console.log('ok3!', data);
    })
    .catch((err) => {
        console.log('err!', err);
    });