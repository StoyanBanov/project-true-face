const { Schema, model, Types: { ObjectId } } = require('mongoose')

const schema = new Schema({
    ownerId: { type: ObjectId, ref: 'User' },
    images: { type: [String], default: [] },
    text: { type: String, maxLength: 2000 },
    likeIds: { type: [ObjectId], ref: 'Like', default: [] },
    commentIds: { type: [ObjectId], ref: 'Comment', default: [] }
})

const Post = model('Post', schema)

module.exports = Post