const xhr = new XMLHttpRequest;
xhr.open('get', 'http://127.0.0.1:8888', true);
xhr.send(null);

//
console.log(xhr.responseText);
