when trying to use rest api 

<button id="get">get post</button>
<button id="post">create a post</button>

const getButton = document.getElementById('get');

const postButton = document.getElementById('post');

getButton.addEventListener('click',()=>{
  fetch('http://localhost:8080/feed/posts').then(res => res.json()).then(resData => console.log(resData)).catch(err => console.log(err))
})

will give us this error

dex.html:1 Access to fetch at 'http://localhost:8080/feed/posts' 
from origin 'https://cdpn.io' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.

if client and server run in the same domain for example localhost:3030 then this error will not come we do not need to set any headers at server side

however if client and server run in the different domain for example one on localhost: 3000 and other in localhost: 8000 then we get this type of errors
and to fix this we need to set headers at server side 

to fix this we need to set three headers

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
    next();
})

after setting headers and calling the previous html code we will get the server response without CORS error
