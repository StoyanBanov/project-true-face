const databaseConfig = require('./config/database')
const expressConfig = require('./config/express')
const routes = require('./config/routes')
const socketIoConfig = require('./config/socketIo')
const { port } = require('./variables')

const app = require('express')()
const server = require('http').createServer(app)

start()

async function start() {
    await databaseConfig(app)
    socketIoConfig(server)
    expressConfig(app)
    routes(app)

    server.listen(process.env.PORT || port, () => console.log(`Listening at ${port}`))
}