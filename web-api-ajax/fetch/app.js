console.log(fetch('https://swapi.dev/api/people/1/')); // fetch: Promiseを返す

fetch('https://swapi.dev/api/people/1/') // => Promiseが...
    .then(res => { // resolve()した時
        console.log('RESOLVE1!', res); // res(Response): HTTPheaderのみ到着済(bodyは未到着)
        return res.json(); // => Promiseが...
    })
    .then(data => { // resolve()した時
        console.log(data); // data: bodyが到着済
        return fetch('https://swapi.dev/api/people/2/');
    })
    .then(res => {
        console.log('RESOLVE2!', res);
        return res.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(err => { // reject()した時
        console.log('REJECT!', err);
    })



const loadStarWarsPeople = async () => {
    try {
        const res = await fetch('https://swapi.dev/api/people/1/');
        console.log('RESOLVE(async)!', res);
        const data = await res.json();
        console.log(data);

        const res2 = await fetch('https://swapi.dev/api/people/2/');
        console.log('RESOLVE(async)!', res2);
        const data2 = await res2.json();
        console.log(data2);
    } catch(e) {
        console.log('REJECT(async)!', e);
    }
};

loadStarWarsPeople();