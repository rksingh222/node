//app.js

const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const adminRoutes = require('./routes/admin'):
const shopRoutes = require('./routes/shop');
app.use(bodyParser.urlencoded({extended: false}));
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
    <h1>My Products</h1>
    <p>List of all the products...</p>
   </main>
</body>

//util/path.js
const path = require('path');
module.exports = path.dirname(process.mainModule.filename);
