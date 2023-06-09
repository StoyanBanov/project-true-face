const { getAllUsers, requestFriendship, acceptFriendship, getFriendRequests, getFriends, unfriend, undoFriendRequest } = require('../services/userService');

const peopleController = require('express').Router()

peopleController.get('/friends', async (req, res) => {
    try {
        const userId = req.query.userId ?? req.user._id
        const { friendIds: friends } = (await getFriends(userId, req.query.skip)) ?? { friendIds: [] }
        friends.map(u => Object.assign(u, { friendsCount: u.friendIds.length, isFriend: true }))
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
        const { friendRequestIds: friendRequests } = (await getFriendRequests(req.user._id, req.query.skip)) ?? { friendRequestIds: [] }
        friendRequests.map(u => Object.assign(u, { friendsCount: u.friendIds.length, isRequested: true }))
        res.status(200).json(friendRequests)
    } catch (error) {
        console.log(error.message);
        res.status(404).end()
    }
})

peopleController.get('/:skip', async (req, res) => {
    const users = (await getAllUsers(req.user._id, req.query, req.params.skip)).map(u => Object.assign(u, {
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
        console.log(error);
        res.status(404)
    }
    res.end()
})

peopleController.put('/remove-friend', async (req, res) => {
    try {
        await unfriend(req.user._id, req.body.friendId)
        res.redirect('/profile/' + req.params.id)
    } catch (error) {
        console.log(error);
        res.end()
    }
})

peopleController.put('/undo-request-friend', async (req, res) => {
    console.log('here');
    try {
        await undoFriendRequest(req.user._id, req.body.friendId)
        res.redirect('/profile/' + req.params.id)
    } catch (error) {
        console.log(error);
        res.end()
    }
})

module.exports = peopleController