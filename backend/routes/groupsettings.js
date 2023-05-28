const express = require('express');

const routes = express();

const gs = require('../controller/groupsettings');

routes.get('/members/:gid',gs.getMembers);

routes.post('/addmember/:gid',gs.addMember);

routes.delete('/deletemember/:gid/:mno',gs.deleteMember);

routes.put('/makeadmin/:gid/:mno',gs.makeAdmin);


module.exports =routes;