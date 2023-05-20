const { Schema, model, Types: { ObjectId } } = require('mongoose')

const schema = new Schema({
    mutedUserIds: { type: [ObjectId], ref: 'User', default: [] },
    theme: { type: String, enum: ['dark', 'light'], default: 'light' }
})

const ChatSettings = model('ChatSettings', schema)

module.exports = ChatSettings