const express = require('express');
const router = express.Router();
const { body } = require('express-validator')


const feedController = require('../controllers/feed');


// GET feed/posts
router.get('/posts', feedController.getPosts)

// POST feed/post
router.post('/post',
    [
        body('title').isLength({ min: 8, max: 100 }).withMessage('Title length should be between 8 and 100.'),
        body('content').isLength({ min: 20, max: 500 }).withMessage('Content length should be between 20 and 500.')
    ],
    feedController.createPost)

router.get('/post/:id', feedController.getPostById)

router.put('/post/:id',
    [
        body('title').isLength({ min: 8, max: 100 }).withMessage('Title length should be between 8 and 100.'),
        body('content').isLength({ min: 20, max: 500 }).withMessage('Content length should be between 20 and 500.')
    ],
    feedController.updatePost
)

router.delete('/post/:id', feedController.deletePost)

module.exports = router