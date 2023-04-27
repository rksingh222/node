// controller/admin.js

const { validationResult } = require('express-validator');
const Product = require("../models/product");
const mongodb = require('mongodb');
const fileHelper = require('../util/file');

//commented code has sequelize only with product and no user
//changed from add-product to edit-product in render
exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', { 
        pageTitle: 'Add Product', 
        path: '/admin/add-product', 
        editing: false ,
        hasError: false,
        errorMessage: null,
        isAuthenticated: req.session.isLoggedIn});
}

exports.postAddProduct = (req, res, next) => {
    console.log(req.body); // the output comes undefined we need to parse it which is not happening so to parse we need to register parser
    //products.push({ title: req.body.title });
    //passing userId when passed from app.js 
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    console.log(image);
    console.log("test");
    //with belongs to hasmany association  
    //for user it creates a Product  we can call this method because sequelize  hasmany relationship 
    //why i am doing this because the session id creates a different type of objectid
    //so convert that into string first and then convert it into mongodb onject
    if(!image){
        return res.status(422).render('admin/edit-product', { 
            pageTitle: 'Add Product', 
            path: '/admin/edit-product', 
            editing: false, 
            hasError: true,
            errorMessage: 'Attached file is not a image file',
            product: {
                title: title,
                price: price,
                description: description
            },
            validationErrors: [],
            isAuthenticated: req.session.isLoggedIn
        });
    }
    
    console.log(new mongodb.ObjectId(req.session.user._id.toString()));
 
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('admin/edit-product', { 
            pageTitle: 'Add Product', 
            path: '/admin/edit-product', 
            editing: false, 
            hasError: true,
            errorMessage: errors.array()[0].msg,
            product: {
                title: title,
                price: price,
                description: description
            },
            isAuthenticated: req.session.isLoggedIn
        });
    }

    const imageUrl = image.path;
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
        res.render('admin/edit-product', { 
            pageTitle: 'Edit Product', 
            path: '/admin/edit-product', 
            editing: editMode, 
            product: product ,
            hasError: false,
            isAuthenticated: req.session.isLoggedIn,
            errorMessage: null
        });
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
    const image = req.file;
    const updatedDesc = req.body.description;
    //why i am doing this because on editing the productimage url is not 
    //there we have to fetch productimage url if there is not image uploaded
    let productfetched;
    Product.findById(prodId).then(product => {
        productfetched = product;
        if (!product) {
            return next(new Error('Product not found.'));
        }
       
    }).catch(err => console.log(err));
    if(image){
        fileHelper.deleteFile(productfetched.imageUrl);
        updatedImageUrl = image.path;
    }else{
        updatedImageUrl = productfetched.imageUrl
    }
    console.log("image path")
    console.log(image);
    const product = new Product(updatedTitle, updatedPrice,updatedDesc,updatedImageUrl ,prodId,req.user._id);

     //here if you want to verify the product with user id
     /*Product.findById(prodId).then(product =>{
         if(product.userId.toString() !== req.user._id.toString()){
             return res.redirect('/');
         }
         product.title = updatedTitle;
         product.price = updatedPrice;
         product.desctiption = updatedDesc;
         product.imageUrl = updatedImageUrl;
         const product = new Product(product.title, product.price,product.desctiption,product.imageUrl  ,prodId)

         return product.save().then(result =>{
            console.log('Updated Product!');
            res.redirect('/admin/products');
         });
     }).catch(err => console.log(err));*/
     console.log(prodId);
     const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('admin/edit-product', { 
            pageTitle: 'Edit Product', 
            path: '/admin/edit-product', 
            editing: true, 
            hasError: true,
            errorMessage: errors.array()[0].msg,
            product: {
                title: updatedTitle,
                price: updatedPrice ,
                description: updatedDesc
            },
            isAuthenticated: req.session.isLoggedIn
        });
    }

    product.save().then( result => {
            // async operation get registered and allows the next step of program to be executed
            // if we put res.redirect at the last it will run res.redirect 
            // before getting the result
            // so we will not see the updated result at first but it gets updated
            console.log('Updated Product!');
            res.redirect('/admin/products');
    }).catch(err => {
        console.log(err)
        const error = new Error(err);
        error.httpStatusCode = 500;
        //passing error with next is unusual occurence
        //it will skip other middleware
        //and move right away error handling middleware
        return next(error);
    });
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

    /*Product.fetch().then(products => {
        res.render('admin/products', { prods: products, docTitle: 'Admin Products', path: '/admin/products' ,isAuthenticated: req.session.isLoggedIn});
    }).catch(err => {
        console.log(err);
    });*/

    Product.fetchallbyid(req.user._id).then(products => {
        res.render('admin/products', { prods: products, docTitle: 'Admin Products', path: '/admin/products' ,isAuthenticated: req.session.isLoggedIn});
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


    Product.findById(prodId).then(product => {
        if (!product) {
            return next(new Error('Product not found.'));
        }
        fileHelper.deleteFile(product.imageUrl);
        //once you call return 
        //it will go to the next then block 
        return Product.deleteById(prodId)
    }).then(() => {
        console.log('DESTROYED PRODUCT');
        res.redirect('/admin/products');
    }).catch(err => console.log(err));

    /*Product.deleteById(prodId).then(() => {
        console.log('DESTROYED PRODUCT');
        res.redirect('/admin/products');
    }).catch(err => console.log(err));*/
}

//controller/auth.js

//it allows you to unique generate random bytes
//this is used for generating token
const crypto = require('crypto');

const { validationResult } = require('express-validator');

//this require is used for password hashing 
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: 'send grid api key'
    }
}))

exports.getLogin = (req, res, next) => {
    //cookies retrieving
    //let isLoggedIn = null;
    //if(req.get('Cookie')){
    //  isLoggedIn = req.get('Cookie').split('=')[1].trim();
    //}
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    console.log(req.session.isLoggedIn);
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false,
        errorMessage: message
        //here validationErrors
        //validationErrors: []
    });
}
//what ever is stored in the error will be retrieved
//in stored in error message
//there after the information is removed from the session
exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false,
        errorMessage: message,
        oldInput: {
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationErrors: []
    })
}

exports.postLogin = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;
    //creating the user here to store
    //validating error
    
    // const errors = validationResult(req);
    // console.log(errors.array());
    // if(! errors.isEmpty()) {
    //     return res.status(422).render('auth/login', {
    //         path: '/login',
    //         pageTitle: 'Login',
    //         isAuthenticated: false,
    //         errorMessage: errors.array()[0].msg,
    //         oldInput: {
    //             email: email,
    //             password: password
    //         },
    //         validationErrors: errors.array()
    //     });
    // }

    //there is one more error that stem from entering invalid username or password
    //in such case
    
     
    // User.findByEmail(email).then(user => {
    //     if (!user) {
    //         //if you do not provide the right email which
    //         // is store in the database we will send a flash message
    //         // we will pull this message in the login exports
    //         req.flash('error', 'Invalid email or password.');
    //         return res.status(422).render('auth/login', {
    //                     path: '/login',
    //                     pageTitle: 'Login',
    //                     isAuthenticated: false,
    //                     errorMessage: 'Invalid email or password',
    //                     oldInput: {
    //                         email: email,
    //                         password: password
    //                     },
    //                     validationErrors: [] or [{path: 'email', path:'password'}]
    //                 });
    //     }
    //     bcrypt.compare(password, user.password).then(doMatch => {
    //         if (doMatch) {
    //             req.session.isLoggedIn = true;
    //             req.session.user = user;
    //             return req.session.save(err => {
    //                 console.log(err);
    //                 res.redirect('/');
    //             })
    //         }
    //         return res.status(422).render('auth/login', {
    //             path: '/login',
    //             pageTitle: 'Login',
    //             isAuthenticated: false,
    //             errorMessage: 'Invalid email or password',
    //             oldInput: {
    //                 email: email,
    //                 password: password
    //             },
    //             validationErrors: [] or [{path: 'email', path:'password'}]
    //         });
    //     }).catch(err => {
    //         console.log(err);
    //         res.redirect('/login');
    //     });
    // })



    User.findByEmail(email).then(user => {
        if (!user) {
            //if you do not provide the right email which
            // is store in the database we will send a flash message
            // we will pull this message in the login exports
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }
        bcrypt.compare(password, user.password).then(doMatch => {
            if (doMatch) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save(err => {
                    console.log(err);
                    res.redirect('/');
                })
            }
            res.redirect('/login');
        }).catch(err => {
            console.log(err);
            res.redirect('/login');
        });
    })

    // //next is so that next middleware can be used
    // User.findById('64327fe9d43dea05ec0ed2f2').then(user => {
    //     //its important to understand
    //     //that the user we are storing it here
    //     // will be the object with just the property the data in the database
    //     //all the methods of the user model will not be in there
    //     //because the user we are getting here only from the database methods
    //     //req.user = user;
    //     //so we do not use this we change this
    //     //also user.cart contains the database methods

    //     //new User(user.name, user.email, user.cart, user._id)
    //     req.session.isLoggedIn = true;
    //     req.session.user = user;
    //     req.session.save(err => {
    //         console.log(err);
    //         res.redirect('/');
    //     })

    // }).catch(err => console.log(err));

    //this wonts work as we mentioned in the document
    //res.setHeader('Set-Cookie', 'loggedIn=true;Expires=');
    //cookie expires after 10 second
    //res.setHeader('Set-Cookie', 'loggedIn=true;Max-Age=10');
    //the cookie will work with https only
    //res.setHeader('Set-Cookie', 'loggedIn=true;Max-Age=10;Secure;HttpOnly');
    //this will work only with http
    //res.setHeader('Set-Cookie', 'loggedIn=true;Max-Age=10;HttpOnly');

    //sessions are stored in the server

    //cookies are stored in client side
    //res.setHeader('Set-Cookie', 'loggedIn=true');

    //sessions assigned



    //req.isLoggedIn = true;
    //res.redirect('/');
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmpassword;

    const errors = validationResult(req);
    console.log(errors.array());
    if(! errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            isAuthenticated: false,
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password,
                confirmPassword: confirmPassword,
            },
            validationErrors: errors.array()
        });
    }

    /*User.findByEmail(email).then(userDoc => {
        if (userDoc) {
            req.flash('error', 'E-Mail exist already, please pick a different one');
            return res.redirect('/signup');
        }
        return */
        bcrypt.hash(password, 12).then(hashedPassword => {
            //here he is just saving not sending it to request
            const user = new User(email, hashedPassword, { items: [] }, null, null, null);
            return user.save();
        }).then(result => {
            res.redirect('/login');
            return transporter.sendMail({
                to: email,
                from: 'rahulaliasjake@gmail.com',
                subject: 'Signup succeeded',
                html: '<h1>You successfully signed up</h1>'
            });
        }).catch(err => {
            console.log(err);
        });
    /*}).catch(err => {
        console.log(err);
    })*/
}


exports.postLogout = (req, res, next) => {
    //to destroy the saved session
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    })
}

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    //to destroy the saved session
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        isAuthenticated: false,
        errorMessage: message
    });
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findByEmail(req.body.email).then(user => {
            if (!user) {
                req.flash('error', 'No account with that email found.');
                return res.redirect('/reset');
            }
            //console.log(req.user);
            const updateuser = new User(user.email, user.password, user.cart, user._id, token, Date.now() + 36000000);
            return updateuser.save();
        }).then(result => {
            //why we are calling res.redirect so that
            //everything will happen through mail password resetting
            res.redirect('/');
            transporter.sendMail({
                to: req.body.email,
                from: 'rahulaliasjake@gmail.com',
                subject: 'Password reset',
                html: `
                    <p>You requested a password reset</p>
                    <p> Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
                `
            });
        }).catch(err => {
            console.log(err);
        })
    });
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findByToken(token).then(user => {
        let message = req.flash('error');
        if (message.length > 0) {
            message = message[0];
        } else {
            message = null;
        }
        console.log("id");
        console.log(user._id);
        res.render('auth/new-password', {
            path: '/new-password',
            pageTitle: 'New Password',
            isAuthenticated: false,
            errorMessage: message,
            userId: user._id.toString(),
            passwordToken: token
        });
    }).catch(err =>{
        console.log(err);
    });
}

exports.postNewPassword = (req, res, next) =>{
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
    console.log("id");
    console.log(userId);
    User.findByTokenAndId(passwordToken, userId).then(user =>{
        resetUser = user;
        return bcrypt.hash(newPassword, 12)
    }).then(hashedPassword =>{
        console.log(resetUser.password);
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        const updateuser = new User(resetUser.email, resetUser.password, resetUser.cart, resetUser._id, resetUser.resetToken, resetUser.resetTokenExpiration);
        return updateuser.save();
       
    }).then(result =>{
        res.redirect('/login');
    }).catch(err =>{
        console.log(err);
    })
}

//controller/shop.js

//const products = [];
const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');

const Product = require("../models/product");
const User = require('../models/user');
// const Cart = require("../models/cart");
const ITEMS_PER_PAGE = 1;

exports.getProducts = (req, res, next) => {

    const page = +req.query.page || 1;
    let totalItems;
    console.log("inside getIndex");

    Product.countNumberOfProducts().then(numProducts =>{
        console.log("inside countNumberOfProducts");
        totalItems = numProducts;
        return Product.fetchperpage(page,ITEMS_PER_PAGE);
    }).then(products => {
           console.log("fetchedperpage output");
            res.render('shop/product-list', 
            { prods: products, 
               docTitle: 'All Products', 
                path: '/products' , 
                isAuthenticated: req.session.isLoggedIn,
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            });
    }).catch(err => {
       console.log(err);
    });



   /* Product.fetch().then(products => {
        res.render('shop/product-list', 
        { prods: products, 
            docTitle: 'All Products', 
            path: '/products' ,
            isAuthenticated: req.session.isLoggedIn});
    }).catch(err => {
        console.log(err);
    }); */
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
        res.render('shop/product-detail', { product: product, pageTitle: product.title, path: '/products' ,isAuthenticated: req.session.isLoggedIn});
    }).catch(err => {
        console.log(err);
    });
}

exports.getIndex = (req, res, next) => {
    //by adding + before the req.query.page it converts it from string to integer
    //if req.query.page is undefined or having no value it will take 1 by default
    const page = +req.query.page || 1;
    let totalItems;
    console.log("inside getIndex");

    Product.countNumberOfProducts().then(numProducts =>{
        console.log("inside countNumberOfProducts");
        totalItems = numProducts;
        return Product.fetchperpage(page,ITEMS_PER_PAGE);
    }).then(products => {
           console.log("fetchedperpage output");
            res.render('shop/index', 
            { prods: products, 
               docTitle: 'Shop', 
                path: '/' , 
                isAuthenticated: req.session.isLoggedIn,
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            });
    }).catch(err => {
       console.log(err);
    });

    // Product.fetch().then(products => {
    //     res.render('shop/index', { prods: products, docTitle: 'Shop', path: '/' , isAuthenticated: req.session.isLoggedIn});
    // }).catch(err => {
    //     console.log(err);
    // });

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
            products: products,
            isAuthenticated: req.session.isLoggedIn
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
            orders: orders,
            isAuthenticated: req.session.isLoggedIn
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
    res.status(404).render('404', { pageTitle: 'page Not Found', path: '/404' ,isAuthenticated: req.session.isLoggedIn});
}

exports.get500 = (req, res, next) =>{
    res.status(500).render('500', {
        pageTitle: 'Error!',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
    })
}

exports.getInvoice = (req, res, next) =>{
    const orderId = req.params.orderId;
    const invoiceName = 'invoices-' + orderId + '.pdf';
    const invoicePath = path.join('data','invoices', invoiceName);
    
    User.orderfindById(orderId).then(order =>{
        if(!order) {
            //when you do this it will go to app.js
            // app.use((error, req,res, next)=>{
            //     //res.status(error.httpStatusCode).render(....);
            //     res.redirect('/500');
            // })
            console.log("no order found");
            return next(new Error('No order found.'));
        }
        if(order.user._id.toString() !== req.user._id.toString()){
            console.log(" order user id do not match with requested user id");
            return next(new Error('Unauthorized'));
        }

        /*fs.readFile(invoicePath, (err, data) =>{
            if(err){
                //so that no other codes gets executed
                return next(err);
            }
            //set this header with send will open the pdf file in brower
            res.setHeader('Content-Type','application/pdf');
            //set this header to download the file with extension .pdf
            res.setHeader('Content-Disposition', 'attachment; filename="' + invoiceName + '"');
    
            //to read the file in the brower we set Content-Disposition and inline
            //res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
    
            //res.setHeader('Content-Disposition', 'inline');
            res.send(data);
        })*/
        //to download in stream
        //const file = fs.createReadStream(invoicePath);
        //res.setHeader('Content-Type','application/pdf');
        //res.setHeader('Content-Disposition', 'attachment; filename="' + invoiceName + '"');
        //file.pipe(res);

        //you can check pdfkit.org tutorial
        const pdfDoc = new PDFDocument();
        res.setHeader('Content-Type','application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="' + invoiceName + '"');
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        pdfDoc.pipe(res);
        pdfDoc.text('Hello world!');
        pdfDoc.fontSize(26).text('Invoice',{
            underline: true
        });
        pdfDoc.text('--------------------');
        let totalPrice = 0;
        order.items.forEach(prod =>{
            totalPrice += prod.quantity * prod.price;
            pdfDoc.text(prod.title + ' - ' + prod.quantity + 'x' + prod.price);
        });
        pdfDoc.text('Total Price: $' + totalPrice);
        pdfDoc.end();

    }).catch(err => {
        console.log(err);
        next(err)
    });
}

//create folder
//data

//data/invoices

//images

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
            console.log('updating');
            dbOp = db.collection('products').updateOne({_id: this._id}, {$set : this});
        }else{
            console.log('adding');
            dbOp = db.collection('products').insertOne(this);
        }
        return dbOp.then((result) => {
            console.log(result);
        }).catch(err => console.log(err));
    }

    static countNumberOfProducts(){
        const db = getDb();
        return db.collection('products').countDocuments().then(countProducts => {
            console.log(countProducts);
            return countProducts;
        }).catch(err => {
            console.log(err);
        });
    }

    static fetchperpage(page, itemsperpage){
        const db = getDb();
        return db.collection('products').find().skip((page - 1)*itemsperpage).limit(itemsperpage).toArray().then(products => {
            console.log(products);
            return products;
        }).catch(err => {
            console.log(err);
        });
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

    //why i created this function
    // so that i access only with the current logged in user created products
    static fetchallbyid(userId){
        const db = getDb();
        return db.collection('products').find({userId: userId}).toArray().then(products => {
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
            console.log('updating');
            dbOp = db.collection('products').updateOne({_id: this._id}, {$set : this});
        }else{
            console.log('adding');
            dbOp = db.collection('products').insertOne(this);
        }
        return dbOp.then((result) => {
            console.log(result);
        }).catch(err => console.log(err));
    }

    static countNumberOfProducts(){
        const db = getDb();
        return db.collection('products').countDocuments().then(countProducts => {
            console.log(countProducts);
            return countProducts;
        }).catch(err => {
            console.log(err);
        });
    }

    static fetchperpage(page, itemsperpage){
        const db = getDb();
        return db.collection('products').find().skip((page - 1)*itemsperpage).limit(itemsperpage).toArray().then(products => {
            console.log(products);
            return products;
        }).catch(err => {
            console.log(err);
        });
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

    //why i created this function
    // so that i access only with the current logged in user created products
    static fetchallbyid(userId){
        const db = getDb();
        return db.collection('products').find({userId: userId}).toArray().then(products => {
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
    constructor(email, password,  cart, id, resetToken, resetTokenExpiration){
       // this.name = username;
        this.email = email;
        this.password = password;
        this.cart = cart;
        this._id = id;
        this.resetToken = resetToken;
        this.resetTokenExpiration = resetTokenExpiration;
    }

    save(){
        const db = getDb();
        if(!this._id){
            return db.collection('users').insertOne(this);
        }else{
            return db.collection('users').updateOne({_id: this._id}, {$set : this});
        }
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
        /*const order = {
            items: this.cart.items,
            user: {
                _id: new ObjectId(this._id),
                name: this.name,
            }
        };
        return db.collection('orders').insertOne(this.cart).then(result => {
            this.cart = {items: []};
            return db.collection('users').updateOne({_id: new ObjectId(this._id)},{$set: {cart: {items: []}}});
        });*/
    }

    getOrders() {
        const db = getDb();
        //you can also check nested properties
        //we have to find the user id inside order
        // to do that we can also check nested properties
        //you have to use quotation for multiple ids
        return db.collection('orders').find({'user._id': new ObjectId(this._id)}).toArray();
    }

    static orderfindById(id) {
        const db = getDb();
        return db.collection('orders').findOne({_id: new ObjectId(id)});
    }

    static findById(userId){
        const db = getDb();
        //next will return the next or last or first document
        //return db.collection('users').find({_id: new ObjectId(userId)}).next();
        //there is another way which is findOne
        return db.collection('users').findOne({_id: new ObjectId(userId)});
    }

    static findByEmail(email){
        const db = getDb();
        return db.collection('users').findOne({email: email});
        
    }

    static findByToken(resetToken){
        const db = getDb();
        return db.collection('users').findOne({resetToken: resetToken, resetTokenExpiration: {$gt : Date.now() }});

    }
    static findByTokenAndId(resetToken, id){
        const db = getDb();
        console.log(resetToken);
        console.log(id);
        console.log(new ObjectId(id));
        return db.collection('users').findOne({resetToken: resetToken,_id: new ObjectId(id)});
    }
}

module.exports = User;

//public/css/auth.css

.login-form {
  width: 20rem;
  max-width: 90%;
  display: block;
  margin: auto;
}

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

.form-control input.invalid{
    border-color: red;
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

/*.main-header__nav {
  height: 100%;
  display: none;
  align-items: center;
}*/

.main-header__nav {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.user-message{
  margin: auto;
  width: 90%;
  border: 1px solid #4771fa;
  padding: 0.5rem;
  border-radius: 3px;
  background: #b9c9ff;
  text-align: center; 
}
.user-message--error{
  border-color: red;
  background: rgb(255, 176, 176);
  color: red;
}

.pagination{
  margin-top: 2rem;
  text-align: center;
}

.pagination a{
  text-decoration: none;
  color: #00695c;
  padding: 0.5rem;
  border: 1px solid #00695c;
  margin: 0 1rem;
}

.pagination a:hover, 
.pagination a:active,
.pagination a.active{
  background: #00695c;
  color: white;
}

@media (min-width: 768px) {
  .main-header__nav {
    display: flex;
  }

  #side-menu-toggle {
    display: none;
  }
  .user-message {
    width: 30rem;
  }
}

//public/css/product.css

.product-form {
    width: 20rem;
    max-width: 90%;
    display: block;
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
const isAuth = require('../middleware/is-auth');
const { body } = require('express-validator');
//you can add as many handler for any route you want and the request will be funnelled through
//them from left to right

//  /add-product is associated with localhost:3000/admin/add-product and only get request
// /admin/add-product =>GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// //admin/products =>GET
router.get('/products', isAuth, adminController.getProducts);

//admin/add-product =>POST
//for handling post request we can use app.post or app.get or app.patch or app.post or app.delete or app.put
router.post('/add-product', [
    body('title').isString().isLength({ min: 3 }).trim(),
    body('price').isFloat(),
    body('description').isLength({ min: 5, max: 400 }).trim()
], isAuth, adminController.postAddProduct);


router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product',[
    body('title').isString().isLength({ min: 3 }).trim(),
    body('price').isFloat(),
    body('description').isLength({ min: 5, max: 400 }).trim()
], isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

exports.routes = router;

//routes/auth.js

const express = require('express');

const User = require('../models/user');
//express -validator for server side validation
const { check, body } = require('express-validator');

const authController = require('../controller/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup)

router.post('/login', authController.postLogin);

//you can have multiple check error by [] body means it will check only in the body and normal it will check everywhere
// return true means don't throw any error 
// return false means throw a default error which is invalid
//check(name attribute in input type)
router.post('/signup',[ check('email').isEmail().withMessage('Please enter a valid email.').custom((value, {req})=>{
    //express validator will look for custom validator
    // to return true or false to return a thrown error
    //or to return a promise
    //if its a promise
    //express validator will wait for the promise to be fulfilled
    //if there is no error it will be successful
    //if it reject with some error message
    //this express validator will detect this rejection
    // this message will be stored in error message
    //this is how we can create our own async validator
    //async because its interacting with databse
    return User.findByEmail(value).then(userDoc => {
        if (userDoc) {
            return Promise.reject('E-Mail exist already, please pick a different one');
        }
    });
}).normalizeEmail() , body('password','Please enter a password with only numbers and text and at least 5 characters').isLength({min: 5}).isAlphanumeric().trim(),
  body('confirmpassword').trim().custom((value, {req})=>{
      if (value !== req.body.password){
          throw new Error('Passwords have to match!');
      }
      return true;
  })
], authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;

//routes/shop.js

const path = require('path');
const express = require('express');
const router = express.Router();
const rootDir = require('../util/path');
const adminData = require("./admin");
const shopController = require('../controller/shop');
const isAuth = require('../middleware/is-auth');

//get post will actually to do exact match  instead if we use router.use() it will work differently
router.get('/',shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId',shopController.getProduct);

router.get('/cart',isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth,  shopController.postCartDeleteProduct);

router.get('/orders', isAuth,  shopController.getOrders);

router.post('/create-order', isAuth,  shopController.postOrders);

// router.get('/checkout', shopController.getCheckout);
 
//to download pdf /orders/:orderId
router.get('/orders/:orderId', isAuth, shopController.getInvoice);


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

//util/file.js

const fs = require('fs');

const deleteFile = (filePath) =>{
    fs.unlink(filePath, (err)=>{
        if(err){
            throw (err);
        }
    });
}

exports.deleteFile = deleteFile;

//util/path.js

const path = require('path');
module.exports = path.dirname(process.mainModule.filename);

//views/admin/edit-product.ejs

<%- include('../includes/head.ejs') %>
    <link rel="stylesheet" type="text/css" href="/css/form.css">
    <link rel="stylesheet" type="text/css" href="/css/main.css">
    <link rel="stylesheet" type="text/css" href="/css/product.css">
    
</head>
<body>
    <%- include('../includes/navigation.ejs') %>
    <main>
        <% if (errorMessage) {%>
            <div class="user-message user-message--error"><%= errorMessage %></div>
        <% } %>
        <form class="product-form" action="/admin/<% if(editing) { %>edit-product<% } else { %>add-product<% } %>" method="POST" enctype="multipart/form-data">
            <div class="form-control">
                <label for="title">Title</label>
                <input type="text" name="title" id="title" value="<% if(editing || hasError) { %><%= product.title%><% } %>">
            </div>
             <!-- <div class="form-control">
                <label for="imageUrl">Image URL</label>
                <input type="text" name="imageUrl" id="imageUrl" value="<% if(editing || hasError) { %><%= product.imageUrl%><% } %>">
            </div> -->

            <!-- images are not displayed because images folder is not public-->
            <!-- in the network tab when you see it will show localhost:3000/admin/images eror-->
            <div class="form-control">
                <label for="image">Image</label>
                <input type="file"
                       name="image"
                       id="image" >
            </div>

            <div class="form-control">
                <label for="price">Price</label>
                <input type="number" name="price" id="price" step="0.01" value="<% if(editing || hasError) { %><%= product.price%><% } %>">
            </div>
            <div class="form-control">
                <label for="price">Description</label>
                <textarea  name="description" id="description" rows="5"><% if(editing || hasError ) { %><%= product.description%><% } %></textarea>
            </div>
            <% if (editing) { %>
                <input type="hidden" value="<%= product._id %>" name="productId">
            <% } %>

            <button class="btn" type="submit"><% if (editing) { %>Update Product<% } else { %> Add Product <% } %></button>
        </form>
    </main>

<%- include('../includes/end.ejs') %>


//views/admin/products.ejs
              
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
                    <!--adding absolute path by adding /-->
                    <img src="/<%=product.imageUrl %>" alt="<%=product.title %>">
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
          
 //views/auth/login.ejs
          
  <%- include('../includes/head.ejs') %>
    <link rel="stylesheet" type="text/css" href="/css/form.css">
    <link rel="stylesheet" type="text/css" href="/css/main.css">
    <link rel="stylesheet" type="text/css" href="/css/auth.css">
    
</head>
<body>
    <%- include('../includes/navigation.ejs') %>
    <main>
        <% if (errorMessage) {%>
        <div class="user-message user-message--error"><%= errorMessage %></div>
        <% } %>
        <form class="login-form" action="/login" method="POST">
            <div class="form-control">
                <label for="email">E-mail</label>
                <input type="text" name="email" id="email">
            </div>
            <div class="form-control">
                <label for="password">Password</label>
                <input type="password" name="password" id="password" >
            </div>
            <button class="btn" type="submit">Login</button>
        </form>
        <div class="centered">
            <a href="/reset">Reset Password</a>
        </div>
    </main>

<%- include('../includes/end.ejs') %>        

//views/auth/new-password.ejs
              
<%- include('../includes/head.ejs') %>
    <link rel="stylesheet" type="text/css" href="/css/form.css">
    <link rel="stylesheet" type="text/css" href="/css/main.css">
    <link rel="stylesheet" type="text/css" href="/css/auth.css">
    
</head>
<body>
    <%- include('../includes/navigation.ejs') %>
    <main>
        <% if (errorMessage) {%>
        <div class="user-message user-message--error"><%= errorMessage %></div>
        <% } %>
        <form class="login-form" action="/new-password" method="POST">
            <div class="form-control">
                <label for="password">Password</label>
                <input type="password" name="password" id="password" >
            </div>
            <input type="hidden" name="userId" value="<%= userId %>">
            <input type="hidden" name="passwordToken" value="<%= passwordToken %>">
            <button class="btn" type="submit">Update Password</button>
        </form>
    </main>

<%- include('../includes/end.ejs') %>
              
//views/auth/reset.ejs
              
<%- include('../includes/head.ejs') %>
    <link rel="stylesheet" type="text/css" href="/css/form.css">
    <link rel="stylesheet" type="text/css" href="/css/main.css">
    <link rel="stylesheet" type="text/css" href="/css/auth.css">
    
</head>
<body>
    <%- include('../includes/navigation.ejs') %>
    <main>
        <% if (errorMessage) {%>
        <div class="user-message user-message--error"><%= errorMessage %></div>
        <% } %>
        <form class="login-form" action="/reset" method="POST">
            <div class="form-control">
                <label for="email">E-mail</label>
                <input type="text" name="email" id="email">
            </div>
            <button class="btn" type="submit">Reset Password</button>
        </form>
        
    </main>

<%- include('../includes/end.ejs') %>              
              
//views/auth/reset.ejs
              
<%- include('../includes/head.ejs') %>
    <link rel="stylesheet" type="text/css" href="/css/form.css">
    <link rel="stylesheet" type="text/css" href="/css/main.css">
    <link rel="stylesheet" type="text/css" href="/css/auth.css">
    
</head>
<body>
    <%- include('../includes/navigation.ejs') %>
    <main>
        <% if (errorMessage) {%>
        <div class="user-message user-message--error"><%= errorMessage %></div>
        <% } %>
        <form class="login-form" action="/reset" method="POST">
            <div class="form-control">
                <label for="email">E-mail</label>
                <input type="text" name="email" id="email">
            </div>
            <button class="btn" type="submit">Reset Password</button>
        </form>
        
    </main>

<%- include('../includes/end.ejs') %>
              
//views/auth/signup.ejs
              
<%- include('../includes/head.ejs') %>
    <link rel="stylesheet" type="text/css" href="/css/form.css">
    <link rel="stylesheet" type="text/css" href="/css/main.css">
    <link rel="stylesheet" type="text/css" href="/css/auth.css">
    
</head>
<body>
    <%- include('../includes/navigation.ejs') %>
    <main>
        <% if (errorMessage) {%>
            <div class="user-message user-message--error"><%= errorMessage %></div>
        <% } %>
        <form class="login-form" action="/signup" method="POST" novalidate>
            <div class="form-control">
                <label for="email">E-mail</label>
                <input
                    class="<%= validationErrors.find(e => e.path === 'email') ? 'invalid' : '' %>" 
                    type="text" 
                    name="email" 
                    id="email" 
                    value="<%= oldInput.email %>">
            </div>
            <div class="form-control">
                <label for="password">Password</label>
                <input 
                      class="<%= validationErrors.find(e => e.path === 'password') ? 'invalid' : '' %>"
                       type="password" 
                       name="password" 
                       id="password" 
                       value="<%= oldInput.password %>">
            </div>
            <div class="form-control">
                <label for="password">Confirm Password</label>
                <input 
                      class="<%= validationErrors.find(e => e.path === 'confirmpassword') ? 'invalid' : '' %>"
                      type="password" 
                      name="confirmpassword" 
                      id="password" 
                      value="<%= oldInput.confirmPassword %>">
            </div>
            <button class="btn" type="submit">Signup</button>
        </form>
    </main>

<%- include('../includes/end.ejs') %>
              
 //views/includes/add-to-cart.ejs
              
<form action="/cart" method="post">
    <button class="btn" type="submit">Add to cart</button>
    <input type="hidden" name="productId" value="<%= product._id %>">
</form>
                              
 //views/includes/end.ejs

 <script src="/js/main.js"></script>
</body>

</html>
                              
 //views/includes/head.ejs
                              
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
            <% if (isAuthenticated) { %>
                <li class="main-header__item">
                    <a class="<%= path === '/cart' ? 'active' : '' %>" href="/cart">Cart</a>
                </li>
                <li class="main-header__item">
                    <a class="<%= path === '/orders' ? 'active' : '' %>" href="/orders">Orders</a>
                </li>

                <li class="main-header__item">
                    <a class="<%= path === '/admin/add-product' ? 'active' : '' %>" href="/admin/add-product">Add
                        Product
                    </a>
                </li>
                <li class="main-header__item">
                    <a class="<%= path === '/admin/products' ? 'active' : '' %>" href="/admin/products">Admin Products
                    </a>
                </li>
                <% } %>
        </ul>
        <ul class="main-header__item-list">
            <% if (!isAuthenticated) { %>
            <li class="main-header__item">
                <a class="<%= path === '/login' ? 'active' : '' %>" href="/login">Login</a>
            </li>
            <li class="main-header__item">
                <a class="<%= path === '/signup' ? 'active' : '' %>" href="/signup">Signup</a>
            </li>
            <% } else { %>
            <li class="main-header__item">
                <form action="/logout" method="post">
                    <button type="submit">Logout</button>
                </form>
            </li>
            <% } %>
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
                       
//views/includes/pagination.ejs
                       
<section class="pagination">
    <% if(currentPage !== 1  &&  previousPage !== 1) { %>
        <!--giving / is absolute path that will be added directly -->
        <!-- if we give it without / it will be appended to the url  -->
    <a href="?page=1">1</a>
    <% } %>
    <% if (hasPreviousPage) { %>
        <a href="?page=<%= previousPage %>"><%= previousPage %></a> 
    <% } %>
    <a href="?page=<%= currentPage %>" class="active"><%= currentPage %></a>
    <% if (hasNextPage) { %>
        <a href="?page=<%= nextPage %>"><%= nextPage %></a> 
    <% } %> 
    <% if (lastPage !== currentPage && nextPage !== lastPage) { %>
        <a href="?page=<%= lastPage %>"><%= lastPage %></a> 
    <% } %>
</section>
                                                               
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
                    <!--taking absolute path-->
                    <img src="/<%=product.imageUrl %>" alt="<%=product.title %>">
                </div>
                <div class="card__content">
                    <h2 class="product__price">$<%= product.price %></h2>
                    <p class="product__description"><%= product.description %></p>
                </div>
                <div class="card__actions">
                    <% if (isAuthenticated) { %>
                    <%- include('../includes/add-to-cart.ejs',{product: product}) %>
                    <% } %>
                </div>
            </article>
            <% } %>
        </div>
        <%- include('../includes/pagination.ejs',{currentPage: currentPage, nextPage: nextPage, previousPage: previousPage, lastPage: lastPage, hasNextPage: hasNextPage, hasPreviousPage: hasPreviousPage}) %>
        <% } else { %>
            <h1>No Products Found !</h1>
        <% } %>  
    </main>
  <%- include('../includes/end.ejs') %>
          
 //views/shop/orders.ejs
          
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
                    <h1>#<%= order._id %>-<a href="/orders/<%= order._id %>">Invoices</a></h1>
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
            <!--absolute path adding /-->
            <img src="/<%= product.imageUrl %>" alt="<%= product.title %>">
        </div>
        <h2><%= product.price %></h2>
        <p><%= product.description %></p>
        <% if (isAuthenticated) { %>
          <%- include('../includes/add-to-cart.ejs') %>
        <% } %>
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
                    <!--adding absolute path by adding /-->
                    <img src="<%=product.imageUrl %>" alt="<%=product.title %>">
                </div>
                <div class="card__content">
                    <h2 class="product__price">$<%= product.price %></h2>
                    <p class="product__description"><%= product.description %></p>
                </div>
                <div class="card__actions">
                    <a href="/products/<%= product._id %>" class="btn">Details</a>
                    <!--variable in the for loop when sent to another file need to be sent like this it will not be visible directly-->
                    <% if (isAuthenticated) { %>
                      <%- include('../includes/add-to-cart.ejs',{product: product})%>
                    <% } %>
                </div>
            </article>
            <% } %>
        </div>
        <%- include('../includes/pagination.ejs',{currentPage: currentPage, nextPage: nextPage, previousPage: previousPage, lastPage: lastPage, hasNextPage: hasNextPage, hasPreviousPage: hasPreviousPage}) %>
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
      
//views/500.ejs
      
<%- include('./includes/head.ejs') %>
    <link rel="stylesheet" type="text/css" href="/css/main.css">
</head>
<body>
    <%- include('./includes/navigation.ejs') %>
    <h1>Some error occurred!</h1>
    <p>we're working on fixing this, sorry for the inconvenience</p>
  <%- include('./includes/end.ejs') %>
      
//app.js
      

const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const path = require('path');
const shopController = require('./controller/shop');
const flash = require('connect-flash');
const multer = require('multer');

//include session
const session = require('express-session');

//connecting session with mongo db
const MongoDBStore = require('connect-mongodb-session')(session);

const mongoConnect = require('./util/database').mongoConnect;
//const mongoConnect = require('./util/database');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://rahul:Rahulsingh1985@cluster0.wuseu24.mongodb.net/shop?retryWrites=true&w=majority';

//fetching mongodbstore
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'images');
    },
    filename: (req, file, cb) =>{
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
})

const fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null, true);
    }else {
        cb(null, false);
    }
}

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

//db.execute('SELECT * FROM products').then(result => {console.log(result)}).catch(err => { console.log(err);});

app.use(express.static(path.join(__dirname,'public')));

// images are not displayed because images folder is not public-->
//in the network tab when you see it will show localhost:3000/admin/images eror-->
//
app.use('/images',express.static(path.join(__dirname,'images')));


app.use(bodyParser.urlencoded({extended: false}));

//after single it should be the name of the form input <input name="image">
//calling req.file const imageUrl = req.file; will extract info
//will create images folder and inside that the buffer
//app.use(multer({dest:'images'}).single('image'));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));

//session creation
app.use(
    session({secret: 'my secret' , resave: false, saveUninitialized: false, store: store})
);

//flash should be used after initialization of session
app.use(flash());


//saving the req.user so that we can access in admin.js
// we are getting the value of user object
// ie we are having the user object

//this middleware runs on every incoming request
//before our routes handle it

//the data we store here are used our route handler
//in our controller
// app.use((req,res, next)=>{


//});
//it gets triggered for every request
app.use((req, res, next) => {
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id.toString()).then(user => { 
       req.user = new User(user.email,user.password, user.cart, user._id,user.resetToken,user.resetTokenExpiration);
       next();
    }).catch(err => console.log(err));
});



app.use('/admin',adminData.routes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', shopController.get500);


app.use(shopController.get404);

//to run error middleware
//it uses 4 arguments i.e error handling middleware
//if you got more than one error handling middleware
//they will execute from top to bottom, just like
//the normal middleware
//to get this output
//we can call in database then block
//throw new Error('Dummy');

//also if you say throw new Error('Dummy') inside async code
//that is with in then and catch block
//it willl not come here in app.use with error
//it has to be called in synchronous code not with in then
//and catch block
//
//and if we are inside async code that is is inside then and catch block
//in catch use next(new Error(err)) this will bring
//in (error, req, res, next)
//we should use res.render instead of res.redirect()
//res.status(500).render('500',{
//      
//})

app.use((error, req,res, next)=>{
    //res.status(error.httpStatusCode).render(....);
    res.redirect('/500');
})

//client is the value we recieve from mongodb
mongoConnect(() => {
    app.listen(3000);
})
                   
                   
      
              
              
              
