const express = require('express');

const routes = express();

const chat = require('../controller/chat');

routes.post('/message',chat.postMessage);




module.exports =routes;