const homeController = require("../controllers/homeController")
const userController = require("../controllers/userController")
const { userOnly } = require("../util/guards")

module.exports = app => {
    app.use('/', homeController)
    app.use('/profile', userOnly(), userController)
    app.all('/*', (req, res) => {
        res.render('404')
    })
}