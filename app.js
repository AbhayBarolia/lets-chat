const fs= require('fs');
const path= require('path');

const express = require('express');

const bodyParser= require('body-parser');

const cors= require('cors');


const compression = require('compression');

const sequelize= require('./backend/database/database');

const userRoutes= require('./backend/routes/user');

require('dotenv').config();

const app= express();
app.use(cors());
app.use(bodyParser.json({ extended:false }));

const User = require('./backend/models/user');




app.use('/user',userRoutes);



app.use((req,res)=>{
    const newPath=path.join(__dirname,`./frontend/${req.url}`);
    res.sendFile(newPath);
});



sequelize.sync()
.then((results)=>{
    app.listen(process.env.PORT || 3000);
})
.catch((err)=>{console.log(err);});
