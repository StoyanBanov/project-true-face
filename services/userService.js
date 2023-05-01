const User = require("../models/User")

async function updateUserProperty(id, property) {
    await User.findByIdAndUpdate(id, { $set: property })
}

async function findUserById(id) {
    return User.findById(id).lean()
}

module.exports = {
    updateUserProperty,
    findUserById
}