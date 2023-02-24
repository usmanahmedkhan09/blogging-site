const { validationResult } = require('express-validator')

const Post = require('../models/feed')

exports.getPosts = (req, res, next) =>
{
    // res.status(200).send({
    //     message: 'posts',
    //     posts: [{
    //         _id: new Date().toISOString(), title: 'learning core concept of js', content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been'
    //     }]
    // })

}

exports.createPost = async (req, res, next) =>
{
    const title = req.body.title
    const content = req.body.content
    const imageUrl = req.body.imageUrl
    const errors = validationResult(req)
    if (!errors.isEmpty())
    {
        let error = new Error('validation failed, data is in incorrect from.')
        error.status = 422
        throw error
    }
    const post = new Post({
        title: title,
        imageUrl: imageUrl,
        content: content,
        creator: { name: 'usman' },
    })
    post.save().then((result) =>
    {
        return res.status(201).json({
            message: 'Post Created Successfully',
            post: result
        })
    }).catch((err) =>
    {
        if (!err.status)
        {
            error.status = 500
        }
        next(err)
    })

}