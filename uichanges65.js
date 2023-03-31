//controller/product.js

//const products = [];

const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
    //add-product here is associated with add-product.ejs
    res.render('admin/add-product', { pageTitle: 'Add Product', path: '/admin/add-product' });
}

exports.postAddProduct = (req, res, next) => {
    console.log(req.body); // the output comes undefined we need to parse it which is not happening so to parse we need to register parser
    //products.push({ title: req.body.title });
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
}

exports.getProducts = (req, res, next) =>{
    //'shop' here is associated with shop.ejs
    const products = Product.fetchAll((products)=>{
        res.render('shop/product-list',{prods:products,docTitle:'Shop', path:'/', hasProducts: products.length > 0});
    });
}

exports.get404 = (req, res, next) =>{
   res.status(404).render('404',{pageTitle: 'page Not Found'});
}

//create data folder

//model/products.js

//const products = [];
const fs = require('fs');
const path = require('path');

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

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
    constructor(title) {
        this.title = title;
    }
    save() {
        getProductsFromFile(products =>{
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            })
        });
        //products.push(this);
        const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');
    }

    //retrieve all values is a utility function
    //call this method directly on the class itself
    static fetchAll(cb) {
        getProductsFromFile(cb);
    }
}

//public/css/form.css

.form-control {
    margin: 1rem 0;
}

.form-control label,
.form-control input {
    display: block;
    width: 100%;
    margin-bottom: 0.25rem;
}

.form-control input {
    border: 1px solid #a1a1a1;
    font: inherit;
    border-radius: 2px;
}

.form-control input:focus {
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

.main-header {
  width: 100%;
  height: 3.5rem;
  background-color: #00695c;
  padding: 0 1.5rem;
}

.main-header__nav {
  height: 100%;
  display: flex;
  align-items: center;
}

.main-header__item-list {
  list-style: none;
  margin: 0 1;
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

.grid {
  display: flex;
  justify-content: space-around;
  align-items: stretch;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.26);
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

.card__image{
    width: 100%;
}
.card__image img{
    width: 100%;
} 
.card__actions {
    padding: 1rem;
    text-align: center;
}

//public/css/product.css
.product-form {
    width: 20rem;
    max-width: 90%;
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

//routes/admin.js
//routes/admin.js
const path = require('path');
const express = require('express');
const router = express.Router();
const rootDir = require('../util/path');
const productsController = require('../controller/product');

//  /add-product is associated with localhost:3000/admin/add-product and only get request
// /admin/add-product =>GET
router.get('/add-product', productsController.getAddProduct);

//admin/products =>GET
router.get('/products',);

//admin/add-product =>POST
//for handling post request we can use app.post or app.get or app.patch or app.post or app.delete or app.put
router.post('/add-product',productsController.postAddProduct);

exports.routes = router;

//admin/shop.js
const path = require('path');
const express = require('express');
const router = express.Router();
const rootDir = require('../util/path');
const adminData = require("./admin");
const productsController = require('../controller/product');

//get post will actually to do exact match  instead if we use router.use() it will work differently
router.get('/',productsController.getProducts);

router.get('/products');

router.get('/cart');

router.get('/checkout');
 
module.exports = router;

//util/path.js
const path = require('path');
module.exports = path.dirname(process.mainModule.filename);

//view/admin/add-product.ejs
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

            <button class="btn" type="submit">Add Product</button>
        </form>
    </main>

<%- include('../includes/end.ejs') %>
              
//view/admin/product-list.ejs
 <%- include('../includes/head.ejs') %>
    <link rel="stylesheet" type="text/css" href="/css/main.css">
    <link rel="stylesheet" type="text/css" href="/css/product.css">
</head>
<body>
    <%- include('../includes/navigation.ejs') %>
    <main>
        <div class="grid">
            <article class="card product-item">
                <header class="card__header">
                    <h1 class="product__title"><%= prods[0].title %></h1>
                </header>
                <div class="card__image">
                    <img src="http://clipart-library.com/images/pTq8yLqjc.png">
                </div>
                <div class="card__content">
                    <h2 class="product__price">$19.99</h2>
                    <p class="product__description">A very interesting books so even more interesting things!</p>
                </div>
                <div class="card__actions">
                    <button class="btn">Add to Cart</button>
                </div>
            </article>
            <article class="card product-item">
                <header class="card__header">
                    <h1 class="product__title">Book</h1>
                </header>
                <div class="card__image">
                    <img src="http://clipart-library.com/images/pTq8yLqjc.png">
                </div>
                <div class="card__content">
                    <h2 class="product__price">$19.99</h2>
                    <p class="product__description">A very interesting books so even more interesting things!</p>
                </div>
                <div class="card__actions">
                    <button class="btn">Add to Cart</button>
                </div>
            </article>
            <article class="card product-item">
                <header class="card__header">
                    <h1 class="product__title">Book</h1>
                </header>
                <div class="card__image">
                    <img src="http://clipart-library.com/images/pTq8yLqjc.png">
                </div>
                <div class="card__content">
                    <h2 class="product__price">$19.99</h2>
                    <p class="product__description">A very interesting books so even more interesting things!</p>
                </div>
                <div class="card__actions">
                    <button class="btn">Add to Cart</button>
                </div>
            </article>
            <article class="card product-item">
                <header class="card__header">
                    <h1 class="product__title">Book</h1>
                </header>
                <div class="card__image">
                    <img src="http://clipart-library.com/images/pTq8yLqjc.png">
                </div>
                <div class="card__content">
                    <h2 class="product__price">$19.99</h2>
                    <p class="product__description">A very interesting books so even more interesting things!</p>
                </div>
                <div class="card__actions">
                    <button class="btn">Add to Cart</button>
                </div>
            </article>
            <article class="card product-item">
                <header class="card__header">
                    <h1 class="product__title">Book</h1>
                </header>
                <div class="card__image">
                    <img src="http://clipart-library.com/images/pTq8yLqjc.png">
                </div>
                <div class="card__content">
                    <h2 class="product__price">$19.99</h2>
                    <p class="product__description">A very interesting books so even more interesting things!</p>
                </div>
                <div class="card__actions">
                    <button class="btn">Add to Cart</button>
                </div>
            </article>
        </div>
    </main>
  <%- include('../includes/end.ejs') %>
                      
  //views/includes/end.ejs
     </body>
     </html>

  //views/includes/head.ejs
   <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

  //views/includes/navigation.ejs
  <header class="main-header">
    <nav class="main-header__nav">
        <ul class="main-header__item-list">
            <li class="main-header__item">
                <a href="/" class="active">Shop</a>
            </li>
            <li class="main-header__item">
                <a href="/products" class="active">Products</a>
            </li>
            <li class="main-header__item">
                <a href="/cart" class="active">Cart</a>
            </li>
            <li class="main-header__item">
                <a href="/admin/add-product">Add Product</a>
            </li>
            <li class="main-header__item">
                <a href="/admin/products">Admin Product</a>
            </li>
        </ul>
    </nav>
</header>

//app.js

const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const path = require('path');
const productsController = require('./controller/product');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use('/admin',adminData.routes);
app.use(shopRoutes);

app.use(productsController.get404);

app.listen(3000);
   
