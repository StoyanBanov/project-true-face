const { Schema, model, Types: { ObjectId } } = require('mongoose')

const schema = new Schema({
    ownerId: { type: ObjectId, ref: 'User' },
    text: { type: String, maxLength: 1000 },
    likeIds: { type: [ObjectId], ref: 'Like', default: [] },
    commentIds: { type: [ObjectId], ref: 'Comment', default: [] }
})

const Comment = model('Comment', schema)

module.exports = Comment