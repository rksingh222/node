          const Product = require('../models/product');
           export.getProduct = (req,res,next)=> {
             //another way
             const prodId = req.params.productId;
             //this will return an array not single element and to get single element we say product[0]
             Product.findAll({where: {id: prodId}}).then(products =>{
               res.render('shop/product-detail', {
                 product: product[0],
                 pageTitle: product[0].title,
                 path: '/products' /* this is linked to the selected link in the navigation . this we are sending for navigation.ejs file path value */
               });
             }).catch(err => console.log(err));
             
             //alternative way
             const prodId = req.params.productId;
             Product.findById(prodId).then(product =>{
               res.render('shop/product-detail', {
                 product: product,
                 pageTitle: product.title,
                 path: '/products' /* this is linked to the selected link in the navigation . this we are sending for navigation.ejs file path value */
               });
             }).catch(err => console.log(err));
             res.redirect('/');
           }
           
           changing the detail page css
           
           .image {
             height: 20rem;
           }

           .image img{
             height: 100%;
           }

          
