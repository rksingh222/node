  const Product = require('../models/product');

             const Cart =require('../models/cart');


             exports.getAddProduct = (req,res,next)=>{
              //res.sendFile(path.join(rootDir,'views','add-product.html'));
              //for pug type of file
              //for path it can be add-produt this is only for navigation
              res.render('admin/edit-product', {pageTitle: 'Add Product',path:'/admin/add-product',editing: false});
            };

           //added code here
            exports.postAddProduct = (req,res,next)=>{
               console.log(req.body); // the output comes undefined we need to parse it which is not happening so to parse we need to register parser

              const title = req.body.title;
              const imageUrl = req.body.imageUrl;
              const price = req.body.price;
              const description = req.body.description;
              Product.create({title: title, price: price, imageUrl: imageUrl, description:description}).then(result =>{console.log(result}).catch(err=>{
              console.log(err);
              });
               
             }
                                                                                                             
             you will get error in fetchall i have not worked on it                                                                                               
