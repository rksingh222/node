const http = require('http');

const express = require('express');

const app = express();

//if we do not use next it will die and no request will happen
// express js does not send default response
//use allows us to create middleware
app.use((req,res,next)=>{
  console.log("In the middleware");
  next(); //Allows the request to continue to the next middleware in line
});
//when you start the server
app.use((req,res,next)=>{
  console.log("In another middleware");
  //new utility function to send response 
  res.send("<h1>Hello from express </h1>");
  //open network tab=> headers => response header => content type => html
});
const server = http.createrServer(app);

server.listent(3000);
