const databaseConfig = require('./config/database')
const expressConfig = require('./config/express')
const routes = require('./config/routes')
const { port } = require('./variables')

const app = require('express')()

start()

async function start() {
    await databaseConfig(app)
    expressConfig(app)
    routes(app)

    app.listen(process.env.PORT || port, () => console.log(`Listening at ${port}`))
}