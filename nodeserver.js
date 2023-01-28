const http = require('http');

const server = http.createServer((req,res){
  console.log(req)
console.log(req.url, req.method, req.headers);
});
server.listen(3000);

run on terminal
node nodeserver.js
and also 
in browser click
localhost:3000 
in terminal you will see the log message

near console.log(req)
if we give process.exit(); it stops event loop 
