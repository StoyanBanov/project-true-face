const { Schema, model, Types: { ObjectId } } = require('mongoose')
const Message = require('./Message')

const schema = new Schema({
    userIds: { type: [ObjectId], ref: 'User', required: true },
    admin: { type: ObjectId, ref: 'User' },
    name: { type: String },
    settingsId: { type: ObjectId, ref: 'ChatSettings' }
})

schema.pre('findOneAndDelete', { document: false, query: true }, async function () {
    const chat = await this.model.find(this.getFilter())
    await Message.deleteMany({ chatId: chat._id })
})

const Chat = model('Chat', schema)

module.exports = Chat