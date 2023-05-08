const { body } = require('express-validator')
const formBody = require('../middleware/formBody')
const { createPost } = require('../services/postService')

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

module.exports = postController