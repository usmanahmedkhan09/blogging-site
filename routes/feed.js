const express = require('express');
const router = express.Router();
const { body } = require('express-validator')


const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth')


// GET feed/posts
router.get('/posts', isAuth, feedController.getPosts)

// POST feed/post
router.post('/post', isAuth,
    [
        body('title').isLength({ min: 8, max: 100 }).withMessage('Title length should be between 8 and 100.'),
        body('content').isLength({ min: 20, max: 500 }).withMessage('Content length should be between 20 and 500.')
    ],
    feedController.createPost)

router.get('/post/:id', isAuth, feedController.getPostById)

router.put('/post/:id', isAuth,
    [
        body('title').isLength({ min: 8, max: 100 }).withMessage('Title length should be between 8 and 100.'),
        body('content').isLength({ min: 20, max: 500 }).withMessage('Content length should be between 20 and 500.')
    ],
    feedController.updatePost
)

router.delete('/post/:id', isAuth, feedController.deletePost)

module.exports = router