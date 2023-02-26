const { validationResult } = require('express-validator');


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


}