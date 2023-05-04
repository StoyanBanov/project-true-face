const { getAllUsers } = require('../services/userService');

const peopleController = require('express').Router()

peopleController.get('/:skip', async (req, res) => {
    const users = (await getAllUsers(req.user._id, req.query, req.params.skip)).map(u => Object.assign(u, { friendsCount: u.friendIds.length, isFriend: u.friendIds.map(String).includes(req.user._id) }))
    res.json(users)
})

module.exports = peopleController