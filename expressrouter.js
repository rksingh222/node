//app.js

const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const adminRoutes = require('./routes/admin'):
const shopRoutes = require('./routes/shop');
app.use(bodyParser.urlencoded({extended: false}));
app.use(adminRoutes);
app.use(shopRoutes);
app.listen(3000);

//routes/admin.js

const express = require('express');
const router = express.Router();

router.use('/add-product',(req,res,next)=>{
  console.log("In another middleware");
  res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit"></button></form>');
});

//for handling post request we can use app.post or app.get or app.patch or app.post or app.delete or app.put
router.post('/product',(req,res,next)=>{
  console.log(req.body); // the output comes undefined we need to parse it which is not happening so to parse we need to register parser
  res.redirect('/');
});

module.exports = Router;

//routes/shop.js

const express = require('express');
const router = express.Router();

//get post will actually to do exact match  instead if we use router.use() it will work differently
router.get('/',(req,res,next)=>{
  console.log("In the middleware");
  res.send('<h1>Hello from Express</h1>');
});
 
module.exports = Router;




