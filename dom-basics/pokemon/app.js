const container = document.querySelector('#container');
const baseURL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'

for (let i = 1; i <= 151; i++) {
    const pokemon = document.createElement('div');
    pokemon.classList.add('pokemon');

    const newImg = document.createElement('img');
    newImg.src = `${baseURL}${i}.png`;

    const label = document.createElement('span');
    label.innerText = `#${i}`;

    container.appendChild(pokemon);
    pokemon.appendChild(newImg);
    pokemon.appendChild(label);
}

/* <div>
    <img></img>
    <span></span>
</div> */