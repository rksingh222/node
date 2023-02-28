//app.js

const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const adminRoutes = require('./routes/admin'):
const shopRoutes = require('./routes/shop');
app.use(bodyParser.urlencoded({extended: false}));

//to use public folders or give read access to 
app.use(express.static(path.join(__dirname,'public'));

app.use(adminRoutes);
app.use(shopRoutes);

app.use((req,res, next) => {
  res.status(404).send('<h1>Page Not Found </h1>');
});
app.listen(3000);

//routes/admin.js
const path = require('path');
const express = require('express');
const router = express.Router();
const rootDir = require('../util/path');

router.get('/add-product',(req,res,next)=>{
  res.sendFile(path.join(rootDir,'views','add-product.html'));
});

//for handling post request we can use app.post or app.get or app.patch or app.post or app.delete or app.put
router.post('/product',(req,res,next)=>{
  console.log(req.body); // the output comes undefined we need to parse it which is not happening so to parse we need to register parser
  res.redirect('/');
});

module.exports = Router;

//routes/shop.js
const path = require('path');
const express = require('express');
const router = express.Router();
const rootDir = require('../util/path');

//get post will actually to do exact match  instead if we use router.use() it will work differently
router.get('/',(req,res,next)=>{
  res.sendFile(path.join(rootDir,'views','shop.html'): //this will work both for linux path as well as windows
               //dirname will point to current folder 
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


//util/path.js
const path = require('path');
module.exports = path.dirname(process.mainModule.filename);
