const jwt = require('jsonwebtoken')

module.exports = (req, res, next) =>
{
    const authHeader = req.get('Authorization')
    if (!authHeader)
    {
        const error = new Error('Not Authenticated')
        error.status = 401
        throw error
    }
    let decodeToken;
    const token = authHeader.split(" ")[1]
    try
    {
        decodeToken = jwt.verify(token, 'privateKey')

    } catch (err)
    {
        err.status = 500
        throw err
    }

    if (!decodeToken)
    {
        const error = new Error('Not Authenticated')
        error.status = 401
        throw error
    }
    req.userId = decodeToken.id
    next()
}