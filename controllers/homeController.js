const { userOnly } = require('../util/guards')
const authController = require('./authController')

const homeController = require('express').Router()

homeController.get('/', userOnly(), (req, res) => {
    res.render('home')
})

homeController.get('/logout', (req, res) => {
    res.clearCookie('jwt')
    res.redirect('/login')
})

homeController.use('/', authController)

module.exports = homeController