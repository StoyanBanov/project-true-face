const homeController = require("../controllers/homeController")

module.exports = app => {
    app.use('/', homeController)
    app.all('/*', (req, res) => {
        res.render('404')
    })
}