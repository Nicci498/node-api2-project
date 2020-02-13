const express = require('express');
require('dotenv').config();

const expressRouter = require("./ExpressRouter.js"); // << added

const server = express();

server.use(express.json());

// for URLs beginning with /api/posts
server.use("/api/posts", expressRouter);

const port = process.env.PORT || 5000;
server.listen(port, () =>{
    console.log(`Sever running on port ${port}`);
});