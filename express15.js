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
app.listen(3000)
