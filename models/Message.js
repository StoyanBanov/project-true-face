const { Schema, model, Types: { ObjectId } } = require('mongoose')

const schema = new Schema({
    chatId: { type: ObjectId, ref: 'Chat' },
    ownerId: { type: ObjectId, ref: 'User' },
    text: { type: String, maxLength: 2000 }
})

const Message = model('Message', schema)

module.exports = Message