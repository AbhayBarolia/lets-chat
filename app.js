const fs= require('fs');
const path= require('path');

const express = require('express');

const bodyParser= require('body-parser');

const cors= require('cors');

const compression = require('compression');


const sequelize= require('./backend/database/database');

const User = require('./backend/models/user');

const Chat= require('./backend/models/chat');


const userRoutes= require('./backend/routes/user');

const chatRoutes= require('./backend/routes/chat');

require('dotenv').config();

const app= express();
app.use(cors({origin:"http://localhost:3000"}));
app.use(bodyParser.json({ extended:false }));




app.use('/user',userRoutes);

app.use('/chat',chatRoutes);

app.use((req,res)=>{
    const newPath=path.join(__dirname,`./frontend/${req.url}`);
    res.sendFile(newPath);
});


Chat.belongsTo(User, {constraints:true, onDelete: 'cascade'});
User.hasMany(Chat);


sequelize.sync()
.then((results)=>{
    app.listen(process.env.PORT || 3000);
})
.catch((err)=>{console.log(err);});
