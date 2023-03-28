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
            <li class="main-header__item"><a href="/" class="active">Shop</a></li>
            <li class="main-header__item"><a href="/admin/add-product">Add Product</a></li>
        </ul>
    </nav>
</header>

//views/includes/end.ejs
</body>
</html>

//views/shop.ejs
<%- include('includes/head.ejs') %>
    <link rel="stylesheet" type="text/css" href="/css/main.css">
    <link rel="stylesheet" type="text/css" href="/css/product.css">
</head>
<body>
    <%- include('includes/navigation.ejs') %>
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
  <%- include('includes/end.ejs') %>
                      
  //views/add-product.ejs
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" type="text/css" href="/css/form.css">
    <link rel="stylesheet" type="text/css" href="/css/main.css">
    <link rel="stylesheet" type="text/css" href="/css/product.css">
    
</head>
<body>
    <header class="main-header">
        <nav class="main-header__nav">
            <ul class="main-header__item-list">
                <li class="main-header__item"><a href="/">Shop</a></li>
                <li class="main-header__item"><a href="/admin/add-product" class="active">Add Product</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <form class="product-form" action="/admin/product" method="POST">
            <div class="form-control">
                <label for="title">Title</label>
                <input type="text" name="title" id="title">
            </div>

            <button class="btn" type="submit">Add Product</button>
        </form>
    </main>
</body>
</html>         

//views/404.ejs
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>No Page Found</h1>
</body>
</html>

//public/main.css
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

//views/product.css
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

//public/product.css
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

//views/form.css
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


//app.js

const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use('/admin',adminData.routes);
app.use(shopRoutes);

app.use((req,res, next) => {
    res.status(404).render('404',{pageTitle: 'page Not Found'});
});

app.listen(3000);

//util/path.js
const path = require('path');
module.exports = path.dirname(process.mainModule.filename);
