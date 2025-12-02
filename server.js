// import express module..
const express = require('express');
const cors = require('cors');
const prismaRouter = require('./routes/prisma-routes');
const bodyParser = require('body-parser');
const config = require('./config/server-config');
const path = require('path');

// dotenv configured
require('dotenv').config();

// create express server and PORT
const server = express();
const PORT = config.ports.server_port || 5001;

// 1. Core Middleware
server.use(cors());
server.use(bodyParser.json());
server.use('/prisma', prismaRouter); // Prisma routes (accessible at /prisma/api/...)

// Client build serving removed - API server only
// Uncomment below if you add a client build directory:
// server.use(express.static(path.join(__dirname, '../client/build')));
// server.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
// });

server.listen(PORT, () => {
    console.log(`[Server] HTTP Server listening on port ${PORT}`);
});