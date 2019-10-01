const express = require('express');

const Posts = require('./db.js');

const router = express.Router();

router.post('/', (req, res) => {
    const postData = req.body;

    if(!postData.title || !postData.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        Posts
        .insert(postData)
        .then(post => {
            res.status(201).json(post)
        })
        .catch(err => {
            res.status(500).json({ error: "There was an error while saving the post to the database" })
        })
    };
});

router.post('/:id/comments', (req, res) => {
    const id = req.params.id;
    const commData = {
        text: req.body.text,
        post_id: req.params.id
    };

    Posts.findById(id)
    .then(id => {
        if(id.length === 0) {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        } else {
            if(!commData.text) {
                res.status(400).json({ errorMessage: "Please provide text for the comment." });
            } else {
                Posts.insertComment(commData)
                .then(comment => {
                    res.status(201).json(commData);
                })
                .catch(err => {
                    res.status(500).json({ error: "There was an error while saving the comment to the database" })
                })
            }
        }
    })
    
});

router.get('/', (req, res) => {
    Posts.find()
    .then(posts => {
        res.json(posts);
    })
    .catch(err => {
        res.status(500).json({ error: "The posts information could not be retrieved." })
    })
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    console.log(id)

    Posts.findById(id)
    .then(post => {
        if(post.length === 0) {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else {

            res.json(post)            
        }
    })
    .catch (err => {
        res.status(500).json({ error: "The post information could not be retrieved." })
    })
});

router.get('/:id/comments', (req, res) => {
    const id = req.params.id

    Posts.findPostComments(id)
    .then(post => {
        if(post.length === 0) {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else {
            res.json(post)
        }
    })
    .catch(err => {
        res.status(500).json("The comments information could not be retrieved.")
    })
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;

    Posts.remove(id)
    .then(post => {
        if(!post) {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
            
        } else {

            res.json({message: "The post has been removed"})
            
        }
    })
    .catch(err => {
        res.status(500).json({ error: "The post could not be removed" })
    })
});

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const updatedPost = req.body;

    if(!updatedPost.title || !updatedPost.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        Posts.update(id, updatedPost)
        .then(post => {
            if(post) {
                Posts.findById(id)
                .then(upPost => {
                    res.status(200).json(upPost)
                })
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(400).json({ error: "The post information could not be modified." })
        })
    }

})




module.exports = router;