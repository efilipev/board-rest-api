const { MainController, UserController, ItemsController } = require('../src/constrollers');
const bodyParser = require('body-parser');
const express = require('express');

const server = express();

server.use( bodyParser.urlencoded({extended: true}));
server.use( bodyParser.json());
server.use( MainController );
server.use( UserController );
server.use( ItemsController );
server.listen( process.env.port || 3000 );

module.exports = server;
