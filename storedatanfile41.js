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

  const errorController = require('./controllers/error');

  //set global configuration values
  app.set('view engine','ejs');
  //because its in views folder if its in someother folder then give that name like example templates
  app.set('views','views');
  app.use(errorController.get404);

  const adminRoutes = require('./routes/admin'):
  const shopRoutes = require('./routes/shop');
  app.use(bodyParser.urlencoded({extended: false}));

  //to use public folders or give read access to 
  app.use(express.static(path.join(__dirname,'public'));

  app.use('/admin',adminRoutes);
  app.use(shopRoutes);
  app.use((req,res, next) => {
    //res.status(404).send('<h1>Page Not Found </h1>');
    //this will look only for pug file
    res.status(404).render('404',{pageTitle:'page Not found'});
  });
  app.listen(3000);

 //controller/products.js
  const Product = require('../models/product');
 exports.getAddProduct = (req,res,next)=>{
   //res.sendFile(path.join(rootDir,'views','add-product.html'));
   //for pug type of file
   res.render('add-product', {pageTitle: 'Add Product',path:'/admin/add-product',formsCSS:true, productCSS:true, activeAddProduct:true});
 };

 exports.postAddProduct = (req,res,next)=>{
    console.log(req.body); // the output comes undefined we need to parse it which is not happening so to parse we need to register parser
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
  }
 exports.getProducts = (req,res,next)=>{
    const products = Product.fetchAll();
    res.render('shop',{prods:products,docTitle:'Shop', path:'/',hasProducts: products.length > 0
                      });
  }


  //controller/errors.js
  export.get404 = (req, res, next) =>{
    res.status(404).render('404',{pageTitle: 'Page Not Found'});
  }

  models/prodduct.js
 
  const fs = require('fs');
  const path = require('path');
 

  module.exports = Class Product {
    constructor(title){
      this.title = title
    }
    save(){
      //create data folder
      const p = path.join(path.dirname(process.mainModule.filename),'data','products.json');
      fs.readFile(p,(err,fileContent)=>{
        //we will get an error because it does not have file
        //console.log(err);
        //console.log(fileContent);
        let products=[];
        if(!err){
          products = JSON.parse(fileContent);
        }
        //this refers to the class
        products.push(this);
        fs.writeFile(p,JSON.stringify(products),(err)=>{
          console.log(err);
        });
      });
    }
    //retrieve all values is a utility function
    //call this method directly on the class itself
    static fetchAll(){
      const p = path.join(path.dirname(process.mainModule.filename),'data','products.json');
      fs.readFile(p,(err,fileContent)=>{
        if(err){
          return [];
        }
        return JSON.parse(fileContent);
      });
    }
  }


  //routes/admin.js
  const path = require('path');
  const express = require('express');
  const router = express.Router();
  const productsController = require('../controller/product'):

  router.get('/add-product',produtsController.getAddProduct);

  //for handling post request we can use app.post or app.get or app.patch or app.post or app.delete or app.put
  router.post('/product',productsController.postAddProduct);

  //module.exports = Router;
  module.exports = router;


  //routes/shop.js
  const path = require('path');
  const express = require('express');
  const router = express.Router();
  const productsController = require('../controllers/product');

  //get post will actually to do exact match  instead if we use router.use() it will work differently
  router.get('/',productsController.getProducts);

  module.exports = Router;



  views//includes/head.ejs

  <head>
  <meta>
  <title></title>
  </head>


  views//include/end.ejs

  </body>
  </htmL>

  views//includes/navigation.ejs
  <header>
    <a class="<%= path === '/admin/add-product' ? 'active': ''%>" href=>
    <a class="<%= path === '/' ? 'active': ''%>" href=>
  </header>


  //views/404.ejs
  <%- include('includes/head.ejs') %>
  </head>
  <body>
    <%- include('includes/naviation.ejs') %>
    <h1> page Not Found </h1>
  <%- include('includes/end.ejs') %>
  //views/add-product.ejs
  <%- include('includes/head.ejs') %>
     <link>
     </link>
  </head>
  <body>
      <%- include('includes/naviation.ejs') %>
  <form>
      </form>
  <%- include('includes/end.ejs') %>
      
  //views/shop.ejs
  <%- include('includes/head.ejs') %>
  </head>
   <%- include('includes/naviation.ejs') %>
  <% if(prods.length > 0) { %>
    <div>
    <% for(let product of prods) { %>
      <%= product.title %>
    <% } %>
  <% } else { %>
  <% } %>
    <%- include('includes/end.ejs') %>
