const { getAllUsers, addFriend } = require('../services/userService')
const { userOnly } = require('../util/guards')
const authController = require('./authController')

const homeController = require('express').Router()

homeController.get('/', userOnly(), (req, res) => {
    res.render('home')
})

homeController.get('/search', userOnly(), async (req, res) => {
    const users = (await getAllUsers(req.user._id, req.query, 0)).map(u => Object.assign(u, { friendsCount: u.friendIds.length, isFriend: u.friendIds.map(String).includes(req.user._id) }))
    res.render('search', {
        users,
        search: req.query.search
    })
})

homeController.get('/add-friend/:friendId', userOnly(), async (req, res) => {
    try {
        await addFriend(req.user._id, req.params.friendId)
    } catch (error) {
        console.log(error.message);
    }
    res.redirect('/search')
})

homeController.get('/logout', userOnly(), (req, res) => {
    res.clearCookie('jwt')
    res.redirect('/login')
})

homeController.use('/', authController)

module.exports = homeController