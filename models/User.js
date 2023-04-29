const { Schema, model } = require('mongoose')

const schema = new Schema({
    username: { type: String, required: true, minLength: 5, maxLength: 20 },
    email: { type: String, required: true, minLength: 8, maxLength: 30 },
    profilePic: { type: String },
    password: { type: String, required: true, minLength: 10, maxLength: 30 }
})

schema.index({ username: 1 }, {
    unique: true,
    collation: {
        locale: 'en',
        strength: 2
    }
})

schema.index({ email: 1 }, {
    unique: true,
    collation: {
        locale: 'en',
        strength: 2
    }
})

const User = model('User', schema)

module.exports = User