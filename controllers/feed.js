exports.getPosts = (req, res, next) =>
{
    res.status(200).send({
        message: 'posts',
        posts: [{
            _id: new Date().toISOString(), title: 'learning core concept of js', content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been'
        }]
    })

}

exports.createPost = (req, res, next) =>
{
    const title = req.body.title
    const content = req.body.content
    res.status(201).send({
        message: 'Post Created Successfully',
        post: { _id: new Date().toISOString(), title: title, content: content }
    })
}