const chatController = require("../controllers/chatController")
const homeController = require("../controllers/homeController")
const peopleController = require("../controllers/peopleController")
const postController = require("../controllers/postController")
const userController = require("../controllers/userController")
const { userOnly } = require("../util/guards")

module.exports = app => {
    app.use('/', homeController)
    app.use('/profile', userOnly(), userController)
    app.use('/people', userOnly(), peopleController)
    app.use('/chats', userOnly(), chatController)
    app.use('/posts', userOnly(), postController)
    app.all('/*', (req, res) => {
        res.render('404')
    })
}