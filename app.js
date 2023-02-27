const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer')
const app = express();


const diskstorage = multer.diskStorage({
    destination: function (req, file, cb) 
    {
        cb(null, 'images')
    },
    filename: function (req, file, cb) 
    {
        cb(null, Math.random() + '-' + file.originalname)
    }
})

app.use(bodyParser.json())
app.use(
    multer({ storage: diskstorage, }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use((req, res, next) =>
{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next()
})

const feedRoutes = require('./routes/feed')
const authRoutes = require('./routes/auth')

app.use('/feed', feedRoutes)
app.use('/auth', authRoutes)

app.use((error, req, res, next) =>
{
    return res.status(error.status ?? 500).json({ message: error.message, errorsData: error.data })
})


mongoose.connect('mongodb+srv://usmanahmed:usman123@node-practice.ivqzeor.mongodb.net/blogger-site').then(() =>
{
    console.log('connected')
    app.listen(3000)
}).catch((err) => console.log(err))