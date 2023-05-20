const express = require('express');

const routes = express();

const Group = require('../controller/group');


routes.post('/create',Group.createGroup);

routes.get('/grouplist',Group.getGrouplist);




module.exports =routes;