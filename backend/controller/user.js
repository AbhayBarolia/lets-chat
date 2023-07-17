const express = require('express');

const {v4 : uuidv4} = require('uuid');

require('dotenv').config();

const User = require('../models/user');

const pcr= require('../models/passwordChangeRequest');


const jwt= require('jsonwebtoken');

const secret =process.env.SECRET_KEY;

const bcrypt = require('bcrypt');
const sequelize = require('../database/database');
const saltRounds=10;


exports.getSignupRequest= async (req, res, next) => {
    res.status(201).redirect('/signup.html');
}

exports.userSignup= async function (req,res,next){
    const transaction= await sequelize.transaction();
    try{
        const email = req.body.email;
        const mnumber = req.body.mnumber;
        const userName = req.body.username;
        const password = req.body.password;
        const alreadyExists = await User.findOne({ where: { email:email } });
        const alreadyExists1 = await User.findOne({ where: { mnumber:mnumber } });
        if(alreadyExists1!=null  && alreadyExists1.dataValues.mnumber == mnumber){
            return res.status(201).json({ message: 'User already exists' });
        }
        else if(alreadyExists!=null  && alreadyExists.dataValues.email == email){
            return res.status(201).json({ message: 'User already exists' });
        }
        else
        {
    
             bcrypt.hash(password, saltRounds, async (err,hash) => {
                if(err) 
                {console.log(err);}
                else
                {
                    const created= await User.create({ 
                        email: email,
                        userName: userName,
                        mnumber: mnumber,
                        password: hash
                    });

                    if(created){
                        return res.status(201).json({ message: 'User created' });
                    }
                    else{
                        await transaction.rollback();
                        return res.status(500).json({ message: 'User not created' });
                    }    
                }
            });
    
        }
    }catch(err){
        await transaction.rollback();
        return res.status(500).json({ message: 'User not created' });
    }
}


exports.getLoginRequest= async function(req,res,next){
    res.status(201).redirect('/frontend/login/login.html');
}


exports.userLogin = async function (req,res,next) {
    try{
        
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({ where: { email:email } });
        if(user!=null) 
        {   bcrypt.compare(password, user.dataValues.password,async (err, resolve)=>{
            if(err)
            {
                res.status(400).json({ message: 'Something went wrong' });
            }
            else if(resolve)
            {
                const payload = {
                    userId: user.dataValues.id,
                  };
                
                const token = jwt.sign(payload, secret);
                 

                res.status(200).json({ message: 'User logged in', token:token});
            }
            else
            {
                res.status(201).json({ message: 'Incorrect password' });
            }
        });
    }
        else{
            res.status(201).json({ message: 'incorrect email' });
        }
    }
    catch(err){
        return res.status(500).json({ message: 'User not loggedin' });
    }
}




exports.resetPasswordRequest = async function (req,res,next){
    const transaction= await sequelize.transaction();
    try{
    const email = req.body.email;
    const uuid = uuidv4();
    const user = await User.findOne({ where: { email:email } });
    const userId = user.dataValues.id;
    const requestAdded= await pcr.create(
        {
            uuid: uuid,
            userId: userId,
            isActive:true
        },{transaction:transaction});
     if(requestAdded){
        await transaction.commit();
     }   
     else{
        await transaction.rollback();
        return res.status(500).json({ message: 'Something went wrong' });
     }

    const client = sib.ApiClient.instance;
    const apiKey = client.authentications['api-key'];
    apiKey.apiKey = process.env.RESETPASSWORD_API_KEY;
    
    const transEmailApi = new sib.TransactionalEmailsApi();

    const sender={email:'abhay28barolia@gmail.com'};

    const receivers=[{email:email},];

    const emailSent=await transEmailApi.sendTransacEmail({
        sender,
        to:receivers,
        subject:'Reset Password',
        textContent:'Please click on the link below to reset your password',
        htmlContent:`<a id=${email} href=http://18.119.162.42/:3000/user/resetpassword/${uuid}>Reset Password</a>`
    });
    if(emailSent){
        res.status(200).json({message:'Reset password mail sent, please click on the link in mail to reset your password'});
    }
    else{
        res.status(500).json({message:'Something went wrong'});
    }
    
    
 }
 catch(err){
    return res.status(500).json({ message: 'Please try again' });
 }   
}



exports.getNewPasswordRequest= async function (req,res,next){
    try{
        const uuid = req.params.uuid;
        const request = await pcr.findByPk(uuid);
        if(request && request.dataValues.isActive==true){
            return res.status(200).redirect('http://localhost:3000/resetpassword/resetpassword.html');
        }
        else{
            return res.status(500).json({message:'Request expired, please try again'});
        }
    }
    catch(err){
        return res.status(500).json({ message: 'Please try again' });
    }
}


exports.newPasswordRequest= async function (req,res,next){
    const transaction = await sequelize.transaction();

    try{
        const email = req.body.email;
        const password= req.body.password;
        const user = await User.findOne({ where: { email:email } });
        const userId = user.dataValues.id;
        const changeRequest = await pcr.findOne({where:{userId:userId,isActive:true}});
        if(changeRequest){
          
        bcrypt.hash(password, saltRounds, async (err,hash) => {
            if(err) 
            { return res.status(500).json({ message: 'Please try again' }); }

            else{
                const updated= await user.update({ password:hash },{transaction:transaction});
                await user.save();
                if(updated)
                {
                    const updateChangeRequest= await changeRequest.update({isActive:false},{transaction:transaction});
                    if(updateChangeRequest){
                        await transaction.commit();
                    res.status(200).json({ message: 'Password updated, please login' });
                    }
                    else{
                        await transaction.rollback();
                        return res.status(500).json({ message: 'Something went wrong' });
                    }
                }
                else
                {   
                    await transaction.rollback();
                    res.status(500).json({ message: 'Something went wrong' });
                    
                }
                   
            }
          }

    )
        }
        else
                {   
                    await transaction.rollback();
                    res.status(201).json({ message: 'Email Id does not match' });
                }
}
    catch(err){ 
        await transaction.rollback();
        return res.status(500).json({ message: 'Please try again' });
    }
}

exports.userName = async function (data){
    try{
        const token = data;
        const decoded = jwt.verify(token,secret);
        let userId=decoded.userId;
        const userData= await User.findByPk(userId);
        if(userData){
        return userData.userName;}
    }
    catch(err){
        console.log(err);
    }
}