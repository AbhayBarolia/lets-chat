const express = require('express');

const User = require('../models/user');

const Chat = require('../models/chat');

require('dotenv').config();

const jwt=require('jsonwebtoken');
const sequelize = require('../database/database');
const secret = process.env.SECRET_KEY;


exports.postMessage= async function (req, res, next){
    const transaction = await sequelize.transaction();
    try{
    const token = req.headers.authorization;
    const decoded = jwt.verify(token,secret);
    userId=decoded.userId;
    const userData= await User.findByPk(userId);
    if(userData){
    let userName= userData.dataValues.userName;    
    let message = req.body.message;
    let created= await Chat.create({ 
        userId: userId,
        userName: userName,
        message: message
    },{transaction:transaction});
    if(created)
    {   await transaction.commit();
        return res.status(201).json({ message: 'message logged'});
    }
    else{
        await transaction.rollback();
        return res.status(500).json({ message: 'message not logged'}); 
    }
    }
    else
    {
        return res.status(500).json({ message: 'message not logged'}); 
    }
    }
    catch(err){
        await transaction.rollback();
        res.status(500).json({message: err.message});
    }
};


exports.getMessage= async (req,res,next) =>{
    try{
        const token = req.headers.authorization;
        const decoded = jwt.verify(token,secret);
        userId=decoded.userId;
        const userData= await User.findByPk(userId);
        let userName= userData.dataValues.userName;

        let messages = await Chat.findAll({ 
            order: [
            ['createdAt' , 'ASC'],
            ],
            attributes: ['userName', 'message']
        });
    if(messages){
     for(let i =0;i<messages.length;i++){
        if(messages[i].dataValues.userName==userName)
        {
            messages[i].dataValues.userName="You";
        }
    }
    res.status(200).json({messages});
    }
    }
    catch(err){
        
        res.status(500).json({message: err.message});
    }
    
}