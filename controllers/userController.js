const { body } = require('express-validator');
const formBody = require('../middleware/formBody');
const { getUserPosts, deletePost } = require('../services/postService');
const { updateUserProperty, getUserAndSettings, updateUser, deleteUser } = require('../services/userService');
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

userController.post('/', formBody(), async (req, res) => {
    try {
        await updateUserProperty(req.user._id, { profilePic: req.body.profilePic })
        createToken(Object.assign(req.user, { profilePic: req.body.profilePic }), res)
    } catch (error) {
        console.log(error.message);
    }
    res.redirect('/profile')
})

userController.delete('/', async (req, res) => {
    try {
        await deleteUser(req.user._id)
        res.clearCookie('jwt')
        res.status(204)
    } catch (error) {
        console.log(error);
    }
    res.end()
})

userController.get('/delete', async (req, res) => {
    res.render('deleteProfile')
})

userController.get('/settings', async (req, res) => {
    const user = await getUserAndSettings(req.user._id)
    user.myPostsSelect = [
        { value: 'all', selected: user.settingsId.seeMyPosts == 'all' },
        { value: 'friends', selected: user.settingsId.seeMyPosts == 'friends' },
        { value: 'me', selected: user.settingsId.seeMyPosts == 'me' }
    ]
    user.othersPostsSelect = [
        { value: 'all', selected: user.settingsId.postsISee == 'all' },
        { value: 'friends', selected: user.settingsId.postsISee == 'friends' },
        { value: 'none', selected: user.settingsId.postsISee == 'none' }
    ]
    res.render('settings', user)
})

userController.post('/settings', async (req, res) => {
    body(['seeMyPosts', 'postsISee']).trim()
    try {
        await updateUser(req.user._id, req.body)
    } catch (error) {
        req.body.myPostsSelect = [
            { value: 'all', selected: req.body.seeMyPosts == 'all' },
            { value: 'friends', selected: req.body.seeMyPosts == 'friends' },
            { value: 'me', selected: req.body.seeMyPosts == 'me' }
        ]
        req.body.othersPostsSelect = [
            { value: 'all', selected: req.body.postsISee == 'all' },
            { value: 'friends', selected: req.body.postsISee == 'friends' },
            { value: 'none', selected: req.body.postsISee == 'none' }
        ]
        res.render('settings', req.body)
    }
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

module.exports = userController