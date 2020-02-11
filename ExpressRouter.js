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
});

router.get('/', (req, res) =>{
    Data.find()
    .then(data => {
        res.status(200).json(data)
    })
    .catch(err =>{
        res.status(500).json({error: "The posts information could not be retrieved."})
    })
})

router.get('/:id/comments', (req, res) =>{
    const {id} = req.params;
    Data.findCommentById(id)
    .then(comments => {
        if(!id){
            res.status(404).json({message:'No post with that ID located'})
        }else{
             res.status(200).json(comments)
        }       
    })
    .catch(err => {
        res.status(500).json({errorMessage:'Sorry we couldnt get those comments for you'})
    })
})

// router.post('/:id/comments', (req, res) =>{
//     const { id } = req.params;
//     const { text } = req.body;
//     if(!text){
//         res.status(400).json({errorMessage: "Please provide text for the comment."})
//     } else{
//         Data.insertComment(id, req.body)
//         .then(data =>{
//             if(!data){
//                 res.status(404).json({message: "The post with the specified ID does not exist."})
//             } else{
//                 res.status(200).json(data)
//             }
//         })
//         .catch(err =>{
//             res.status(500).json({})
//         })
//     }
// }); //sending 500


module.exports = router;

