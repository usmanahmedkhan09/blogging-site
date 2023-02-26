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
            .customSanitizer(({ val: { req } }) =>
            {
                User.findOne({ email: val }).then((user) =>
                {
                    if (user)
                    {
                        return new Promise.reject('E-mail already present.')
                    }
                })
            })
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({ min: 8 }),
        body('name')
            .not().isEmpty()
    ], authController.signUp

)

module.exports = router