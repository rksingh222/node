the url is localhost:3000/admin/add-product
filtering mechanism put a common starting segment for our path which all routes in a given file to outsource that in the app.js file
//app.js

const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const adminRoutes = require('./routes/admin'):
const shopRoutes = require('./routes/shop');
app.use(bodyParser.urlencoded({extended: false}));
app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use((req,res, next) => {
  res.status(404).send('<h1>Page Not Found </h1>');
});
app.listen(3000);

//routes/admin.js

//lets say all routes start with /admin/add-product
//to call that we add that before /add-product but we can do that in app.use in app.js 

const express = require('express');
const router = express.Router();

//reaches admin/add-produt => GET
router.get('/add-product',(req,res,next)=>{
  console.log("In another middleware");
  res.send('<form action="/admin/add-product" method="POST"><input type="text" name="title"><button type="submit"></button></form>');
});

//reaches admin/add-product => POST
//for handling post request we can use app.post or app.get or app.patch or app.post or app.delete or app.put
router.post('/add-product',(req,res,next)=>{
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
