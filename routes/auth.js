const express = require('express')
const router = express.Router()
const { body } = require('express-validator')

const User = require('../models/user')
const authController = require('../controllers/auth')


router.post('/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, { req }) =>
            {
                console.log(req)
                User.findOne({ email: value }).then((user) =>
                {
                    if (user)
                    {
                        return new Promise.reject('E-mail already present.')
                    }
                })
                return true
            })
            .normalizeEmail(),
        body('password').isLength({ min: 5 }),
        body('name')
            .not().isEmpty()
    ], authController.signUp

)

router.post('/login',
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .normalizeEmail(),
    body('password').isLength({ min: 5 }),
    authController.signIn)
module.exports = router