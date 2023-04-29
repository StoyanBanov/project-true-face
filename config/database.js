const mongoose = require('mongoose')
const { dbConn } = require('../variables')

module.exports = async app => {
    try {
        await mongoose.connect(dbConn, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
        console.log('Database connected');
    } catch (error) {
        console.log('Error initializing database!');
        console.error(error.message)
        process.exit(1)
    }
}