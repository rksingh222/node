//models/product.js
empty this and add new code
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

//docs.sequelizejs.com gives you info- in model definition
//model name will be product
const Product = sequelize.define('product',{
  id(javascript object):{
     type: Sequelize.INTEGER,
     autoIncrement: true,
     allowNull: false,
     primaryKey: true,
   },
   title: Sequelize.STRING,
   price: {
     type: Sequelize.DOUBLE,  
     allowNull: false,                           
   },
  imageNull: {
     type: Sequelize.STRING,
     allowNull: false,
   },
   description: {
     type: Sequelize.STRING,
     allowNull: false,
   }
});

module.exports = Product;
