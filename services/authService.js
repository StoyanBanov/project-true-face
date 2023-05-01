const User = require("../models/User")
const bcrypt = require('bcrypt')

async function register(userData = { username, email, password, image, gender }) {
    return User.create(Object.assign(Object.assign(userData, { password: await bcrypt.hash(userData.password, 10) }), { roles: ['user'] }))
}

async function login({ username, password }) {
    const existingUser = await User.findOne({ username })
    if (existingUser && await bcrypt.compare(password, existingUser.password)) return existingUser
    else throw new Error('Wrong username or password!')
}

module.exports = {
    register,
    login
}