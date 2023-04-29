const cookieParser = require('cookie-parser')
const { urlencoded, static } = require('express')
const hbs = require('express-handlebars').create({
    extname: '.hbs'
})

module.exports = app => {
    app.engine('.hbs', hbs.engine)
    app.set('view engine', '.hbs')
    app.use(urlencoded({ extended: true }))
    app.use(cookieParser())
    app.use('/static', static('static'))
}