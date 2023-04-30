module.exports = () => (req, res, next) => {
    res.locals.isUser = req.user || false
    next()
}