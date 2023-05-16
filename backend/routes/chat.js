const express = require('express');

const routes = express();

const chat = require('../controller/chat');

routes.get('/message',chat.getMessage);
routes.post('/message',chat.postMessage);




module.exports =routes;