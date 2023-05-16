const Sequelize = require('sequelize');
const sequelize = require('../database/database');



const chat = sequelize.define('chat',{
  id:{
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  userName:{
    type: Sequelize.STRING,
    allowNull:false
  },
  message:{
    type: Sequelize.STRING,
    allowNull:false
  }
 
});

module.exports= chat;