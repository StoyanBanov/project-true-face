const Chat = require("../models/Chat")
const User = require("../models/User")

async function getAllUsers(currentId, { search }, skip) {
    return User.find({}).where('_id').nin([currentId]).where('username').regex(new RegExp(search, 'i')).skip(skip * 2).limit(2).lean()
}

async function updateUserProperty(id, property) {
    await User.findByIdAndUpdate(id, { $set: property })
}

async function requestFriendship(userId, friendId) {
    const [user, friend] = await Promise.all([User.findById(userId), User.findById(friendId)])
    if (user && friend) {
        if (!user.friendPendingIds.includes(friendId) && !friend.friendPendingIds.includes(userId)) {
            user.friendPendingIds.push(friendId)
            friend.friendRequestIds.push(userId)
            await Promise.all([user.save(), friend.save()])
        } else throw new Error('Already requested')
    } else throw new Error('No such user')
}

async function acceptFriendship(userId, friendId) {
    const [user, friend] = await Promise.all([User.findById(userId), User.findById(friendId)])
    if (user && friend) {
        user.friendIds.push(friendId)
        friend.friendIds.push(userId)
        user.friendRequestIds.splice(user.friendRequestIds.indexOf(friendId), 1)
        friend.friendPendingIds.splice(user.friendRequestIds.indexOf(userId), 1)
        await Promise.all([user.save(), friend.save(), Chat.create({ userIds: [userId, friendId] })])
    } else throw new Error('No such friend request')
}

async function getFriendRequests(userId, skip) {
    return User.findById(userId).select('friendRequestIds').populate('friendRequestIds').skip(skip * 2).limit(2).lean()
}

async function findUserById(id) {
    return User.findById(id).lean()
}

module.exports = {
    getAllUsers,
    updateUserProperty,
    findUserById,
    requestFriendship,
    acceptFriendship,
    getFriendRequests
}