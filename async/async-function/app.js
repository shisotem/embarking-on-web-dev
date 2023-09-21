async function hello() {

}

const sing = async () => {
    // throw ***: ***をエラーとして投げる
    throw new Error('An err occurred');
    return 'lalala~~~';
}

// Point:
// async function -> 必ずPromiseを返す!
// - 関数が値を返す場合: Promiseはその値でresolveする
// - 関数がエラーをthrowする場合: Promiseはそのエラーでrejectする
sing()
    .then(data => {
        console.log('ok!', data);
    })
    .catch(err => {
        console.log('err!', err);
    });



const login = async (username, password) => {
    if (!username || !password) {
        throw new Error('Username or password is missing');
    }
    if (password === 'asdf') {
        return 'Welcome!';
    }

    throw new Error('Incorrect password');
}

login('hoge', 'sadf')
    .then(msg => {
        console.log('Login succeeded');
        console.log(msg);
    })
    .catch(err => {
        console.log('Login failed');
        console.log(err);
    });