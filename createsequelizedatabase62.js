npm install --save mysql2
we need to have mysql2 before installing sequelize
npm install --save sequelize

util//database.js
const Sequelize = require('sequelize');
const sequelize = new Sequelize('node-complete'(database name),'root'(username),'nodecomplete'(password),{dialect: 'mysql'(which type of lang),host:'localhost'});

module.exports = sequelize;
