 //controller/shop.js
           const Product = require('../models/product');

           exports.getProducts = (req,res,next)=>{
              Product.findAll().then(products =>{
                   res.render('shop',{prods:products,docTitle:'All Products', path:'/products'
                                });
              }.catch(err=>{
                   console.log(err);
              });
            };

           export.getProduct = (req,res,next)=> {
             const prodId = req.params.productId;
             /*
             this is refering to cb in FindById function
             product => {
               console.log(product);
             }
             */
             Product.findById(prodId, product => {
               res.render('shop/product-detail', {
                 product: product,
                 pageTitle: product.title,
                 path: '/products' /* this is linked to the selected link in the navigation . this we are sending for navigation.ejs file path value */
               });
             });
             res.redirect('/');
           }

           //added code
            exports.getIndex = (req, res, next)=>{
              //findall is sequelize statement
                Product.findAll().then(products =>{
                  res.render('shop/index',{prods:products,docTitle:'Shop', path:'/'
                                });
                }).catch(err => {
                  console.log(err);
                });
                Product.fetchAll([rows,fieldData]=>{
                  
                }).then().catch(err => console.log(err));(products) =>{
                
              });
            };
