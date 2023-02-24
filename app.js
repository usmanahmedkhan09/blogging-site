const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const feedRoutes = require('./routes/feed')


app.use(bodyParser.json())
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use((req, res, next) =>
{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next()
})

app.use('/feed', feedRoutes)
app.use((error, req, res, next) =>
{
    return res.status(error.status ?? 500).json({ message: error.message })
})


mongoose.connect('mongodb+srv://usmanahmed:usman123@cluster0.ozm2t4m.mongodb.net/blog-site').then(() =>
{
    console.log('connected')
    app.listen(3000)
}).catch((err) => console.log(err))