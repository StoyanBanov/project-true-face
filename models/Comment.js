const { Schema, model, Types: { ObjectId } } = require('mongoose')
const Like = require('./Like')

const schema = new Schema({
    ownerId: { type: ObjectId, ref: 'User' },
    text: { type: String, maxLength: 1000 },
    likeIds: { type: [ObjectId], ref: 'Like', default: [] },
    commentIds: { type: [ObjectId], ref: 'Comment', default: [] }
})

schema.pre('deleteMany', { document: false, query: true }, async function () {
    const comments = await this.model.find(this.getFilter())
    const subCommentIds = comments.map(c => c.commentIds).reduce((allIds, curIds) => {
        allIds.push(...curIds)
        return allIds
    }, [])
    const likes = comments.map(c => c.likeIds).reduce((allIds, curIds) => {
        allIds.push(...curIds)
        return allIds
    }, [])
    if (subCommentIds.length > 0)
        await this.model.deleteMany({
            '_id': {
                $in: subCommentIds
            }
        })
    if (subCommentIds.length > 0)
        Like.deleteMany({
            '_id': {
                $in: likes
            }
        })
})

schema.pre('findOneAndDelete', { document: false, query: true }, async function () {
    const comment = await this.model.findOne(this.getFilter())
    await Promise.all([Comment.deleteMany({ '_id': { $in: comment.commentIds } }), Like.deleteMany({ '_id': { $in: comment.likeIds } })])
})

const Comment = model('Comment', schema)

module.exports = Comment