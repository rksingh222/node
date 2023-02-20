const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');

//we use this for parsing
npm install --save body-parser
app.use(bodyParser.urlencoded({extended: false}));

const app = express();
//top to bottom execution

app.use('/', (req,res,next) =>{
  console.log("This always runs!");
  next();
});

app.use('/add-product',(req,res,next)=>{
  console.log("In another middleware");
  res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit"></button></form>');
});

app.use('/product',(req,res,next)=>{
  console.log(req.body); // the output comes undefined we need to parse it which is not happening so to parse we need to register parser
  res.redirect('/');
});

//use allows us to create middleware
app.use('/',(req,res,next)=>{
  console.log("In the middleware");
  res.send('<h1>Hello from Express</h1>');
});
 
//once you start a new package you need to install again using npm start as we added in json file
