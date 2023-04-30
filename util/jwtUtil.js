const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../variables");

function createToken({ _id, username, email, roles, verified }, res) {
    const payload = {
        _id,
        username,
        email,
        roles,
        verified
    }
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '4h' })
    res.cookie('jwt', token, { maxAge: 14400000 })
}

function verifyToken(token) {
    return jwt.verify(token, jwtSecret)
}

module.exports = {
    createToken,
    verifyToken
}