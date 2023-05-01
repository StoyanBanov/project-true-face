module.exports = () => (req, res, next) => {
    res.locals.isUser = req.user && req.user.verified
    if (res.locals.isUser) res.locals.profilePic = req.user.profilePic
    next()
}