const { getAllUsers, addFriend } = require('../services/userService')
const { userOnly } = require('../util/guards')
const authController = require('./authController')

const homeController = require('express').Router()

homeController.get('/', userOnly(), (req, res) => {
    res.render('home')
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
    res.clearCookie('userId')
    res.redirect('/login')
})

homeController.use('/', authController)

module.exports = homeController