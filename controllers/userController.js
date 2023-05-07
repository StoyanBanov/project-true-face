const image = require('../middleware/image');
const { updateUserProperty } = require('../services/userService');
const { createToken } = require('../util/jwtUtil');

const userController = require('express').Router()

userController.get('/', (req, res) => {
    res.render('profile', req.user)
})

userController.get('/current-user', (req, res) => {
    const select = req.query.select
    if (select) res.json(req.user[select])
    else res.json(req.user)
})

userController.post('/', image(), async (req, res) => {
    try {
        await updateUserProperty(req.user._id, { profilePic: req.user.profilePic })
        createToken(req.user, res)
    } catch (error) {
        console.log(error.message);
    }
    res.redirect('profile')
})

module.exports = userController