const User = require("../models/User")

async function getAllUsers(currentId, { search }, skip) {
    return User.find({}).where('_id').nin([currentId]).where('username').regex(new RegExp(search, 'i')).skip(skip).limit(2).lean()
}

async function updateUserProperty(id, property) {
    await User.findByIdAndUpdate(id, { $set: property })
}

async function addFriend(userId, friendId) {
    const [user, friend] = await Promise.all([User.findById(userId), User.findById(friendId)])
    if (user && friend) {
        user.friendIds.push(friendId)
        friend.friendIds.push(userId)
        await Promise.all([user.save(), friend.save()])
    } else throw new Error('No such user')
}

async function findUserById(id) {
    return User.findById(id).lean()
}

module.exports = {
    getAllUsers,
    updateUserProperty,
    findUserById,
    addFriend
}