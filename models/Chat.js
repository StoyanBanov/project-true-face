const { Schema, model, Types: { ObjectId } } = require('mongoose')

const schema = new Schema({
    userIds: { type: [ObjectId], ref: 'User', required },
    messageIds: { type: [ObjectId], ref: 'Message', default: [] },
    admin: { type: ObjectId, ref: 'User' }
})

const Chat = model('Chat', schema)

module.exports = Chat