const express = require('express');

const routes = express();

const chat = require('../controller/chat');

routes.get('/message/:gid/:id',chat.getNewMessage);

routes.get('/message/:gid',chat.getMessage);

routes.get('/admin/:gid',chat.getAdmin);

routes.post('/message/:gid',chat.postMessage);





module.exports =routes;