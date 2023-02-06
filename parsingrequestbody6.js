const http = require('http');
const fs = require('fs');

const server = http.createServer((req,res) => {
const url = req.url;
const method = req.method;
if(url === '/'){
res.write('<html>');
res.write('<head><title>Enter Message</title></head>');
res.write('<body><form action="/message" method="POST"><input type="text" name="message"></body>');
res.write('</html>');
return res.end();
}
if(url === '/message' && method === 'POST') {
const body=[];
req.on('data',(chunk)=> {
  console.log(chunk);
  body.push(chunk);
});
  req.on('end',()=>{
    const parseBody = Buffer.concat(body).toString();
    console.log(parseBody);
    const message = parsedBody.split('=')[1];
    fs.writeFileSync('message.txt',message);
  });

res.statusCode = 302;
res.setHeader('Location','/');
return res.end();
}
res.setHeader('Content-Type','text/html');
res.write('<html>');
res.write('<head><title>My first page</title></head>');
res.write('<body><h1>hello from my node.js server</h1></body>');
res.end();
});
