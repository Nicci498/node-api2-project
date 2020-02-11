const express = require('express');

const Data = require('./data/db.js');

const router = express.Router();

// /api/posts

router.post('/', (req, res) =>{
    const { title, contents } = req.body;
    if(!title || !contents){
        res.status(400).json({errorMessage: "Please provide title and contents for the post."})
    } else{
        Data.insert(req.body)
        .then(data =>{
            res.status(200).json(data)
        })
        .catch(err =>{
            res.status(500).json({errorMessage: "There was an error while saving the post to the database"})
        })
    }
})


module.exports = router;

