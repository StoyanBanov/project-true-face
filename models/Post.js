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
    //TODO fix bug
    for (const imgName of post.images) {
        fs.unlink(`./static/images/${imgName}`, (err) => {
            if (err) console.log(err);
        })
    }
    await Promise.all([Comment.deleteMany({ '_id': { $in: post.commentIds } }), Like.deleteMany({ '_id': { $in: post.likeIds } })])
})

schema.pre('deleteMany', { document: false, query: true }, async function () {
    const posts = await this.model.find(this.getFilter())
    if (posts) {
        const comments = posts.map(p => p.commentIds).reduce((allCom, com) => {
            allCom.push(...com)
            return allCom
        }, [])
        const likes = posts.map(p => p.likeIds).reduce((allLi, li) => {
            allLi.push(...li)
            return allLi
        }, [])
        const images = posts.map(p => p.images).reduce((allIm, im) => {
            allIm.push(...im)
            return allIm
        }, [])
        for (const imgName of images) {
            fs.unlink(`./static/images/${imgName}`, (err) => {
                if (err) console.log(err);
            })
        }
        await Promise.all([Comment.deleteMany({ '_id': { $in: comments } }), Like.deleteMany({ '_id': { $in: likes } })])
    }
})

const Post = model('Post', schema)

module.exports = Post