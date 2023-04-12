//controller/admin.js


const Product = require("../models/product");


//commented code has sequelize only with product and no user

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', { pageTitle: 'Add Product', path: '/admin/add-product', editing: false });
}

exports.postAddProduct = (req, res, next) => {
    console.log(req.body); // the output comes undefined we need to parse it which is not happening so to parse we need to register parser
    //products.push({ title: req.body.title });
    //passing userId when passed from app.js 
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    //with belongs to hasmany association  
    //for user it creates a Product  we can call this method because sequelize  hasmany relationship 
    const product = new Product(title, price, description, imageUrl, null, req.user._id);
    product.save().then(result => {
        res.redirect('/admin/products');
        console.log("Product Created");
    }).catch(err => {
        console.log(err);
    });

    // this will also work 
    /*Product.create({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description,
        userId: req.user.id  //we are getting the value from app.js 
    }).then(result => {
        res.redirect('/admin/products');
        console.log("Product Created");
    }).catch(err => {
        console.log(err);
    });*/

}

exports.getEditProduct = (req, res, next) => {
    //add-product here is associated with add-product.ejs
    //passing query param like www.admin.edit-product/12345?edit=true// where edit = true is query // if not found its undefined which is false
    const editMode = req.query.edit;
    //add-product here is associated with add-product.ejs
    //http://localhost:3000/admin/edit-product/123245?edit=true
    if (!editMode) {
        res.redirect('/');
        return;
    }
    const prodId = req.params.productId;

    // to find the product for the currently logged in user
    // we get products array
    Product.findById(prodId).then(product => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', { pageTitle: 'Edit Product', path: '/admin/edit-product', editing: editMode, product: product });
    }).catch(err => console.log(err));

    // Product.findByPk(prodId).then(product => {
    //     if (!product) {
    //         return res.redirect('/');
    //     }
    //     res.render('admin/edit-product', { pageTitle: 'Edit Product', path: '/admin/edit-product', editing: editMode, product: product });
    // }).catch(err => console.log(err));
}


exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    const product = new Product(updatedTitle, updatedPrice,updatedDesc,updatedImageUrl ,prodId)
    product.save().then( result => {
            // async operation get registered and allows the next step of program to be executed
            // if we put res.redirect at the last it will run res.redirect 
            // before getting the result
            // so we will not see the updated result at first but it gets updated
            console.log('Updated Product!');
            res.redirect('/admin/products');
    }).catch(err => console.log(err));;
    // Product.findByPk(prodId).then(product => {
    //     product.title = updatedTitle;
    //     product.price = updatedPrice;
    //     product.description = updatedDesc;
    //     product.imageUrl = updatedImageUrl;
    //     //this will update on the local app
    //     // to change in the database we have to call product.save90 sequelize fnction
    //     //another method provided by sequelize
    //     // this takes the product as we edited
    //     // and saves it back to the database
    //     // if product does not exist it will create a new one
    //     // in this case it will override
    //     // here again we can chain then and catch block
    //     // but not to start nesting our promises
    //     // that will create the same ugly picture as in call back
    //     // we can return the promise by save
    //     // when we return we can add then block before catch
    //     // and the catch block will display the error for both 
    //     // then block
    //     product.save();
    // }).then( result => {
    //     // async operation get registered and allows the next step of program to be executed
    //     // if we put res.redirect at the last it will run res.redirect 
    //     // before getting the result
    //     // so we will not see the updated result at first but it gets updated
    //     console.log('Updated Product!');
    //     res.redirect('/admin/products');
    // }).catch(err => console.log(err));
   
}

exports.getProducts = (req, res, next) => {

    Product.fetch().then(products => {
        res.render('admin/products', { prods: products, docTitle: 'Admin Products', path: '/admin/products' });
    }).catch(err => {
        console.log(err);
    });
   /* Product.findAll().then(products => {
        res.render('admin/products', { prods: products, docTitle: 'Admin Products', path: '/admin/products' });
    }).catch(err => {
        console.log(err);
    }); */
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId).then(() => {
        console.log('DESTROYED PRODUCT');
        res.redirect('/admin/products');
    }).catch(err => console.log(err));
}


//controller/shop.js

//const products = [];

const Product = require("../models/product");
// const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
    Product.fetch().then(products => {
        res.render('shop/product-list', { prods: products, docTitle: 'All Products', path: '/products' });
    }).catch(err => {
        console.log(err);
    });
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    //to get the value of the promise we have to use ([]) because its an array of array which is passed
    //also we need to pass product[0] because its an array of array which is the result we get

    // Product.findAll({where : {id : prodId}}).then( products => {
    //     res.render('shop/product-detail',{product: products[0], pageTitle: products[0].title,path:'/products'});
    // }).catch(err => console.log(err));

    //findById is replaced by findByPk in current sequelize version
    Product.findById(prodId).then(product => {
        res.render('shop/product-detail', { product: product, pageTitle: product.title, path: '/products' });
    }).catch(err => {
        console.log(err);
    });
}

exports.getIndex = (req, res, next) => {
    Product.fetch().then(products => {
        res.render('shop/index', { prods: products, docTitle: 'Shop', path: '/' });
    }).catch(err => {
        console.log(err);
    });
    /*Product.fetchAll.then(result =>{
        console.log(result);
    });*/
    /*Product.fetchAll.then(products => {
        res.render('shop/index',{prods:products,docTitle:'Shop', path:'/'});
    }).catch(err => {
        console.log(err);
    });*/
}

exports.getCart = (req, res, next) => {
    req.user.getCart().then(products => {
        //it creates a magic function that checks in CartItem table having a cart with that product id
        return res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
        });
    }).catch(err => console.log(err));
}
/* Cart.getProducts(cart => {
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
});*/

// }

exports.postCart = (req, res, next) => {

    // if i have a product in cart then increase the quantity otherwise add add the product
    const prodId = req.body.productId;
    Product.findById(prodId).then(product => {
        return req.user.addToCart(product);
    }).then(result => {
        console.log(result);
        res.redirect('/cart');
    }).catch(err => {
        console.log(err);
    })
    // let fetchedCart;
    // let newQuantity = 1;
    // req.user.getCart().then(cart => {
    //     // this cart is not available near the statement Product.findByPk so to get that
    //     fetchedCart = cart;
    //     return cart.getProducts({where : {id: prodId}});
    // }).then(products =>{
    //     let product;
    //     if(products.length > 0){
    //         product = products[0];
    //     }
    //     //if we do have a product add the quantity
    //     if(product){
    //         console.log(product.cartItem.quantity);
    //         const oldQuantity = product.cartItem.quantity;
    //         newQuantity = oldQuantity + 1;
    //         return product;
    //     }
    //     // if we have no product
    //     return Product.findByPk(prodId);
    // }).then(product =>{
    //     return fetchedCart.addProduct(product,{through: {quantity: newQuantity}});
    // }).then(()=>{
    //     res.redirect('/cart');
    // }).catch(err => console.log(err));
    //res.redirect('/cart');
}

exports.postCartDeleteProduct = (req, res, next)=>{
    const prodId = req.body.productId;

    req.user.deleteItemFromCart(prodId).then(result =>{
        console.log(result);
        res.redirect('/cart');
    }).catch(err => { 
        console.log(err);
    });
}


exports.getOrders = (req,res,next) =>{
     //if you console log you will see that orders are not linked with orderItem in any of the orders
        //using eager loading which is
        //if we want to fetch related products in order we have to provide a field products
        //why products because order belongs to many product
        //the name sequelize.define has a product as a name in model
        //sequelize pluralizes this
        //eager loading when fetching orders please fetch products
        //each order will have product
    req.user.getOrders().then(orders =>{

        console.log(orders);
        res.render('shop/orders',{
            path: '/orders',
            pageTitle: 'Your Orders',
            orders: orders
        });
    });

}

exports.postOrders = (req,res,next) =>{
    let fetchedCart;
    req.user.addOrder().then(result=>{
        res.redirect('/orders');
    }).catch(err => console.log(err));
}

// exports.getCheckout = (req,res,next) =>{
//     res.render('shop/checkout',{
//         path: '/checkout',
//         pageTitle: 'Checkout'
//     });
// }

exports.get404 = (req, res, next) => {
    res.status(404).render('404', { pageTitle: 'page Not Found', path: '/404' });
}

//data folder

//models/product.js

//to refer to documentation
//https://www.mongodb.com --- not logged in
// click on resources in navigation /server
// select MongoDb Crud operation
// in mongodb 
const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
    constructor(title, price, description, imageUrl,id,userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        //because mongodb.ObjectId will create the id although if its null thats why this check
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.userId = userId;
    }

    save() {
        const db = getDb();
        //you can call collection with which collection you want to insert something
        //just like database
        //first level is database and the second level is collection
        //just as a database which when not created first time will be created 
        //in this collection we can execute couple of mongo db commands
        //full list can be found in mongo db doc
        // to insert one it will insert
        // to insert many it will insert many takes []
        let dbOp;
        if(this._id){
            //update the product
            //if we dont want to update all the values you can use
            //{$set: {title: this.title,}}
            dbOp = db.collection('products').updateOne({_id: this._id}, {$set : this});
        }else{
            dbOp = db.collection('products').insertOne(this);
        }
        return dbOp.then((result) => {
            console.log(result);
        }).catch(err => console.log(err));
    }

    static fetch() {
        const db = getDb();
        //find could be configured to 
        //find({title: 'A book'});
        // to find all products
        //find does not immediately returns a promise
        //it returns a cursor
        //it allows move on the documents
        //toArray is used to get all documents
        //if it is 100 documents
        ///otherwise its better use pagination
        // return Promise.resolve('check');
        return db.collection('products').find().toArray().then(products => {
            console.log(products);
            return products;
        }).catch(err => {
            console.log(err);
        });
    }

    static fetchAll() {
        //const db = getDb();
        //find could be configured to 
        //find({title: 'A book'});
        // to find all products
        //find does not immediately returns a promise
        //it returns a cursor
        //it allows move on the documents
        //toArray is used to get all documents
        //if it is 100 documents
        ///otherwise its better use pagination

        //return Promise.resolve('rahul');
        /*return db.collection('products').find().toArray().then(products =>{
            console.log(products);
            return products;
        }).catch(err =>{ 
            console.log(err);
        });*/
    }

    static findById(prodId){
        const db = getDb();
        //find will give me cursor
        //next can be used to get next or last document that was returned by find
        return db.collection('products').find({ _id: new mongodb.ObjectId(prodId)}).next().then(product=>{
            console.log(product);
            return product;
        }).catch();
    }

    static deleteById(prodId){
        const db = getDb();
        return db.collection('products').deleteOne({_id: new mongodb.ObjectId(prodId)}).then(result =>{
            console.log('deleted');
        }).catch(err => {
            console.log(err);
        });
    }
}


module.exports = Product;

//models/user.js

const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
    constructor(username, email, cart, id){
        this.name = username;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }

    save(){
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    addToCart(product) {

        //user.cart contains the database methods because it was retrieved from findById
        //so i was confused how this.cart.items because this cart is accessing database
        //because in User.findbyid it gets user which is a database variable
       
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });

        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];

        if(cartProductIndex >= 0){
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        }else {
            updatedCartItems.push({productId: new ObjectId(product._id), quantity: 1});
        }

        const updatedCart = {
            items: updatedCartItems
        };
        


        //don't want to store all the product data but only the product id because it can update the
        //value in product table then it will be a problem
        //items:[{...product, quantity: 1}]
        //so i removed the upper part and added this
        //const updatedCart = { items: [{productId: new ObjectId(product._id), quantity: 1}]};
        const db = getDb();
       
        return db.collection('users').updateOne({_id: new ObjectId(this._id)}, {$set: {cart: updatedCart}});
    }

    getCart(){
        const db = getDb();
        //what we are doing here is getting all the productIds 
        const productIds = this.cart.items.map(i => {
            return i.productId;
        });
        //$in takes an array of productids
        return db.collection('products').find({_id: {$in:productIds}}).toArray().then(products =>{
            return products.map(p => {
                return {...p, quantity: this.cart.items.find(i => {
                    //here i am checking if the cart contains this product id
                    //if it does then give the quantity also and add in the object list
                    return i.productId.toString() === p._id.toString();
                    //why here quantity because we just found the items product id
                    //so we have to get the quantity
                }).quantity};
            });
        });
    }

    deleteItemFromCart(productId){
        const updatedCartItems = this.cart.items.filter(item =>{
            return item.productId.toString() !== productId.toString();
        });
        const db = getDb();
        return db.collection('users').updateOne({_id: new ObjectId(this._id)}, {$set: {cart: {items: updatedCartItems}}});
    }

    addOrder(){
        //since we also need the information about the user and products
        const db = getDb();
        //because i just not want to fetch cart id but also product information
        return this.getCart().then(products => {
            const order = {
                items: products,
                user: {
                    _id: new ObjectId(this._id),
                    name: this.name,
                }
            };
            return db.collection('orders').insertOne(order);
        }).then(result => {
            this.cart = {items: []};
            return db.collection('users').updateOne({_id: new ObjectId(this._id)},{$set: {cart: {items: []}}});
        });
        const order = {
            items: this.cart.items,
            user: {
                _id: new ObjectId(this._id),
                name: this.name,
            }
        };
        return db.collection('orders').insertOne(this.cart).then(result => {
            this.cart = {items: []};
            return db.collection('users').updateOne({_id: new ObjectId(this._id)},{$set: {cart: {items: []}}});
        });
    }

    getOrders() {
        const db = getDb();
        //you can also check nested properties
        //we have to find the user id inside order
        // to do that we can also check nested properties
        //you have to use quotation for multiple ids
        return db.collection('orders').find({'user._id': new ObjectId(this._id)}).toArray();
    }

    static findById(userId){
        const db = getDb();
        //next will return the next or last or first document
        //return db.collection('users').find({_id: new ObjectId(userId)}).next();
        //there is another way which is findOne
        return db.collection('users').findOne({_id: new ObjectId(userId)});
    }
}

module.exports = User;

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

// //admin/products =>GET
router.get('/products', adminController.getProducts);

//admin/add-product =>POST
//for handling post request we can use app.post or app.get or app.patch or app.post or app.delete or app.put
router.post('/add-product',adminController.postAddProduct);


router.get('/edit-product/:productId',adminController.getEditProduct);

router.post('/edit-product',adminController.postEditProduct);

router.post('/delete-product',adminController.postDeleteProduct);

exports.routes = router;

//routes/shop.js

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/cart-delete-item', shopController.postCartDeleteProduct);

router.get('/orders', shopController.getOrders);

router.post('/create-order', shopController.postOrders);

// router.get('/checkout', shopController.getCheckout);
 
module.exports = router;

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

router.post('/cart-delete-item', shopController.postCartDeleteProduct);

router.get('/orders', shopController.getOrders);

router.post('/create-order', shopController.postOrders);

// router.get('/checkout', shopController.getCheckout);
 
module.exports = router;

//util/database.js

//npm install --save mongodb

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) =>{
    //mongodb+srv://rahul:Rahulsingh1985@cluster0.wuseu24.mongodb.net/?retryWrites=true&w=majority
    //add before question mark database name which is shop
    //mongodb+srv://rahul:Rahulsingh1985@cluster0.wuseu24.mongodb.net/shop?retryWrites=true&w=majority
    //if the database doesn't exist it will be created and if its there it won't have any problems
    MongoClient.connect('mongodb+srv://rahul:Rahulsingh1985@cluster0.wuseu24.mongodb.net/shop?retryWrites=true&w=majority').then(client =>{
        console.log('Connected');
        _db = client.db();
        callback();
        }).catch(err => {
            console.log(err);
            throw err;
        });
};

const getDb = () =>{
    if(_db){
        return _db;
    }
    throw 'No database found!';
}

//module.exports = mongoConnect;
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

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
                <input type="hidden" value="<%= product._id %>" name="productId">
            <% } %>

            <button class="btn" type="submit"><% if (editing) { %>Update Product<% } else { %> Add Product <% } %></button>
        </form>
    </main>

<%- include('../includes/end.ejs') %>
              
//admin/product.ejs
              
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
                    <a href="/admin/edit-product/<%= product._id %>?edit=true" class="btn">Edit</a>
                    <form action="/admin/delete-product" method="POST">
                        <input type="hidden" value="<%= product._id %>" name="productId">
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
    <input type="hidden" name="productId" value="<%= product._id %>">
</form>
                   
//views/includes/end.js
                   
<script src="/js/main.js"></script>
</body>

</html>
                   
//views/includes/head.js
                   
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

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
                        <p><%= p.title %>(<%= p.quantity %>)</p> <!--cartItem is related to model-->
                        <form action="/cart-delete-item" method="POST">
                            <input type="hidden" value="<%= p._id %>" name="productId">
                            <button class="btn" type="submit">Delete</button>
                        </form>
                    </li>
                <% }) %>
            </ul>
            <div class="centered">
                <hr style="margin-top: 20px; margin-bottom: 20px;">
                <form action="/create-order" method="POST">
                    <button type="submit" class="btn">Order Now!</button>
                </form>
            </div>
          
        <% } else { %>
        <h1>No Products in Cart</h1>
        <% } %>
    </main>
  <%- include('../includes/end.ejs') %>
   
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
          
   //views/shop/order.ejs
          
   <%- include('../includes/head.ejs') %>
   <link rel="stylesheet" type="text/css" href="/css/main.css">
</head>
<body>
    <%- include('../includes/navigation.ejs') %>
    <main>
        <% if(orders.length <= 0) { %>
        <h1>Nothing there!</h1>
        <% } else { %>
            <ul>
                <% orders.forEach(order => { %>
                <li>
                    <h1>#<%= order._id %></h1>
                    <ul>
                        <% order.items.forEach(product => { %>
                            <li><%=product.title %>(<%= product.quantity%>)</li>
                        <% }); %>
                    </ul>
                </li>
                <% }); %>
            </ul>
        <% } %>
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
                    <a href="/products/<%= product._id %>" class="btn">Details</a>
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
     
//app.js
      

const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const path = require('path');
const shopController = require('./controller/shop');

const mongoConnect = require('./util/database').mongoConnect;
//const mongoConnect = require('./util/database');
const User = require('./models/user');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop'); 


//db.execute('SELECT * FROM products').then(result => {console.log(result)}).catch(err => { console.log(err);});

app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended: false}));


//saving the req.user so that we can access in admin.js
// we are getting the value of user object
// ie we are having the user object
app.use((req,res, next)=>{
    //next is so that next middleware can be used
    User.findById('64327fe9d43dea05ec0ed2f2').then(user => { 
        //its important to understand
        //that the user we are storing it here
        // will be the object with just the property the data in the database
        //all the methods of the user model will not be in there
        //because the user we are getting here only from the database methods
        //req.user = user;
        //so we do not use this we change this
        //also user.cart contains the database methods
        req.user = new User(user.name, user.email, user.cart, user._id);
        next();
    }).catch(err => console.log(err));
   
});

app.use('/admin',adminData.routes);
app.use(shopRoutes);


app.use(shopController.get404);


//client is the value we recieve from mongodb
mongoConnect(() => {
    app.listen(3000);
})
          
