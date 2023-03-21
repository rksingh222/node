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
         res.status(404).render('404',{pageTitle:'page Not found', path:'/404'});
       });
       app.listen(3000);


      //controller/admin.js
       const Product = require('../models/product');
       exports.getAddProduct = (req,res,next)=>{
        //res.sendFile(path.join(rootDir,'views','add-product.html'));
        //for pug type of file
        res.render('add-product', {pageTitle: 'Add Product',path:'/admin/add-product',formsCSS:true, productCSS:true, activeAddProduct:true});
      };

      exports.postAddProduct = (req,res,next)=>{
         console.log(req.body); // the output comes undefined we need to parse it which is not happening so to parse we need to register parser
         const title = req.body.title;
        const imageUrl = req.body.imageUrl;
        const price = req.body.price;
        const description = req.body.description;
        const product = new Product(title, imageUrl, price, description);
         product.save();
         res.redirect('/');
       }

       exports.getProducts = (req,res,next)=>{
          Product.fetchAll((products) =>{
           res.render('admin/products',{prods:products,docTitle:'All Products', path:'/admin/products'
                           });
         });
       };

      //controller/shop.js
      const Product = require('../models/product');

      exports.getProducts = (req,res,next)=>{
         Product.fetchAll((products) =>{
           res.render('shop',{prods:products,docTitle:'All Products', path:'/products'
                           });
         });
       };

      export.getProduct = (req,res,next)=> {
        const prodId = req.params.productId;
        /*
        this is refering to cb in FindById function
        product => {
          console.log(product);
        }
        */
        Product.findById(prodId, product => {
          res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products' /* this is linked to the selected link in the navigation . this we are sending for navigation.ejs file path value */
          });
        });
        res.redirect('/');
      }

       exports.getIndex = (req, res, next)=>{
           Product.fetchAll((products) =>{
           res.render('shop/index',{prods:products,docTitle:'Shop', path:'/'
                           });
         });
       };
       exports.getCart = (req, res, next)=>{
         res.render('shop/cart', {
           'shop/cart', {
           path: '/cart',
           docTitle: 'Your Cart'
         });
       };

       exports.getCheckout =(req,res,next)=>{
         res.render('shop/checkout',{
           path: '/checkout',
           pageTitle: 'checkout'
         });
       };


       //controller/errors.js
       export.get404 = (req, res, next) =>{
         res.status(404).render('404',{pageTitle: 'Page Not Found'});
       }

       models/prodduct.js

       const fs = require('fs');
       const path = require('path');
       const p = path.join(path.dirname(process.mainModule.filename),'data','products.json');

       const getProductsFromFile = (cb)=>{
           fs.readFile(p,(err,fileContent)=>{
             if(err){
               cb([]);
             }else{
                cb(JSON.parse(fileContent));
             }
           });
       }

       module.exports = Class Product {
         constructor(title,imageUrl,description,price){
           this.title = title;
           this.imageUrl = imageUrl;
           this.description = description;
           this.price = price;
         }
         save(){
           this.id = Math.random().toString();
           //create data folder

           /* this is cb here 
             products =>{
               products.push(this);
                fs.writeFile(p,JSON.stringify(products),(err)=>{
               console.log(err);
                } 
                */
             getProductsFromFile(products =>{
               products.push(this);
                fs.writeFile(p,JSON.stringify(products),(err)=>{
               console.log(err);
                });
             });
         }
         //retrieve all values is a utility function
         //call this method directly on the class itself
         //it gives an error
         //this function does not return anything
         //it returns undefined
         //cb is callback
         static fetchAll(cb){
           getProductsFromFile(cb);
         }

         static findById(id,cb){
           getProductsFromFile(products =>{
             const product = products.find( p => p.id ==id);
             cb(product);
           });   
         }
       }


       //routes/admin.js
       const path = require('path');
       const express = require('express');
       const router = express.Router();
       const adminController = require('../controller/admin'):

       router.get('/add-product',adminController.getAddProduct);

       router.get('/products', adminController.getProducts);    

       //for handling post request we can use app.post or app.get or app.patch or app.post or app.delete or app.put
       router.post('/product',productsController.postAddProduct);

       //module.exports = Router;
       module.exports = router;


       //routes/shop.js
       const path = require('path');
       const express = require('express');
       const router = express.Router();
       const shopController = require('../controllers/shop');

       //get post will actually to do exact match  instead if we use router.use() it will work differently
       router.get('/',shopController.getIndex);
       router.get('/products', shopController.getProducts);

       //extracting params
       router.get('/products/:productId'. shopController.get);

       router.get('/cart', shopController.getCart);
       router.get('/checkout', shopController.getCheckout);

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
       <header class="main-header">
        <nav class="main_header_nav">
        <ul class="main_header__item-list">
        <li class="main-header__item">
        <a class="<%= path === '/'? 'active':'' %>" href="/">Shop</a>
        </li>
        <li class="main-header__item">
        <a class="<%= path === '/products'? 'active':'' %>" href="/products">products</a>
        </li>
        <li class="main-header__item">
        <a class="<%= path === '/cart'? 'active':'' %>" href="/cart">Cart</a>
        </li>
        <li class="main-header__item">
        <a class="<%= path === '/admin/add-product'? 'active':'' %>" href="/admin/add-prouct">Add Product</a>
        </li>    
        <li class="main-header__item">
        <a class="<%= path === '/admin/products'? 'active':'' %>" href="/admin/products">Admin Products</a>
        </li>  
        </ul>
        </nav>
        </header>
       //views/admin/add-product.ejs
       <main>
       <form class="product-form" action="/admin/add-product" method="POST">
       <div class="form-control">
        <label for="title">Title</label>
        <input type="text" name="title" id="title">
       </div>
       <div class="form-control">
        <label for="imageUrl">Image Url</label>
        <input type="text" name="imageUrl" id="imageUrl">
       </div>
       <div class="form-control">
        <label for="price">price</label>
        <input type="number" name="price" id="price" step="0.01">
       </div>
       <div class="form-control">
        <label for="description">price</label>
        <textarea name="description" id="description" rows="5"></textarea>
       </div>

       //views/admin/products.ejs
       <%- include('../includes/head.ejs') %>
       </head>
       <body>
       <%- include('../includes/navigation.ejs') %>
       <%- include('../includes/end.ejs') %>


       //views/shop/cart.ejs
       <%- include('../includes/head.ejs') %>
       </head>
       <body>
       <%- include('../includes/navigation.ejs') %>
       <%- include('../includes/end.ejs') %>

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

       //views/shop/product-details.ejs
           <main class="centered>
           <h1><%= product.title %> </h1>
           <hr>
             <div> <img src="<%= product.imageUrl %>"></div>
             <h2><%= product.price %></h2>
             <p><%= product.description %></p>
             <form action="/cart" method="post">
               <button class="btn" type="submit">Add to Cart</button>
              </form>
           </main>
           
       //views/shop/product-list.ejs
       <%- include('includes/head.ejs') %>
       </head>
        <%- include('includes/naviation.ejs') %>
       <% if(prods.length > 0) { %>
         <div>
         <% for(let product of prods) { %>
           <%= product.title %>
           <%= product.imageUrl %>
           $<%= product.price %>
           <%= product.description %>
           <a href="/products/<%= product.id %>">Details</a>
         <% } %>
       <% } else { %>
       <% } %>
         <%- include('includes/end.ejs') %>

       //views/shop.ejs
       <%- include('includes/head.ejs') %>
       </head>
        <%- include('includes/naviation.ejs') %>
       <% if(prods.length > 0) { %>
         <div>
         <% for(let product of prods) { %>
           <%= product.title %>
           <%= product.imageUrl %>
           $<%= product.price %>
           <%= product.description %>
         <% } %>
       <% } else { %>
       <% } %>
         <%- include('includes/end.ejs') %>
