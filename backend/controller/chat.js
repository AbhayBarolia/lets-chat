const express = require('express');

const User = require('../models/user');

const Chat = require('../models/chat');

const groupUsers = require('../models/groupUseres');

const {Op}= require('sequelize');

require('dotenv').config();

const jwt=require('jsonwebtoken');
const sequelize = require('../database/database');
const secret = process.env.SECRET_KEY;


exports.postMessage= async function (data){
    const transaction = await sequelize.transaction();
    try{
    const token = data.userId;
    const decoded = jwt.verify(token,secret);
    let userId=decoded.userId;
    let groupId= data.groupId;
    const userData= await User.findByPk(userId);
    if(userData){
    let userName= userData.dataValues.userName;    
    let message = data.message;
    let created= await Chat.create({ 
        userId: userId,
        userName: userName,
        message: message,
        groupId:groupId
    },{transaction:transaction});
    if(created)
    {   await transaction.commit();
    }
    else{
        await transaction.rollback();
    }
    }
    else
    {
        await transaction.rollback();
    }
    }
    catch(err){
        console.log(err);
        await transaction.rollback();
    }
};



exports.getMessage= async (req,res,next) =>{
    try{
        const token = req.headers.authorization;
        const decoded = jwt.verify(token,secret);
        let userId=decoded.userId;
        let groupId= req.params.gid;
        const userData= await User.findByPk(userId);
        let userName= userData.dataValues.userName;
        let messages = await Chat.findAll({ 
            where:{groupId:groupId},
            order: [
            ['createdAt' , 'DESC'],
            ],
            attributes: ['userName', 'message','id','groupId'],
            limit:10
                 
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



exports.getNewMessage= async (req,res,next) =>{
    try{
        let id=req.params.id;
        let groupId= req.params.gid;
        const token = req.headers.authorization;
        const decoded = jwt.verify(token,secret);
        userId=decoded.userId;
        const userData= await User.findByPk(userId);
        let userName= userData.dataValues.userName;

        let messages = await Chat.findAll({ 
            where:{
                id :{[Op.gt]:id},
                groupId:groupId
            },
            order: [
            ['createdAt' , 'ASC'],
            ],
            attributes: ['userName', 'message','id','groupId']
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


exports.getAdmin = async (req,res,next)=>{
try{
    let groupId= req.params.gid;
    const token = req.headers.authorization;
    const decoded = jwt.verify(token,secret);
    userId=decoded.userId;
    let admin = await groupUsers.findOne({where: {userId:userId,groupId:groupId}});
    if(admin)
    {
        res.status(200).json({isAdmin: admin.dataValues.isAdmin});
    }
    else
    {
        res.status(500);
    }
}
catch(err){
    res.status(500).json({message:err.message});
}
};