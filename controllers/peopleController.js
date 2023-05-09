const { getAllUsers, requestFriendship, acceptFriendship, getFriendRequests, getFriends } = require('../services/userService');

const peopleController = require('express').Router()

peopleController.get('/friends', async (req, res) => {
    try {
        const { friendIds: friends } = await getFriends(req.user._id)
        res.status(200).json(friends)
    } catch (error) {
        console.log(error.message);
        res.status(404).end()
    }
})

peopleController.put('/request-friend', async (req, res) => {
    try {
        await requestFriendship(req.user._id, req.body.friendId)
        res.status(301)
    } catch (error) {
        console.log(error.message);
        res.status(404)
    }
    res.end()
})

peopleController.get('/request-friend', async (req, res) => {
    try {
        const { friendRequestIds: friendRequests } = await getFriendRequests(req.user._id)
        friendRequests.map(u => Object.assign(u, { friendsCount: u.friendIds.length, isRequested: true }))
        res.status(200).json(friendRequests)
    } catch (error) {
        console.log(error.message);
        res.status(404).end()
    }
})

peopleController.get('/:skip', async (req, res) => {
    const users = (await getAllUsers(req.user._id, req.query, 0)).map(u => Object.assign(u, {
        friendsCount: u.friendIds.length,
        isFriend: u.friendIds.map(String).includes(req.user._id),
        isPending: u.friendRequestIds.map(String).includes(req.user._id),
        isRequested: u.friendPendingIds.map(String).includes(req.user._id)
    }))
    res.status(200).json(users)
})

peopleController.put('/accept-friend', async (req, res) => {
    try {
        await acceptFriendship(req.user._id, req.body.friendId)
        res.status(301)
    } catch (error) {
        console.log(error.message);
        res.status(404)
    }
    res.end()
})

module.exports = peopleController