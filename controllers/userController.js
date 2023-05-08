const formBody = require('../middleware/formBody');
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