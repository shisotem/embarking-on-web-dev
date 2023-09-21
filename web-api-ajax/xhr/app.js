const req = new XMLHttpRequest(); // XHR

req.onload = function() {
    console.log('ok!');
    const data = JSON.parse(this.responseText);
    console.log(data);
    console.log(data.name, data.height);
};

req.onerror = function() {
    console.log('err!');
    console.log(this);
};

req.open('GET', 'https://swapi.dev/api/people/1/');
req.send();