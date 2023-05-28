const express = require('express');

const User = require('../models/user');

const Chat = require('../models/chat');

const Group = require('../models/group');

const groupUsers = require('../models/groupUseres');

const {Op}= require('sequelize');

require('dotenv').config();

const jwt=require('jsonwebtoken');
const sequelize = require('../database/database');
const secret = process.env.SECRET_KEY;



exports.createGroup= async function(req,res,next){
    const transaction = await sequelize.transaction();
    try{
        const token = req.headers.authorization;
        const decoded = jwt.verify(token,secret);
        let userId=decoded.userId;
        let groupName= req.body.groupName;
        let groupCreated= await Group.create({
            groupName: groupName,
            createdby:userId
        },{transaction:transaction});
        
        if(groupCreated){
            
            let added = await groupUsers.create({
                groupId:groupCreated.dataValues.id,
                groupName:groupName,
                userId:userId,
                isAdmin:true
            },{transaction:transaction});
            if(added){
                await transaction.commit();
                res.status(200).json({groupCreated});
            }
            else
            {
                await transaction.rollback();
                res.status(500).json({message: err.message});
            }
        }
        else
        {
            await transaction.rollback();
            res.status(500).json({message: err.message});
        }
    }
    catch(err){
        await transaction.rollback();
        res.status(500).json({message: err.message});
    }

};



exports.getGrouplist = async function(req,res,next){
    try{
        const token = req.headers.authorization;
        const decoded = jwt.verify(token,secret);
        let userId=decoded.userId;
        let groupList = await groupUsers.findAll({where:{userId:userId}, attributes: ['groupId', 'groupName','isAdmin']});
        if(groupList)
        {  
            res.status(200).json(groupList);
            
        }
        else{
            res.status(500).json({message: err.message});
        }
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}