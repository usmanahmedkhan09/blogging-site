const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const user = require('../models/user');

exports.signUp = (req, res, next) =>
{

    const errors = validationResult(req)
    if (!errors.isEmpty())
    {
        let error = new Error('Validation failed.')
        error.status = 422
        throw error
    }

    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    bcrypt.hash(password, 12).then((hashPassword) =>
    {
        const user = new User({
            name: name,
            email: email,
            password: hashPassword,
        })
        return user.save()
    })
        .then((user) =>
        {
            res.status(201).json({ message: 'User successfully created', user: user })
        })
        .catch((err) =>
        {
            if (!err.status)
            {
                err.status = 500
                err.data = errors.array()
            }
            next(err)
        })


}

exports.signIn = (req, res, next) =>
{
    const errors = validationResult(req)
    if (!errors.isEmpty())
    {
        let error = new Error('please enter valid email and password')
        error.status = 422
        throw error
    }

    const email = req.body.email
    const password = req.body.password
    let loggedInUser;
    User.findOne({ email: email })
        .then((user) =>
        {
            if (!user)
            {
                let error = new Error('Could not found a user with this email.')
                error.status = 401
                throw error
            }
            loggedInUser = user
            return bcrypt.compare(password, user.password)
        }).then((isEqual) =>
        {
            if (!isEqual)
            {
                let error = new Error('Password in wrong')
                error.status = 401
                throw error
            }

            const token = jwt.sign({ email: loggedInUser.email, id: loggedInUser._id.toString() }, 'privateKey', { expiresIn: '1h' })
            loggedInUser.token = token
            console.log(loggedInUser)
            res.status(201).json({ message: 'Successfully login', user: loggedInUser })
        })
        .catch((err) =>
        {
            if (!err.status)
            {
                err.status = 500
                err.data = errors.array()
            }
            next(err)
        })
}