const Sequelize = require('sequelize');
const sequelize = require('../database/database');



const User = sequelize.define('user',{
  id:{
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  
  mnumber:{
    type: Sequelize.BIGINT,
    allowNull: false,
    unique: true
  },

  userName:{
    type:Sequelize.STRING,
    allowNull:false
  },
  password:{
    type: Sequelize.STRING,
    allowNull:false
  }
 
});

module.exports= User;