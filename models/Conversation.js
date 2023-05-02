const { Schema, model, Types: { ObjectId } } = require('mongoose')

const schema = new Schema({
    userIds: { type: [ObjectId], ref: 'User', default: [] },
    messageIds: { type: [ObjectId], ref: 'Message', default: [] },
    admin: { type: ObjectId, ref: 'User' }
})

const Conversation = model('Conversation', schema)

module.exports = Conversation