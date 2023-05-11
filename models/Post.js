const { Schema, model, Types: { ObjectId } } = require('mongoose')
const Comment = require('./Comment')
const Like = require('./Like')
const fs = require('fs')

const schema = new Schema({
    ownerId: { type: ObjectId, ref: 'User' },
    images: { type: [String], default: [] },
    text: { type: String, maxLength: 2000 },
    likeIds: { type: [ObjectId], ref: 'Like', default: [] },
    commentIds: { type: [ObjectId], ref: 'Comment', default: [] }
})

schema.pre('findOneAndDelete', { document: false, query: true }, async function () {
    const post = await this.model.findOne(this.getFilter())
    for (const imgName of post.images) {
        fs.unlink(`./static/images/${imgName}`, (err) => {
            if (err) console.log(err);
        })
    }
    await Promise.all([Comment.deleteMany({ '_id': { $in: post.commentIds } }), Like.deleteMany({ '_id': { $in: post.likeIds } })])
})

const Post = model('Post', schema)

module.exports = Post