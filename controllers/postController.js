const { body } = require('express-validator')
const formBody = require('../middleware/formBody')
const { createPost, addLike, getComments, addComment, removeLike, deletePost } = require('../services/postService')

const postController = require('express').Router()

postController.get('/create', (req, res) => {
    res.render('createPost')
})

postController.post('/create',
    formBody(),
    async (req, res) => {
        try {
            if (!req.body.text && !req.body.image) throw new Error('Add text and/or an image to create a post!')
            await createPost(req.user._id, { text: req.body.text, images: [req.body.image] })
            res.redirect('/profile')
        } catch (error) {
            res.render('createPost', {
                post: req.body
            })
        }
    })

postController.delete('/', async (req, res) => {
    try {
        await deletePost(req.query, req.user._id)
        res.status(204)
    } catch (error) {
        res.statusCode = 404
        res.statusMessage = error.message
    }
    res.end()
})

postController.put('/like', async (req, res) => {
    try {
        await addLike(req.body, req.user._id)
        res.status(204)
    } catch (error) {
        res.statusCode = 404
        res.statusMessage = error.message
    }
    res.end()
})

postController.put('/removeLike', async (req, res) => {
    try {
        await removeLike(req.body, req.user._id)
        res.status(204)
    } catch (error) {
        res.statusCode = 404
        res.statusMessage = error.message
    }
    res.end()
})

postController.get('/comments', async (req, res) => {
    try {
        const { commentIds: comments } = await getComments(req.query)
        comments.forEach(c => {
            Object.assign(c, {
                likesCount: c.likeIds.length,
                isLiked: c.likeIds.map(l => l.ownerId.toString()).includes(req.user._id),
                currentUserComment: c.ownerId._id == req.user._id
            })
        });
        res.status(200).json(comments)
    } catch (error) {
        res.statusCode = 404
        res.statusMessage = error.message
        res.end()
    }
})

postController.post('/comments', async (req, res) => {
    try {
        const comment = await addComment(req.body, req.user._id)
        res.status(201).json(Object.assign(comment, {
            likesCount: comment.likeIds.length,
            isLiked: comment.likeIds.map(l => l.ownerId.toString()).includes(req.user._id),
            currentUserComment: comment.ownerId._id == req.user._id
        }))
        console.log(ad);
    } catch (error) {
        res.statusCode = 404
        res.statusMessage = error.message
        res.end()
    }
})

module.exports = postController