const fs= require('fs');
const path= require('path');

const express = require('express');

const socketIo = require('socket.io');

const bodyParser= require('body-parser');

const cors= require('cors');

const compression = require('compression');


const sequelize= require('./backend/database/database');

const User = require('./backend/models/user');

const Chat= require('./backend/models/chat');


const userRoutes= require('./backend/routes/user');

const chatRoutes= require('./backend/routes/chat');

const groupRoutes= require('./backend/routes/group');

const groupSettingRoutes= require('./backend/routes/groupsettings');

const newMessage = require('./backend/controller/chat');

const getUserName = require('./backend/controller/user');


require('dotenv').config();

const app= express();
app.use(cors({origin:"http://localhost:3000"}));
app.use(bodyParser.json({ extended:false }));


sequelize.sync()
.then(async(results)=>{
    var io =socketIo(app.listen(process.env.PORT || 3000));
    io.on("connection",socket=>{
        console.log(socket.id);

        socket.on("disconnect",()=>{
            console.log("disconnected");
        });

        socket.on("new message",async(data)=>{
            socket.join(data.groupId);
            newMessage.postMessage(data);
            let userName= await getUserName.userName(data.userId);
            let obj={userName:userName,
            message:data.message};
            socket.to(data.groupId).emit("emit message",obj.message);
        });
        socket.on('image', async image => {
            const buffer = Buffer.from(image);
            socket.emit('image', image.toString('base64'));
        });
        
    });
})
.catch((err)=>{console.log(err);});


app.use('/user',userRoutes);

app.use('/chat',chatRoutes);

app.use('/group',groupRoutes);

app.use('/groupsettings',groupSettingRoutes);

app.use((req,res)=>{
    const newPath=path.join(__dirname,`./frontend/${req.url}`);
    res.sendFile(newPath);
});


Chat.belongsTo(User, {constraints:true, onDelete: 'cascade'});
User.hasMany(Chat);


