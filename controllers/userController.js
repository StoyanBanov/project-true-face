const formBody = require('../middleware/formBody');
const { getUserPosts, deletePost } = require('../services/postService');
const { updateUserProperty } = require('../services/userService');
const { createToken } = require('../util/jwtUtil');

const userController = require('express').Router()

userController.get('/', async (req, res) => {
    const posts = (await getUserPosts(req.user._id)).map(a =>
        Object.assign(a, {
            likesCount: a.likeIds.length,
            isLiked: a.likeIds.map(l => l.ownerId._id.toString()).includes(req.user._id),
            isCurrentUserPost: true
        }))
    res.render('profile', Object.assign(req.user, { posts }))
})

userController.get('/deletePost/:postId', async (req, res) => {
    await deletePost(req.params, req.user._id)
    res.redirect('/profile')
})

userController.get('/current-user', (req, res) => {
    const select = req.query.select
    if (select) res.json(req.user[select])
    else res.json(req.user)
})

userController.post('/', formBody(), async (req, res) => {
    try {
        await updateUserProperty(req.user._id, { profilePic: req.body.image })
        createToken(Object.assign(req.user, { profilePic: req.body.image }), res)
    } catch (error) {
        console.log(error.message);
    }
    res.redirect('profile')
})

module.exports = userController