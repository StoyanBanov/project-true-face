const jwt = require("jsonwebtoken")
const { jwtSecret } = require("../variables")

module.exports = () => (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        try {
            const data = jwt.verify(token, jwtSecret)
            req.user = data
        } catch (error) {
            console.log('Error validating jwt');
            res.redirect('/login')
        }
    }
    next()
}