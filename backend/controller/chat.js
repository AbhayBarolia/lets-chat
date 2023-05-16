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
    const message = req.body.message;
    const created= await Chat.create({ 
        userId: userId,
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
    catch(err){
        await transaction.rollback();
        res.status(500).json({message: err.message});
    }
};