const http = require('http');

const express = require('express');

const app = express();
//top to bottom execution

app.use('/', (req,res,next) =>{
  console.log("This always runs!");
  next();
});

app.use('/add-product',(req,res,next)=>{
  console.log("In another middleware");
  res.send('<h1>The Add-Product page</h1>');
});

//use allows us to create middleware
app.use('/',(req,res,next)=>{
  console.log("In the middleware");
  res.send('<h1>Hello from Express</h1>');
});
