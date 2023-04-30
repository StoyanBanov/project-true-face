const User = require("../models/User")
const bcrypt = require('bcrypt')

async function register(userData = { username, email, password, image, gender }) {
    return User.create(Object.assign(Object.assign(userData, { password: await bcrypt.hash(userData.password, 10) }), { roles: ['user'] }))
}

async function login(userData) {

}

async function verifyEmail(id) {
    await User.findByIdAndUpdate(id, { $set: { verified: true } })
}

module.exports = {
    register,
    login,
    verifyEmail
}