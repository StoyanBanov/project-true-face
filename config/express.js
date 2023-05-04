const cookieParser = require('cookie-parser')
const { urlencoded, static, json } = require('express')
const auth = require('../middleware/auth')
const nav = require('../middleware/nav')
const hbs = require('express-handlebars').create({
    extname: '.hbs'
})

module.exports = app => {
    app.engine('.hbs', hbs.engine)
    app.set('view engine', '.hbs')
    app.use(json())
    app.use(urlencoded({ extended: true }))
    app.use(cookieParser())
    app.use('/static', static('static'))
    app.use(auth())
    app.use(nav())
}