// fetchと違い、json()を処理するステップが必要がない
axios.get('https://swapi.dev/api/people/1/')
    .then(res => {
        console.log('RESOLVE!');
        console.log(res);
        console.log(res.data); // dataに既にJSONが入っている!
    })
    .catch(e => {
        console.log('REJECT!');
        console.log(e);
    });

const getStarWarsPerson = async (id) => {
    try {
        const res = await axios.get(`https://swapi.dev/api/people/${id}/`);
        console.log('RESOLVE!');
        console.log(res);
        console.log(res.data);
    } catch(e) {
        console.log('REJECT!');
        console.log(e);
    }
};

getStarWarsPerson(4);
getStarWarsPerson(8);