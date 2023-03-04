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
app.set('view engine','pug');
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
  res.status(404).render('404');
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
  res.render('add-product', {pageTitle: 'Add Product'});
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
  res.render('shop',{prods:products,docTitle:'Shop'});
});
 
module.exports = Router;

//create folder views/add-product.html
//create folder views/shop.html

//add-product.html

<body>
  <header>
  <nav>
  <ul>
  <li><a href="/">shop</a></li>
  <li><a href="/add-product">Add Product</a></li>
  </ul>
  </nav>
  </header>
  <main>
    <form action="/add-product" method="POST">
      <input type="text" name="title">
      <button type="submit">Add Product</button>
    </form>
   </main>
</body>

//shop.html
<link rel="stylesheet" href="/css/main.css">

<body>
  <header class="main-header">
  <nav class="main-header__nav">
  <ul class="main-header__item-list">
  <li class="main-header__item"><a class="acitve" href="/">shop</a></li>
  <li class="main-header__item"><a href="/add-product">Add Product</a></li>
  </ul>
  </nav>
  </header>
  <main>
    <h1>My Products</h1>
    <p>List of all the products...</p>
   </main>
</body>

//public /css/main.css

 body{
          padding: 0;
          margin: 0;
        }
        .main-header{
          width: 100%;
          height; 3.5rem;
          background-color: #dbc441;
        }
        .main-header__nav{
          height: 100%;
          display: flex;
          align-items: center;
        }
        .main-header__item-list{
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
        }
        .main-header__item{
          margin: 1rem;
          padding: 0;
        }
        .main-header__item a{
          text-decoration: none;
          color:white;
        }
        .main-header__item a:hover,
        .main-header__item a:active,
        .main-header__item a.active{
          color: #6200ff;
        }
        main
        {
          padding: 1rem;
        }


//layouts/main-layout.pug
//we cannot determine which link is clicked
html5 then it itself insert html5 pug code
html(lang="en")
   head
      meta()
      title Document
      title #{docTitle}
      link(rel="stylesheet", href="/css/main.css")
      block styles  //hook provided so that we can add extra code by using the same layout by extends
   
   body
     header.main-header(add indentation level and use tab for getting (
          nav.main-header__nav
                ul.main-header__item-list
                   li.main-header__item
                        a.active(href="/") Shop
                   li.main-header__item
                        a.active(href="/admin/add-product") Add Product
      block content
    
 //views/404.pug
  
 extends layouts/main-layout.pug

 block content
      h1  Page Not Found
                        
                        
//give some random path this will run and                   

//views//add-productproduct.pug
//make sure the indentation is correct  
extends layouts/main-layout.pug

block styles 
    link(rel="stylesheet", href="/css/forms.css")
    link(rel="stylesheet", href="/css/product.css")

block content
     main
         form.product-form(action="/admin/add-product", method="POST")
              .form-control(div)
                  label(for="title") Title
                  input(type="text", name="title")#title. (id will be associated with #title in pug)
                
              button.btn(type="submit") Add Product
    


//views//shop.pug
html5 then it itself insert html5 pug code
html(lang="en")
   head
      meta()
      title Document
      title #{docTitle}
      link(rel="stylesheet", href="/css/main.css")
      link(rel="stylesheet", href="/css/product.css")
   body
     header.main-header(add indentation level and use tab for getting (
          nav.main-header__nav
                ul.main-header__item-list
                   li.main-header__item
                        a.active(href="/") Shop
                   li.main-header__item
                        a.active(href="/admin/add-product") Add Product
                      
        
     main 
       if prods.length > 0
        .grid ( means div with class grid)
           each product in prods
             article.card.product-item( two classes card and product-item)
                header.card__header
                  h1.product__title #{product.title}
                div.card__image
                  img(src="url", alt="A Book")
                div.card__content
                  h2.product__price $19.99
                  p.prodcut__descritpion A Very Interesting book
                div.car__actions
                  button.btn Add to Cart
        else 
          h1 No Products

//util/path.js
const path = require('path');
module.exports = path.dirname(process.mainModule.filename);
