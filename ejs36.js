npm install --save express-handlebars@3.0

EJS.  <p> <% name=%></p>
Pug(Jade) p #{name}
Handlebars  <p>{{ name }}</p>

Installing and implementing pug
npm install --save ejs pug express-handlebars 


//app.js

const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');

const app = express();


//set global configuration values
app.set('view engine','ejs');
//because its in views folder if its in someother folder then give that name like example templates
app.set('views','views');

const adminData = require('./routes/admin'):
const shopRoutes = require('./routes/shop');
app.use(bodyParser.urlencoded({extended: false}));

//to use public folders or give read access to 
app.use(express.static(path.join(__dirname,'public'));

app.use('/admin,adminData.routes);
app.use(shopRoutes);
app.use((req,res, next) => {
  //res.status(404).send('<h1>Page Not Found </h1>');
  //this will look only for pug file
  res.status(404).render('404',{pageTitle:'page Not found'});
});
app.listen(3000);

//routes/admin.js
const path = require('path');
const express = require('express');
const router = express.Router();
const rootDir = require('../util/path');
const products = [];

router.get('/add-product',(req,res,next)=>{
  //res.sendFile(path.join(rootDir,'views','add-product.html'));
  //for pug type of file
  res.render('add-product', {pageTitle: 'Add Product',path:'/admin/add-product'});
});

//for handling post request we can use app.post or app.get or app.patch or app.post or app.delete or app.put
router.post('/product',(req,res,next)=>{
  console.log(req.body); // the output comes undefined we need to parse it which is not happening so to parse we need to register parser
  products.push({title: req.body.title});
  res.redirect('/');
});

//module.exports = Router;
exports.routes = router;
exports.products = products;

//routes/shop.js
const path = require('path');
const express = require('express');
const router = express.Router();
const rootDir = require('../util/path');
const adminData = require("./admin");

//get post will actually to do exact match  instead if we use router.use() it will work differently
router.get('/',(req,res,next)=>{
  /*console.log(adminData.products);
  res.sendFile(path.join(rootDir,'views','shop.html'): //this will work both for linux path as well as windows
               //dirname will point to current folder */
  const products = adminData.products;
  res.render('shop',{prods:products,docTitle:'Shop', path:'/',hasProducts: products.length > 0
                    });
});
 
module.exports = Router;

//views/404.ejs
<title><%= pageTitle %></title>

//views/add-product.ejs
<title><%= pageTitle %></title>
rest will stay as it is

//views/shop.ejs
<title><%= pageTitle %></title>
//normal javascript code
<% if(prods.length > 0) { %>
  <div>
  <% for(let product of prods) { %>
    <%= product.title %>
  <% } %>
<% } else { %>
<% } %>
