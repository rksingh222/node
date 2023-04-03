npm install --save mysql2

//you can use database mysql with use strongpassword encryption
// you can try also with legacy if it doesn't work
// use phpmyadmin and name it phpad in the mamp server inside htdocs after downloading from phpadmin site
//open it withe localhost:8888/phpad afte installing map server
//create a database 
// with node-complete database name
// create table products id, title, description, imageUrl , title

//models/product.js

const db = require('../util/database');
const Cart = require('./cart')

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id,
        this.title = title;
        this.imageUrl =imageUrl;
        this.description = description;
        this.price = price;
    }
    save() {
        return db.execute(
            'INSERT INTO products (title, price, imageUrl, description) VALUES (?,?,?,?)',
            [this.title,this.price, this.imageUrl, this.description]
        );
    }

    //retrieve all values is a utility function
    //call this method directly on the class itself
    static fetchAll() {
       return db.execute('SELECT * FROM products');
    }

    static deleteById(id){
        
    }

   static findById(id){
       return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
    }
}

//util/database.js

const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    database: 'node-complete',
    password: 'Rahul22-2-85'
});

module.exports = pool.promise();


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
    product.save().then(()=>{ res.redirect('/');}).catch(err => console.log(err));

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

//const products = [];

const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) =>{
    Product.fetchAll().then(([rows,fieldData])=>{
        res.render('shop/product-list',{prods:rows,docTitle:'All Products', path:'/products'});
    }).catch(err => console.log(err));
    
}

exports.getProduct = (req, res, next) =>{
    const prodId = req.params.productId;
    //to get the value of the promise we have to use ([]) because its an array of array which is passed
    //also we need to pass product[0] because its an array of array which is the result we get
    Product.findById(prodId).then(([product])=>{
        res.render('shop/product-detail',{product: product[0], pageTitle: product[0].title,path:'/products'});
    }).catch(err => {
        console.log(err);
    });
}

exports.getIndex = (req, res, next) =>{
    Product.fetchAll().then(([rows,fieldData])=>{
        res.render('shop/index',{prods:rows,docTitle:'Shop', path:'/'});
    }).catch(err => console.log(err));
    
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
