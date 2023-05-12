const formBody = require('../middleware/formBody');
const { getUserPosts, deletePost } = require('../services/postService');
const { updateUserProperty, getUserAndSettings } = require('../services/userService');
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