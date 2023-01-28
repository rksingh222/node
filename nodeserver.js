const http = require('http');

const server = http.createServer((req,res){
  console.log(req)
});
server.listen(3000);

run on terminal
node nodeserver.js
and also 
in browser click
localhost:3000 
in terminal you will see the log message
