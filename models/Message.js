const { Schema, model, Types: { ObjectId } } = require('mongoose')

const schema = new Schema({
    chatId: { type: ObjectId, ref: 'Chat' },
    ownerId: { type: ObjectId, ref: 'User' },
    text: { type: String, maxLength: 2000 },
    createdOn: { type: Date, required: true, default: new Date().valueOf() }
})

const Message = model('Message', schema)

module.exports = Message