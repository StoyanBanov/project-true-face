const { body, validationResult } = require('express-validator')
const formBody = require('../middleware/formBody')
const { createPost, likePost, getComments, commentPost, likeComment } = require('../services/postService')

const postController = require('express').Router()

postController.get('/create', (req, res) => {
    res.render('createPost')
})

postController.post('/create',
    formBody(),
    body('text').trim(),
    async (req, res) => {
        try {
            if (!req.body.text && !req.body.image) throw new Error('Add text and/or an image to create a post!')
            await createPost(req.user._id, { text: req.body.text, images: [req.body.image] })
            res.redirect('/')
        } catch (error) {
            res.render('createPost', {
                post: req.body

            })
        }
    })

postController.put('/likePost', async (req, res) => {
    try {
        await likePost(req.body, req.user._id)
        res.status(200)
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
        const comment = await commentPost(req.body, req.user._id)
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

postController.put('/comments/like', async (req, res) => {
    try {
        await likeComment(req.body, req.user._id)
        res.status(201)
    } catch (error) {
        res.statusCode = 404
        res.statusMessage = error.message
    }
    res.end()
})

module.exports = postController