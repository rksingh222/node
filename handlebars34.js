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
const expressHbs = require('express-handlebars');
const app = express();

app.engine('handlebars',expressHbs());
//set global configuration values
app.set('view engine','handlebars');
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

//views/add-product.hbs
<title>{{pageTitle}}</title>
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

for condition
{{# if hasProducts }} // handlebars doesnt support statement like prods.lenght
 {{#each prods}}
 {{this.title}} // will refer to one product inside prods
 {{/each}}
{{else}}
{{/if}}

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

//views/404.html
<body>
      <h1>Page Not Found!</h1>
</body>
     

//util/path.js
const path = require('path');
module.exports = path.dirname(process.mainModule.filename);


//do this also after completion of this work
npm install --save express-handlebars@3.0
