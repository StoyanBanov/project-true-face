const { Schema, model, Types: { ObjectId } } = require('mongoose')

const schema = new Schema({
    userIds: { type: [ObjectId], ref: 'User', required: true },
    admin: { type: ObjectId, ref: 'User' },
    name: { type: String }
})

const Chat = model('Chat', schema)

module.exports = Chat