Installing express 

npm install --save express (production)

middleware means that incoming request is automatically funnelled through a bunch of functions by express js
pluggable nature of express js where you can eaily add other third party package which simply happens to give you such middleware function
that you can plug into express js and add certain functionality

const http = require('http');

const express = require('express');

const app = express();

//use allows us to create middleware
app.use((req,res,next)=>{
  console.log("In the middleware");
  next(); //Allows the request to continue to the next middleware in line
});
//when you start the server
app.use((req,res,next)=>{
  console.log("In another middleware");
});
const server = http.createrServer(app);

server.listent(3000);
