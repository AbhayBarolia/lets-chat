const Sequelize = require('sequelize');
const sequelize = require('../database/database');



const GroupUsers = sequelize.define('groupusers',{
  groupId:{
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  groupName:{
    type: Sequelize.STRING,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  isAdmin:{
    type: Sequelize.BOOLEAN,
    allowNull:false
  }
 
});

module.exports= GroupUsers;