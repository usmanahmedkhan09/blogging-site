const { validationResult } = require('express-validator')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')


const Post = require('../models/feed')
const User = require('../models/user')
const socket = require('../socket')

exports.getPosts = (req, res, next) =>
{
    const currentPage = req.query.page ?? 1
    const itemsPerPage = 2
    let totalItems;

    Post.find()
        .countDocuments()
        .then((count) =>
        {
            totalItems = count
            return Post.find().skip((currentPage - 1) * itemsPerPage).limit(itemsPerPage)
        }).then((posts) =>
        {
            return res.status(200).send({
                message: 'Posts found successfully',
                posts: posts,
                totalItems: totalItems
            })
        })
        .catch((error) =>
        {
            if (!error.status)
            {
                error.status = 500
            }
            next(err)
        })

}

exports.createPost = (req, res, next) =>
{
    const image = req.file
    if (!image)
    {
        let error = new Error('image is not attached.')
        error.status = 422
        throw error
    }
    const title = req.body.title
    const content = req.body.content
    const imageUrl = image.path
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
        creator: req.userId,
    })

    let creator;
    post.save().then((result) =>
    {
        return User.findById(req.userId)
    })
        .then((user) =>
        {
            if (!user)
            {
                let error = new Error('user not found.')
                error.status = 401
                throw error
            }
            user.posts.push(post)
            creator = user
            return user.save()
        }).then(() =>
        {
            socket.getIO().emit('post', { action: 'create', post: creator.posts })
            return res.status(201).json({
                message: 'Post Created Successfully',
                post: post
            })
        })
        .catch((err) =>
        {
            if (!err.status)
            {
                err.status = 500
            }
            next(err)
        })

}

exports.getPostById = (req, res, next) =>
{

    const postId = req.params.id
    Post.findById({ _id: postId.toString() }).then((post) =>
    {
        if (!post)
        {
            let error = new Error('Post not found.')
            error.status = 422
            throw error
        }
        return res.status(200).json({
            message: 'Post found successfully',
            post: post
        })
    }).catch((err) =>
    {
        if (!err.status)
        {
            err.status = 500
        }
        next(err)
    })
}

exports.updatePost = (req, res, next) =>
{
    const postId = req.params.id
    const errors = validationResult(req)
    if (!errors.isEmpty())
    {
        let error = new Error('validation failed, data is in incorrect from.')
        error.status = 422
        throw error
    }

    const postTitle = req.body.title
    const postContent = req.body.content
    let imageUrl = req.body.image
    if (req.file)
    {
        imageUrl = req.file.path
    }

    if (!imageUrl)
    {
        let error = new Error('Image not found.')
        error.status = 422
        throw error
    }

    Post.findById(postId).then((post) =>
    {
        if (post.creator.toString() != req.userId)
        {
            let error = new Error('Not Authorized')
            error.status = 403
            throw error
        }
        post.title = postTitle,
            post.content = postContent,
            post.imageUrl = imageUrl
        return post.save()

    })
        .then((result) =>
        {
            res.status(200).json({
                message: 'Successfully updated',
                post: result
            })
        })
        .catch((err) =>
        {
            if (!err.status)
            {
                err.status = 500
            }
            next(err)
        })

}

exports.deletePost = (req, res, next) =>
{
    const postId = req.params.id
    const errors = validationResult(req)
    if (!errors.isEmpty())
    {
        let error = new Error('Post id is not found')
        error.status = 422
        throw error
    }

    let deletedPost;
    Post.findById(postId)
        .then((post) =>
        {
            if (!post)
            {
                let error = new Error('Post not found')
                error.status = 404
                throw error
            }
            if (post.creator.toString() != req.userId)
            {
                let error = new Error('Not Authorized')
                error.status = 403
                throw error
            }
            deletedPost = post
            ulinkPostImage(post.imageUrl)
            return Post.findByIdAndRemove(post._id)
        }).then((result) =>
        {
            return User.findById(req.userId)
        })
        .then((user) =>
        {
            user.posts.pull(postId)
            return user.save()
        })
        .then(() =>
        {
            res.status(200).json({ message: 'Successfully deleted', post: deletedPost })
        })
        .catch((err) =>
        {
            if (!err.status)
            {
                err.status = 500
            }
            next(err)
        })


}


const ulinkPostImage = (imagePath) =>
{
    imagePath = path.join(__dirname, '..', imagePath)
    fs.unlink(imagePath, (err) =>    
    {
        if (err)
        {
            console.log(err)
        }
    })
}