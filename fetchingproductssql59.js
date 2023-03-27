npm install --save express-handlebars@3.0

            EJS.  <p> <% name=%></p>
            Pug(Jade) p #{name}
            Handlebars  <p>{{ name }}</p>

            Installing and implementing pug
            npm install --save ejs pug express-handlebars 


           npm install --save mysql2
           //util//database.js
            const mysql = require('mysql2');
            const pool = mysql.createPool({
            host: 'localhost', // since its running in local machine
            user: 'root',
            database: 'node-complete',
            password: 'nodecomplete'
            });

            module.exports = pool.promise(); // will allow to work with promises like async code

            //app.js

            const mysql = require('mysql2');
            const db = require('./util/database.js');
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
       
            const Cart =require('../models/cart');


            exports.getAddProduct = (req,res,next)=>{
             //res.sendFile(path.join(rootDir,'views','add-product.html'));
             //for pug type of file
             //for path it can be add-produt this is only for navigation
             res.render('admin/edit-product', {pageTitle: 'Add Product',path:'/admin/add-product',editing: false});
           };

           exports.postAddProduct = (req,res,next)=>{
              console.log(req.body); // the output comes undefined we need to parse it which is not happening so to parse we need to register parser

             const title = req.body.title;
             const imageUrl = req.body.imageUrl;
             const price = req.body.price;
             const description = req.body.description;
             
             //null because id should be null and we are creating id in save
             const product = new Product(null,title, imageUrl, price, description);
              product.save();
              res.redirect('/');
            }

            exports.getEditProduct = (req,res,next)=>{
             //res.sendFile(path.join(rootDir,'views','add-product.html'));
             //for pug type of file
             //for path it can be add-produt this is only for navigation
             const editMode = req.query.edit;
              //if undefined it sets to false and if true
              if(!editMode){
                res.redirect('/');
              }
              const prodId = req.paramas.productId;
              Product.findById(prodId, product =>{
                if(!product){
                  return res.redirect('/');
                }
              });
             res.render('admin/edit-product', {pageTitle: 'Edit Product',path:'/admin/edit-product',editing:editMode,product:product});
           };


              

            exports.postEditProduct = (req, res, next)=>{
              const prodId = req.body.productId;
              const updatedTitle = req.body.title;
              const updatePrice = req.body.price;
              const updatedImageUrl = req.body.imageUrl;
              const updatedDesc = req.body.description;
              const updatedProduct = new Product(prodId,updatedTitle, updatedImageUrl, udpdatedDesc,updatedPrice);
              updatedProduct.save();
              res.redirect('/admin/products');
            }

            exports.getProducts = (req,res,next)=>{
               Product.fetchAll((products) =>{
                res.render('admin/products',{prods:products,docTitle:'All Products', path:'/admin/products'
                                });
              });
            };
            
           
            exports.postDeleteProduct = (req,res,next)=>{
              const prodId = req.body.productId;
              Product.deleteById(prodId);
              res.redirect('/admin/products');
            }

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

           //added code
            exports.getIndex = (req, res, next)=>{
                Product.fetchAll([rows,fieldData]=>{
                  res.render('shop/index',{prods:rows,docTitle:'Shop', path:'/'
                                });
                }).then().catch(err => console.log(err));(products) =>{
                
              });
            };

            exports.getCart = (req, res, next)=>{
              Cart.getCart(cart => {
                Product.fetchAll(products => {
                  const cartProducts = [];
                  for (product of products) {
                    const cartProductData = cart.products.find(prod => prod.id === product.id);
                    if(cartProductData){
                        cartProducts.push({productData: product, qty: cartProductData.qty);
                    }
                  }
                   //inside product.fetchAll
                    res.render('shop/cart', {
                    'shop/cart', {
                    path: '/cart',
                    docTitle: 'Your Cart'
                     products: cartProducts
                    });
                });
              });
            };

            exports.postCart = (req,res,next) => {
              // this we get from hidden input 
              const  prodId = req.body.productId;
              Product.findById(prodId,(product)=>{
                Cart.addProduct(prodId, product.price);
              });
              res.redirect('/cart');
            }
            //added code
             exports.postCartDeleteProduct = (req,res,next) =>{
               const prodId = req.body.productId;
               Product.findById(prodId, product => {
                 Cart.deleteProduct(prodId,product.price);
                 res.redirect('/cart');
               });
             }
              
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


            models/cart.js

           const fs = require('fs');
            const path = require('path');
            const p = path.join(path.dirname(process.mainModule.filename),'data','cart.json');
            module.exports = class Cart{
            static addProduct(id, productPrice){
              //fetch the previous cart
              fs.readFile(p, (err, fileContent) => {
                //let cart = {products: [], totalPrice: 0 };
                //if no error that means we already have added cart 
                if(!err){
                  cart = JSON.parse(fileContent);
                  //analyse the cart => find existing product we are calling cart.products means cart ={products} that is we are doing cart.products
                  const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
                  const existingProduct = cart.products[existingProductIndex];
                  let updatedProduct;
                  if(existingProduct){
                    //if this product is already there we need to just increase its quantity
                    updatedProduct = {...existingProduct);
                    updatedProduct.qty = updateProduct.qty + 1;
                    cart.products = [...cart.products];
                    cart.products[existingProductIndex] = updateProduct;
                  }//if new fproduct else{
                    //if we are creating the product first time then add in cart as additional one
                    updateProduct = {id: id, qty: 1};
                    cart.products = [...cart.products, updatedProduct];
                  }
                  cart.totalPrice = cart.totalPrice + +productPrice; // to convert productPrice string to number we use + before it
                  fs.writeFile(p, JSON.stringify(cart),(err) => {
                    console.log(err);
                  })
                }
              });
                 
              
              
               static deleteProduct(id, productPrice){
                    fs.readFile(p,(err,fileContent) =>{
                        if(err){
                           return;
                        }
                        const updatedCart = {...JSON.parse(fileContent) };
                        const product = updatedCart.products.find(prod =>prod.id === id);
                        //if it does not find such product in the cart then do not find and just return
                        if(!product){
                          return;
                        }
                        const productQty = product.qty;
                        cart.products =  updatedCart.products.filter(prod => prod.id !== id);
                        cart.totalPrice = cart.totalPrice- productPrice*productQty;
                        
                    }
                    fs.writeFile(p, JSON.stringify(updatedCart),err => {
                        console.log(err);
                    });
               }
              
              static getProducts(cb){
                fs.readFile(p, (err, fileContent)=> {
                  const cart = JSON.parse(fileContent);
                  if(err){
                    cb(null);
                  }else{
                     cb(cart);
                  }
                }
              }

              //add new product/increase quantity
            }
            }


            models/prodduct.js

             //added code
            const fs = require('fs');
            const path = require('path');
            const Cart = require('./cart'); 
            const db = require('../util/database');
          
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
              
              //pass null for brand new id
              //if we are editing we have an id
              constructor(id,title,imageUrl,description,price){
                this.id = id;
                this.title = title;
                this.imageUrl = imageUrl;
                this.description = description;
                this.price = price;
              }
              save(){
              }
              
              static fetchAll(){
               return db.execute('SELECT * FROM products');
              }

              static findById(id){
               
              }
              
              
              static deleteById(id){
                
              }


            //routes/admin.js
            const path = require('path');
            const express = require('express');
            const router = express.Router();
            const adminController = require('../controller/admin'):

            router.get('/add-product',adminController.getAddProduct);

            router.get('/products', adminController.getProducts);    


            //for handling post request we can use app.post or app.get or app.patch or app.post or app.delete or app.put
            router.post('/product',adminController.postAddProduct);


            router.get('/edit-product:productId',adminController.getEditProduct);

            
            router.post('/edit-product', adminController.postEditProduct);

            //added code
            router.post('/delete-product',adminController.postDeleteProduct);
            
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
          
            //added code
            router.post('/cart-delete-item',shopController.postCartDeleteProduct);
           
            router.post('/cart',shopController.postCart);

            router.get('/checkout', shopController.getCheckout);

            module.exports = Router;



            views/includes/add-to-cart.ejs

            <form action="/cart" method="post">

             <button class="btn" type="submit">Add to Cart</button>
             <input type="hidden" name="productid" value="<%= product.id %>">
             </form>

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
            //added code here
            ///admin/add-product.ejs ---delete
            ///admin/edit-product.ejs
            <main>
            <form class="product-form" action="/admin/<% if(editing) { %>edit-product<%} else {%>add-product<% } %>" method="POST">
            <div class="form-control">
             <label for="title">Title</label>
             <input type="text" name="title" id="title" value="<% if(editing) { %><%= product.title %><%} %>">
            </div>
            <div class="form-control">
             <label for="imageUrl">Image Url</label>
             <input type="text" name="imageUrl" id="imageUrl" value="<% if(editing) { %><%= product.imageUrl %><%} %>">
            </div>
            <div class="form-control">
             <label for="price">price</label>
             <input type="number" name="price" id="price" step="0.01" value="<% if(editing) { %><%= product.price %><%} %>">>
            </div>
            <div class="form-control">
             <label for="description">price</label>
             <textarea name="description" id="description" rows="5" >if(editing) { %><%= product.description %><%} %>"</textarea>
            </div>
                                                                  
            <% if(editing) { %>
              <input type="hidden" value="<%= product.id %>" name=="productId">
            <% } %>
          <button class="btn" type="submit"><% if(editing) {%>Update Product<% } else {%>Add Product<% } %> </button>  
            //views/admin/products.ejs
            <%- include('../includes/head.ejs') %>
            </head>
            <body>
            <%- include('../includes/navigation.ejs') %>
            <div class="card__actions">
              //added code here
             <a href="/admin/edit-product/<%= product.id %>?edit=true" >
               <form  action="/admin/delete-product" method="POST">
                 <input type="hidden" value="<%= product.id %>" name="productId" >
                 <button class="btn" type="submit">Delete</button>
               </form>
            <%- include('../includes/end.ejs') %>

//added code
            //views/shop/cart.ejs
            <%- include('../includes/head.ejs') %>
            </head>
            <body>
            <%- include('../includes/navigation.ejs') %>
            <main>
               <% if (products.length > 0) { %>
                 <ul>
                   <% products.forEach(p => { %>
                     <li>
                     <p><%= p.productData.title %>(<%= p.qty %>)</p>
                     <form action="/cart-delete-item" method="POST"> // cart-delete-item is a route so it will be available in routes/shop.js
                           //this value is sent in the controller/shop.js
                           <input type="hidden" value="<%= p.productData.id %>" name="productId">                        
                           <button class="btn" type="submit">Delete</button>
                     </form>
                     </li>
                   <% }) %>
                 </ul>
                <% } else { %>
                  <h1> No products in cart ! </h1>
                <% } %>
            </main>
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
                  //added code here
                  //since we are adding include the product.id does not reach we need to send this product to the include if it is inside a loop
                  //if not in a loop it will work
                  <%- include('../includes/add-to-cart.ejs',{product: product}) %>
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
