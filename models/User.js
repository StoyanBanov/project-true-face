const { Schema, model, Types: { ObjectId } } = require('mongoose')

const schema = new Schema({
    username: { type: String, required: true, minLength: 5, maxLength: 20 },
    email: { type: String, required: true, minLength: 7, maxLength: 30 },
    gender: { type: String, enum: ['', 'male', 'female'] },
    profilePic: { type: String },
    password: { type: String, required: true },
    roles: { type: [String], enum: ['user', 'admin'], default: ['user'] },
    verified: { type: Boolean, default: false },
    friendIds: { type: [ObjectId], ref: 'User', default: [] }
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

schema.virtual('friendsCount').get(function () {
    return this.friendIds.length
})

const User = model('User', schema)

module.exports = User