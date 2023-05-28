const express = require('express');

const User = require('../models/user');

const Chat = require('../models/chat');

const groupUsers = require('../models/groupUseres');

const groups = require('../models/group');

const {Op}= require('sequelize');

require('dotenv').config();

const jwt=require('jsonwebtoken');
const sequelize = require('../database/database');
const GroupUsers = require('../models/groupUseres');
const secret = process.env.SECRET_KEY;


exports.getMembers= async (req, res, next) => {
    try{
        let groupId= req.params.gid;
        let userIds=await groupUsers.findAll({where:{groupId:groupId}, attributes:['userId']});
        if(userIds)
        {   let userArray = new Array(userIds.length);
            for(let i=0;i<userIds.length;i++)
            {
                userArray[i]=userIds[i].dataValues.userId; 
            }
            let userData = await User.findAll({where:{id:userArray}, attributes:['userName','mnumber']});
            if(userData){
            res.status(200).json({userData});
            }
        }
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};


exports.addMember = async (req, res,next)=>{
    const transaction = await sequelize.transaction();
    try{
        let groupId= req.params.gid;
        let mnumber = req.body.mnumber;
        let user = await User.findOne({where:{mnumber:mnumber}});
        if(user){
            let group = await groups.findByPk(groupId);
            if(group){
                groupName = group.dataValues.groupName;
                let ifExists= await GroupUsers.findOne({where:{groupId:groupId, userId:user.dataValues.id}});
                if(ifExists!=null)
                {
                    res.status(201).json({message:"User already added"});
                }
                else{
                    let userAdded= await groupUsers.create({
                        groupId:groupId,
                        groupName:groupName,
                        userId:user.dataValues.id,
                        isAdmin:false
                    },{transaction:transaction});
                    if(userAdded){
                        transaction.commit();
                        let userData = `${user.dataValues.userName}   ${user.dataValues.mnumber}`;
                        res.status(200).json({userData:userData});
                    }
                }
              
            }
            else{
                transaction.rollback();
                res.status(404).json({message:"Something went wrong, please try again."});
            }
        }
        else{
            res.status(404).json({message:"User doesn't exist, please invite them to Lets Chat"});
        }
    }
    catch(err){
        transaction.rollback();
        res.status(500).json({message:err.message});
    }
}


exports.deleteMember = async (req,res, next)=>{
    const transaction = await sequelize.transaction();
    try{
        let groupId = req.params.gid;
        let mnumber = req.params.mno;
        let user = await User.findOne({where:{mnumber:mnumber}});
        if(user){
            let userId= user.dataValues.id;
            let userRemoved= await groupUsers.destroy({where:{userId:userId, groupId:groupId}},{transaction:transaction});
            if(userRemoved){
                transaction.commit();
                res.status(200).json({message:"success"});
            }    
        }
    }
    catch(err){
        transaction.rollback();
        res.status(500).json({message:err.message});
    }       
}



exports.makeAdmin = async (req,res, next)=>{
    const transaction = await sequelize.transaction();
    try{
        let groupId = req.params.gid;
        let mnumber = req.params.mno;
        let user = await User.findOne({where:{mnumber:mnumber}});
        if(user){
            let userId= user.dataValues.id;
            let ifExists = await groupUsers.findOne({where:{userId:userId, groupId:groupId, isAdmin:true}});
            if(ifExists!=null)
            {
                res.status(201).json({message:"User is already Admin"});
            }
            else
            {
                let adminAdded= await groupUsers.update({isAdmin:true},{where:{userId:userId, groupId:groupId}},{transaction:transaction});
                if(adminAdded){
                    transaction.commit();
                    res.status(200).json({message:"success"});
                }    
            }
           
        }
    }
    catch(err){
        transaction.rollback();
        res.status(500).json({message:err.message});
    }       
}

