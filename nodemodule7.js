//app.js


const http = require('http');
const routes = require('./routes');
const server = http.createServer(routes);
or 
console.log(routes.someText);
const server = http.createServer(routes.handler);

//routes.js
const fs = require('fs');

const requestHandler = (req,res) =>{
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
fs.writeFileSync('message.txt','DUMMY');
res.statusCode = 302;
res.setHeader('Location','/');
return res.end();
}
res.setHeader('Content-Type','text/html');
res.write('<html>');
res.write('<head><title>My first page</title></head>');
res.write('<body><h1>hello from my node.js server</h1></body>');
res.end();

}

module.exports = requestHandler;
or 
module.exports = {
  handler: requestHandler,
  someText: 'some hard coded text'
};
or 
module.exports.handler = requestHandler;
module.exports.someText = 'Some hard coded text';
or
exports.handler
exports.someText
