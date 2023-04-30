const userOnly = () => (req, res, next) => {
    if (req.user && req.user.verified) next()
    else if (req.user) res.redirect('/non-verified/' + req.user._id)
    else res.redirect('/login')
}

const guestOnly = () => (req, res, next) => {
    if (req.user && req.user.verified) res.redirect('/')
    else if (req.user) res.redirect('/non-verified/' + req.user._id)
    else next()
}

const nonVerifiedOnly = () => (req, res, next) => {
    if (req.user && !req.user.verified && req.params.id == req.user._id) next()
    else res.redirect('/login')
}

module.exports = {
    userOnly,
    guestOnly,
    nonVerifiedOnly
}