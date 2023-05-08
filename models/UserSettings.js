const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    seeMyPosts: { type: String, enum: ['all', 'friends', 'me'], default: 'all' },
    postsISee: { type: String, enum: ['all', 'friends', 'none'], default: 'all' },
})

const UserSettings = model('UserSettings', schema)

module.exports = UserSettings