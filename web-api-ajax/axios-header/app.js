const jokes = document.querySelector('#jokes');
const button = document.querySelector('button');

const getDadJoke = async () => {
    try {
        // HTTP header
        const config = {
            headers: {
                Accept: 'application/json'
            }
        };
        const res = await axios.get('https://icanhazdadjoke.com/', config);
        return res.data.joke;
    } catch (e) {
        return 'Error: Failed to get dad joke.';
    }
};

const addNewJoke = async () => {
    const jokeText = await getDadJoke();
    const newLI = document.createElement('LI');
    newLI.append(jokeText);
    jokes.append(newLI);
};

button.addEventListener('click', addNewJoke);