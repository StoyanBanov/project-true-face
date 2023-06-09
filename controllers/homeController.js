const { getAllPosts } = require('../services/postService')
const { getAllUsers } = require('../services/userService')
const { userOnly } = require('../util/guards')
const authController = require('./authController')

const homeController = require('express').Router()

homeController.get('/', userOnly(), async (req, res) => {
    const posts = (await getAllPosts(req.user._id, 0)).map(a =>
        Object.assign(a, {
            likesCount: a.likeIds.length,
            isLiked: a.likeIds.map(l => l.ownerId._id.toString()).includes(req.user._id)
        }))
    res.render('home', {
        posts
    })
})

homeController.get('/all-posts', userOnly(), async (req, res) => {
    try {
        const posts = (await getAllPosts(req.user._id, req.query.skip)).map(a =>
            Object.assign(a, {
                likesCount: a.likeIds.length,
                isLiked: a.likeIds.map(l => l.ownerId._id.toString()).includes(req.user._id)
            }))
        res.status(200).json(posts)
    } catch (error) {
        console.log(error);
        res.status(404).end()
    }
})

homeController.get('/search', userOnly(), async (req, res) => {
    const users = (await getAllUsers(req.user._id, req.query, 0)).map(u => Object.assign(u, {
        friendsCount: u.friendIds.length,
        isFriend: u.friendIds.map(String).includes(req.user._id),
        isPending: u.friendRequestIds.map(String).includes(req.user._id),
        isRequested: u.friendPendingIds.map(String).includes(req.user._id)
    }))
    res.render('search', {
        users,
        search: req.query.search
    })
})

homeController.get('/logout', userOnly(), (req, res) => {
    res.clearCookie('jwt')
    res.redirect('/login')
})

homeController.use('/', authController)

module.exports = homeController