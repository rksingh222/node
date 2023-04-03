//controller/admin.js

const Product = require("../models/product");


exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', { pageTitle: 'Add Product', path: '/admin/add-product', editing: false});
}

exports.postAddProduct = (req, res, next) => {
    console.log(req.body); // the output comes undefined we need to parse it which is not happening so to parse we need to register parser
    //products.push({ title: req.body.title });
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(null,title,imageUrl,description,price);
    product.save();
    res.redirect('/');
}

exports.getEditProduct = (req, res, next) => {
    //add-product here is associated with add-product.ejs
   //passing query param like www.admin.edit-product/12345?edit=true// where edit = true is query // if not found its undefined which is false
   const editMode = req.query.edit;
   //add-product here is associated with add-product.ejs
   //http://localhost:3000/admin/edit-product/123245?edit=true
   if(!editMode){
       res.redirect('/');
       return;
   }
   const prodId = req.params.productId;
   Product.findById(prodId, product =>{
       if(!product){
           return res.redirect('/');
       }
       res.render('admin/edit-product', { pageTitle: 'Edit Product', path: '/admin/edit-product' ,editing: editMode,product: product});
   })
   
}


exports.postEditProduct = (req, res, next) =>{
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    const updatedProduct = new Product(prodId, updatedTitle, updatedImageUrl, updatedDesc,updatedPrice);
    updatedProduct.save();
    res.redirect('/admin/products');
}

exports.getProducts = (req, res, next) =>{
    const products = Product.fetchAll((products)=>{
        res.render('admin/products',{prods:products,docTitle:'Admin Products', path:'/admin/products'});
    });
}

exports.postDeleteProduct = (req, res, next)=>{
    const prodId = req.body.productId;
    Product.deleteById(prodId);
    res.redirect('/admin/products');
}

//controller/shop.js


const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) =>{
    //'shop' here is associated with shop.ejs
    const products = Product.fetchAll((products)=>{
        res.render('shop/product-list',{prods:products,docTitle:'All Products', path:'/products'});
    });
}

exports.getProduct = (req, res, next) =>{
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        res.render('shop/product-detail',{product: product, pageTitle: product.title,path:'/products'});
    });
}

exports.getIndex = (req, res, next) =>{
    const products = Product.fetchAll((products)=>{
        res.render('shop/index',{prods:products,docTitle:'Shop', path:'/'});
    });
}

exports.getCart = (req,res,next) =>{
    Cart.getProducts(cart => {
        //why we are calling product 
        //because cart doesn't give all information we need
        //we have to use cart id and using products we fetch information about product like title 
        Product.fetchAll( products =>{
            const cartProducts = []
            for(product of products){
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if(cartProductData){
                    // we are storing qty because product doesn't have it and only cart has it
                    cartProducts.push({productData: product, qty:cartProductData.qty});
                }
            }
            res.render('shop/cart',{
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts
            });
        });
    });
    
}

exports.postCart = (req,res, next) =>{
    const prodId = req.body.productId;
    Product.findById(prodId, product =>{
        Cart.addProduct(prodId,product.price);
    });
    console.log(prodId);
    res.redirect('/cart');
}

exports.postCartDeleteProduct = (req, res, next)=>{
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    });
}


exports.getOrders = (req,res,next) =>{
    res.render('shop/orders',{
        path: '/orders',
        pageTitle: 'Your Orders'
    });
}

exports.getCheckout = (req,res,next) =>{
    res.render('shop/checkout',{
        path: '/checkout',
        pageTitle: 'Checkout'
    });
}

exports.get404 = (req, res, next) =>{
   res.status(404).render('404',{pageTitle: 'page Not Found',path: '/404'});
}

//create a data folder


//models/cart.js

const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

module.exports = class cart{
    static addProduct(id, productPrice){
        //Fetch the previous cart
        fs.readFile(p, (err, fileContent) =>{
            let cart = {products: [], totalPrice: 0};
            if(!err){
               cart = JSON.parse(fileContent);
            }
            const existingProductIndex = cart.products.findIndex(prod => prod.id == id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if(existingProduct){
                updatedProduct = {...existingProduct};
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            }else{
                updatedProduct = {id: id ,qty: 1};
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + productPrice;
            fs.writeFile(p, JSON.stringify(cart),err => {
                console.log(err);
            })
        });
    }
    static deleteProduct(id, productPrice){
        fs.readFile(p, (err, fileContent) =>{
            if(err){
                return;
            }
            const updatedCart = { ...JSON.parse(fileContent) };
            //when i am deleting a product from admin page which is added in the cart
            //it is possible that it is not added in the cart in that case we will 
            //just return
            const product = updatedCart.products.find(prod => prod.id === id);
            if(!product){
                return;
            }
            const productQty = product.qty;
            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
            updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;

            fs.writeFile(p, JSON.stringify(updatedCart),err => {
                console.log(err);
            })
        });
    }

    //it fetches all the added product in the cart
    static getProducts(cb){
        fs.readFile(p, (err, fileContent) =>{
            const cart = JSON.parse(fileContent);
            if(err){
                cb(null);
            }else{
                cb(cart);
            }
        });
    }
}


//models/product.js

//const products = [];
const fs = require('fs');
const path = require('path');

const Cart = require('./cart')

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

//from here we get the information in products
const getProductsFromFile = cb => {
    
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        }else{
            cb(JSON.parse(fileContent));
        }
    })
}

module.exports = class Product {
    // if already have an id
    // we should an accept an id
    // we will pass null for brand new object
    constructor(id, title, imageUrl, description, price) {
        this.id = id,
        this.title = title;
        this.imageUrl =imageUrl;
        this.description = description;
        this.price = price;
    }
    save() {
        //if we have an id as null it will go to else
        //otherwise it will go in if
        // since we need all the products
        getProductsFromFile(products =>{
            if(this.id){
                // this refers to the current product which we have passed from router
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                console.log(existingProductIndex);
                const updatedProducts = [...products];
                //this refers to the current product information sent from router
                updatedProducts[existingProductIndex] = this;
                console.log(updatedProducts[existingProductIndex]);
                fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                    console.log(err);
                });
            }
            else{
                this.id =Math.random().toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    console.log(err);
                })
            }
        });
        //products.push(this);
        const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');
    }

    //retrieve all values is a utility function
    //call this method directly on the class itself
    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static deleteById(id){
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id);
            const updatedProducts = products.filter(prod => prod.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), err =>{
                if(!err){
                    //delete the product here need to delete the item from cart as that product is not there anymore
                    //calling deleteproduct from cart 
                    Cart.deleteProduct(id,product.price);
                }
            })
        });
    }

   static findById(id, cb){
        getProductsFromFile(products =>{
            const product =  products.find(product => id == product.id);
            //its return product value in the callback
            cb(product);
        })
    }
}


//public/css/form.css

.form-control {
    margin: 1rem 0;
}

.form-control label,
.form-control input,
.form-control textarea {
    display: block;
    width: 100%;
    margin-bottom: 0.25rem;
}

.form-control input,
.form-control textarea  {
    border: 1px solid #a1a1a1;
    font: inherit;
    border-radius: 2px;
}

.form-control input:focus,
.form-control textarea:focus  {
    outline-color: #00695c;
}

//public/css/main.css

@import url('https://fonts.googleapis.com/css?family=Open+Sans:400,700');

* {
  box-sizing: border-box;
}

body {
  padding: 0;
  margin: 0;
  font-family: 'Open Sans', sans-serif;
}

main {
  padding: 1rem;
  margin: auto;
}

form {
  display: inline;
}

.main-header {
  width: 100%;
  height: 3.5rem;
  background-color: #00695c;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
}

.main-header__nav {
  height: 100%;
  display: none;
  align-items: center;
}

.main-header__item-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
}

.main-header__item {
  margin: 0 1rem;
  padding: 0;
}

.main-header__item a {
  text-decoration: none;
  color: white;
}

.main-header__item a:hover,
.main-header__item a:active,
.main-header__item a.active {
  color: #ffeb3b;
}

.mobile-nav {
  width: 30rem;
  height: 100vh;
  max-width: 90%;
  position: fixed;
  left: 0;
  top: 0;
  background: white;
  z-index: 10;
  padding: 2rem 1rem 1rem 2rem;
  transform: translateX(-100%);
  transition: transform 0.3s ease-out;
}

.mobile-nav.open {
  transform: translateX(0);
}

.mobile-nav__item-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
}

.mobile-nav__item {
  margin: 1rem;
  padding: 0;
}

.mobile-nav__item a {
  text-decoration: none;
  color: black;
  font-size: 1.5rem;
  padding: 0.5rem 2rem;
}

.mobile-nav__item a:active,
.mobile-nav__item a:hover,
.mobile-nav__item a.active {
  background: #00695c;
  color: white;
  border-radius: 3px;
}

#side-menu-toggle {
  border: 1px solid white;
  font: inherit;
  padding: 0.5rem;
  display: block;
  background: transparent;
  color: white;
  cursor: pointer;
}

#side-menu-toggle:focus {
  outline: none;
}

#side-menu-toggle:active,
#side-menu-toggle:hover {
  color: #ffeb3b;
  border-color: #ffeb3b;
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 5;
  display: none;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: stretch;
}

.card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
}

.card__header,
.card__content {
  padding: 1rem;
}

.card__header h1,
.card__content h1,
.card__content h2,
.card__content p {
  margin: 0;
}

.card__image {
  width: 100%;
}

.card__image img {
  width: 100%;
}

.card__actions {
  padding: 1rem;
  text-align: center;
}

.card__actions button,
.card__actions a {
  margin: 0 0.25rem;
}

.btn {
  display: inline-block;
  padding: 0.25rem 1rem;
  text-decoration: none;
  font: inherit;
  border: 1px solid #00695c;
  color: #00695c;
  background: white;
  border-radius: 3px;
  cursor: pointer;
}

.btn:hover,
.btn:active {
  background-color: #00695c;
  color: white;
}

.centered{
  text-align: center;
}

@media (min-width: 768px) {
  .main-header__nav {
    display: flex;
  }

  #side-menu-toggle {
    display: none;
  }
}

//public/css/product.css

.product-form {
    width: 20rem;
    
    margin: auto;
}


.product-item{
   width: 20rem;
   max-width: 95%;
    
}
.product__title{
    font-size: 1.2rem;
    text-align: center;
}

.product__price {
    text-align: center;
    color: #4d4d4d;
    margin-bottom: 0.5rem;
}

.product__description {
    text-align: center;
}

//public/js/main.js

const backdrop = document.querySelector('.backdrop');
const sideDrawer = document.querySelector('.mobile-nav');
const menuToggle = document.querySelector('#side-menu-toggle');

function backdropClickHandler() {
  backdrop.style.display = 'none';
  sideDrawer.classList.remove('open');
}

function menuToggleClickHandler() {
  backdrop.style.display = 'block';
  sideDrawer.classList.add('open');
}

backdrop.addEventListener('click', backdropClickHandler);
menuToggle.addEventListener('click', menuToggleClickHandler);


//routes/admin.js

//routes/admin.js
const path = require('path');
const express = require('express');
const router = express.Router();
const rootDir = require('../util/path');
const adminController = require('../controller/admin');

//  /add-product is associated with localhost:3000/admin/add-product and only get request
// /admin/add-product =>GET
router.get('/add-product', adminController.getAddProduct);

//admin/products =>GET
router.get('/products', adminController.getProducts);

//admin/add-product =>POST
//for handling post request we can use app.post or app.get or app.patch or app.post or app.delete or app.put
router.post('/add-product',adminController.postAddProduct);


router.get('/edit-product/:productId',adminController.getEditProduct);

router.post('/edit-product',adminController.postEditProduct);

router.post('/delete-product',adminController.postDeleteProduct);

exports.routes = router;


//routes/shop.js

const path = require('path');
const express = require('express');
const router = express.Router();
const rootDir = require('../util/path');
const adminData = require("./admin");
const shopController = require('../controller/shop');

//get post will actually to do exact match  instead if we use router.use() it will work differently
router.get('/',shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId',shopController.getProduct);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/cart-delete-item',shopController.postCartDeleteProduct);

router.get('/orders', shopController.getOrders);

router.get('/checkout', shopController.getCheckout);
 
module.exports = router;



//util/path.js

const path = require('path');
module.exports = path.dirname(process.mainModule.filename);

//views/admin/add-product.ejs

<%- include('../includes/head.ejs') %>
    <link rel="stylesheet" type="text/css" href="/css/form.css">
    <link rel="stylesheet" type="text/css" href="/css/main.css">
    <link rel="stylesheet" type="text/css" href="/css/product.css">
    
</head>
<body>
    <%- include('../includes/navigation.ejs') %>
    <main>
        <form class="product-form" action="/admin/add-product" method="POST">
            <div class="form-control">
                <label for="title">Title</label>
                <input type="text" name="title" id="title">
            </div>
            <div class="form-control">
                <label for="imageUrl">Image URL</label>
                <input type="text" name="imageUrl" id="imageUrl">
            </div>
            <div class="form-control">
                <label for="price">Price</label>
                <input type="number" name="price" id="price" step="0.01">
            </div>
            <div class="form-control">
                <label for="price">Description</label>
                <textarea  name="description" id="description" rows="5"></textarea>
            </div>
            <button class="btn" type="submit">Add Product</button>
        </form>
    </main>

<%- include('../includes/end.ejs') %>
              
//views/admin/edit-product.ejs
              
<%- include('../includes/head.ejs') %>
    <link rel="stylesheet" type="text/css" href="/css/form.css">
    <link rel="stylesheet" type="text/css" href="/css/main.css">
    <link rel="stylesheet" type="text/css" href="/css/product.css">
    
</head>
<body>
    <%- include('../includes/navigation.ejs') %>
    <main>
        <form class="product-form" action="/admin/<% if(editing) { %>edit-product<% } else { %>add-product<% } %>" method="POST">
            <div class="form-control">
                <label for="title">Title</label>
                <input type="text" name="title" id="title" value="<% if(editing) { %><%= product.title%><% } %>">
            </div>
            <div class="form-control">
                <label for="imageUrl">Image URL</label>
                <input type="text" name="imageUrl" id="imageUrl" value="<% if(editing) { %><%= product.imageUrl%><% } %>">
            </div>
            <div class="form-control">
                <label for="price">Price</label>
                <input type="number" name="price" id="price" step="0.01" value="<% if(editing) { %><%= product.price%><% } %>">
            </div>
            <div class="form-control">
                <label for="price">Description</label>
                <textarea  name="description" id="description" rows="5"><% if(editing) { %><%= product.description%><% } %></textarea>
            </div>
            <% if (editing) { %>
                <input type="hidden" value="<%= product.id %>" name="productId">
            <% } %>

            <button class="btn" type="submit"><% if (editing) { %>Update Product<% } else { %> Add Product <% } %></button>
        </form>
    </main>

<%- include('../includes/end.ejs') %>
              
 //views/admin/products.ejs
 
 <%- include('../includes/head.ejs') %>
    <link rel="stylesheet" type="text/css" href="/css/main.css">
    <link rel="stylesheet" type="text/css" href="/css/product.css">
</head>
<body>
    <%- include('../includes/navigation.ejs') %>
    <main>
        <% if(prods.length > 0) { %>
        <div class="grid">
            <% for (let product of prods) { %>
            <article class="card product-item">
                <header class="card__header">
                    <h1 class="product__title"><%= product.title %></h1>
                </header>
                <div class="card__image">
                    <img src="<%=product.imageUrl %>" alt="<%=product.title %>">
                </div>
                <div class="card__content">
                    <h2 class="product__price">$<%= product.price %></h2>
                    <p class="product__description"><%= product.description %></p>
                </div>
                <div class="card__actions">
                    <a href="/admin/edit-product/<%= product.id %>?edit=true" class="btn">Edit</a>
                    <form action="/admin/delete-product" method="POST">
                        <input type="hidden" value="<%= product.id %>" name="productId">
                        <button class="btn" type="submit">Delete</button>
                    </form>
                </div>
            </article>
            <% } %>
        </div>
        <% } else { %>
            <h1>No Products Found !</h1>
        <% } %>  
    </main>
  <%- include('../includes/end.ejs') %>
          
  //views/includes/add-to-cart.ejs
  
  <form action="/cart" method="post">
    <button class="btn" type="submit">Add to cart</button>
    <input type="hidden" name="productId" value="<%= product.id %>">
</form>
                   
 //views/includes/head.ejs
                   
 <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
   
//views/includes/end.ejs
                   
<script src="/js/main.js"></script>
</body>

</html>
                   
//views/includes/navigation.ejs
                   
<div class="backdrop"></div>
<header class="main-header">
    <button id="side-menu-toggle">Menu</button>
    <nav class="main-header__nav">
        <ul class="main-header__item-list">
            <li class="main-header__item">
                <a class="<%= path === '/' ? 'active' : '' %>" href="/">Shop</a>
            </li>
            <li class="main-header__item">
                <a class="<%= path === '/products' ? 'active' : '' %>" href="/products">Products</a>
            </li>
            <li class="main-header__item">
                <a class="<%= path === '/cart' ? 'active' : '' %>" href="/cart">Cart</a>
            </li>
            <li class="main-header__item">
                <a class="<%= path === '/orders' ? 'active' : '' %>" href="/orders">Orders</a>
            </li>
            <li class="main-header__item">
                <a class="<%= path === '/admin/add-product' ? 'active' : '' %>" href="/admin/add-product">Add Product
                </a>
            </li>
            <li class="main-header__item">
                <a class="<%= path === '/admin/products' ? 'active' : '' %>" href="/admin/products">Admin Products
                </a>
            </li>
        </ul>
    </nav>
</header>

<nav class="mobile-nav">
        <ul class="mobile-nav__item-list">
                <li class="mobile-nav__item">
                    <a class="<%= path === '/' ? 'active' : '' %>" href="/">Shop</a>
                </li>
                <li class="mobile-nav__item">
                    <a class="<%= path === '/products' ? 'active' : '' %>" href="/products">Products</a>
                </li>
                <li class="mobile-nav__item">
                    <a class="<%= path === '/cart' ? 'active' : '' %>" href="/cart">Cart</a>
                </li>
                <li class="mobile-nav__item">
                    <a class="<%= path === '/orders' ? 'active' : '' %>" href="/orders">Orders</a>
                </li>
                <li class="mobile-nav__item">
                    <a class="<%= path === '/admin/add-product' ? 'active' : '' %>" href="/admin/add-product">Add Product
                    </a>
                </li>
                <li class="mobile-nav__item">
                    <a class="<%= path === '/admin/products' ? 'active' : '' %>" href="/admin/products">Admin Products
                    </a>
                </li>
            </ul>
</nav>
                   
 //views/shop/cart.ejs
  
 <%- include('../includes/head.ejs') %>
   <link rel="stylesheet" type="text/css" href="/css/main.css">
</head>
<body>
    <%- include('../includes/navigation.ejs') %>
    <main>
        <% if (products.length > 0) { %>
            <ul>
                <% products.forEach(p => {%>
                    <li>
                        <p><%= p.productData.title %>(<%= p.qty %>)</p>
                        <form action="/cart-delete-item" method="POST">
                            <input type="hidden" value="<%= p.productData.id %>" name="productId">
                            <button class="btn" type="submit">Delete</button>
                        </form>
                    </li>
                <% }) %>
            </ul>
        <% } else { %>
        <h1>No Products in Cart</h1>
        <% } %>
    </main>
  <%- include('../includes/end.ejs') %>
  
  //views/shop/checkout.ejs
  
  //views/shop/index.ejs
  
  <%- include('../includes/head.ejs') %>
    <link rel="stylesheet" type="text/css" href="/css/main.css">
    <link rel="stylesheet" type="text/css" href="/css/product.css">
</head>
<body>
    <%- include('../includes/navigation.ejs') %>
    <main>
        <% if (prods.length > 0) { %>
        <div class="grid">
            <% for (let product of prods) { %>
            <article class="card product-item">
                <header class="card__header">
                    <h1 class="product__title"><%= product.title %></h1>
                </header>
                <div class="card__image">
                    <img src="<%=product.imageUrl %>" alt="<%=product.title %>">
                </div>
                <div class="card__content">
                    <h2 class="product__price">$<%= product.price %></h2>
                    <p class="product__description"><%= product.description %></p>
                </div>
                <div class="card__actions">
                    <%- include('../includes/add-to-cart.ejs',{product: product}) %>
                </div>
            </article>
            <% } %>
        </div>
        <% } else { %>
            <h1>No Products Found !</h1>
        <% } %>  
    </main>
  <%- include('../includes/end.ejs') %>
          
  //views/shop/orders.ejs
      
  <%- include('../includes/head.ejs') %>
   <link rel="stylesheet" type="text/css" href="/css/main.css">
</head>
<body>
    <%- include('../includes/navigation.ejs') %>
    <main>
        <h1>Nothing there!</h1>
    </main>
  <%- include('../includes/end.ejs') %>
          
  //views/shop/product-detail.ejs
          
  <%- include('../includes/head.ejs') %>
   <link rel="stylesheet" type="text/css" href="/css/main.css">
</head>
<body>
    <%- include('../includes/navigation.ejs') %>
    <main class="centered">
        <h1><%= product.title %></h1>
        <hr>
        <div>
            <img src="<%= product.imageUrl %>" alt="<%= product.title %>">
        </div>
        <h2><%= product.price %></h2>
        <p><%= product.description %></p>
        <%- include('../includes/add-to-cart.ejs') %>
    </main>
  <%- include('../includes/end.ejs') %>
  
  //views/shop/product-list.ejs
  
  <%- include('../includes/head.ejs') %>
    <link rel="stylesheet" type="text/css" href="/css/main.css">
    <link rel="stylesheet" type="text/css" href="/css/product.css">
</head>
<body>
    <%- include('../includes/navigation.ejs') %>
    <main>
        <% if(prods.length > 0) { %>
        <div class="grid">
            <% for (let product of prods) { %>
            <article class="card product-item">
                <header class="card__header">
                    <h1 class="product__title"><%= product.title %></h1>
                </header>
                <div class="card__image">
                    <img src="<%=product.imageUrl %>" alt="<%=product.title %>">
                </div>
                <div class="card__content">
                    <h2 class="product__price">$<%= product.price %></h2>
                    <p class="product__description"><%= product.description %></p>
                </div>
                <div class="card__actions">
                    <a href="/products/<%= product.id %>" class="btn">Details</a>
                    <!--variable in the for loop when sent to another file need to be sent like this it will not be visible directly-->
                    <%- include('../includes/add-to-cart.ejs',{product: product})%>
                </div>
            </article>
            <% } %>
        </div>
        <% } else { %>
            <h1>No Products Found !</h1>
        <% } %>  
    </main>
  <%- include('../includes/end.ejs') %>
          
  //views/404.ejs
  
  <%- include('./includes/head.ejs') %>
    <link rel="stylesheet" type="text/css" href="/css/main.css">
</head>
<body>
    <%- include('./includes/navigation.ejs') %>
    <h1>No Page Found</h1>
  <%- include('./includes/end.ejs') %>
      
      
 //app.ejs
      
 
const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const path = require('path');
const shopController = require('./controller/shop');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use('/admin',adminData.routes);
app.use(shopRoutes);

app.use(shopController.get404);

app.listen(3000);
