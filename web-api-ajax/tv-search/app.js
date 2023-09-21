const form = document.querySelector('#searchForm');
form.addEventListener('submit', async function (e) {
    e.preventDefault();
    removeImages();
    const searchTermInput = form.elements.query; // input element
    // query parameters
    const config = {
        params: {
            q: searchTermInput.value
        }
    };
    const res = await axios.get('https://api.tvmaze.com/search/shows', config);
    makeImages(res.data);
    searchTermInput.value = '';
});

const makeImages = results => {
    for (const result of results) {
        if (result.show.image) {
            const img = document.createElement('IMG');
            img.src = result.show.image.medium;
            document.body.append(img);
        }
    }
};

const removeImages = () => {
    const images = document.querySelectorAll('img');
    images.forEach(image => image.remove());
};