//app.js 
            
      const sequelize = require('./util/database');      
    // the model you defined in previous code 63 using sequelize.define it converts them into table
      sequelize.sync().then(result =>{
        console.log(result);
        //start the server once you create database
        app.listen(3000);
      }).catch(err =>{
        console.log(err);
      })
