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
}); //all checks pass

router.get('/', (req, res) =>{
    Data.find()
    .then(data => {
        res.status(200).json(data)
    })
    .catch(err =>{
        res.status(500).json({error: "The posts information could not be retrieved."})
    })
}) //displays

router.get('/:id', (req,res) =>{
    const { id } = req.params;
    Data.findById(id)
    .then(post =>{
        if (post.length > 0){
            res.status(200).json({post})
        } else{
            res.status(500).json({errorMessage:'No post by that id'})
        }
    })
    .catch(err =>{
        res.status(500).json({errorMessage:'Cannot get post'})
    })
})

router.get('/:id/comments', (req, res) =>{
    const {id} = req.params;  
    Data.findById(id)
    .then(post =>{
        if(post.length === 0){
            res.status(404).json({errorMessage:'post does not exist'})
        } else{
        Data.findPostComments(id)
            .then(comments => {       
                res.status(200).json(comments);  
            })
            .catch(err => {
                res.status(500).json({errorMessage:'Sorry we couldnt get those comments for you'});
            })
        }
        })
    .catch(err =>{
        res.status(500).json({errorMessage:'nope'})
    })

}) //working

router.delete('/:id', (req, res) =>{
    const {id} = req.params;
    Data.findById(id)
    .then(post =>{
        if(post.length === 0){
            res.status(404).json({errorMessage:'post does not exist'})//not showing
        } else{
            Data.remove(id)
            .then(data =>{     
                    res.status(200).json({message:'Delete successful'})                
            })
            .catch(err =>{
                res.status(500).json({errorMessage:'Post could not be removed'})
            })
        }        
    })
    .catch(err =>{
        res.status(500).json({errorMessage:'Post could not be found'})
    })

}) //working

router.put('/:id', (req, res) => {
    const {id} = req.params;
    const { title, contents } = req.body;
    if(!title || !contents){
        res.status(400).json({errorMessage:'Post must conatin a title and contents'})
    } else{
        Data.findById(id)
        .then(post =>{
            Data.update(id, req.body)
            .then(data =>{
                if(post.length === 0){
                    res.status(404).json({message: "The post with the specified ID does not exist." })//returns a 0 but not a 404, skips to 200
                } else{
                    res.status(200).json(data)
                }
            })
            .catch(err =>{
                res.status(500).json({error: "The post information could not be modified."})
            })
        })
        .catch(err =>{
            res.status(500).json({errorMessage:'Post does not exist'})
        })

    }
}) //working

router.post('/:id/comments', (req, res) =>{
    const { id } = req.params;
    const comment = {...req.body, post_id: id};
    const { text } = req.body;
    if(!text){
        res.status(400).json({errorMessage: "Please provide text for the comment."})
    } else{
        Data.findById(id)
        .then(post =>{
            if(post.length === 0){
                res.status(404).json({errorMessage:'No post by that id'})
            }else{
                Data.insertComment(comment)
                .then(data =>{
                    res.status(201).json(data);
                })
                .catch(err =>{
                    res.status(500).json({errorMessage:'PUT is broken'})
                })
            }
        })
        .catch(err =>{
            res.status(500).json({errorMessage:'cannot add comment'})
        })

    }
}); //working


module.exports = router;

