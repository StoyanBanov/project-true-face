const Comment = require("../models/Comment")
const Like = require("../models/Like")
const Post = require("../models/Post")
const User = require("../models/User")

async function getAllPosts(userId) {
    userPostSetting = (await User.findById(userId).populate('settingsId')).settingsId.postsISee
    let skip = 0
    let limit = 10
    const postsCount = await Post.count()
    const postsToReturn = []
    do {
        let posts = await Post.find({}).where('ownerId').nin([userId])
            .populate({
                path: 'ownerId',
                populate: {
                    path: 'settingsId'
                }
            }).populate({
                path: 'likeIds',
                populate: {
                    path: 'ownerId',
                }
            }).skip(skip).limit(limit).lean()
        skip += limit
        postsToReturn.push(...posts.filter(p => {
            if (userPostSetting == 'all') {
                let setting = p.ownerId.settingsId.seeMyPosts
                if (setting == 'all') return true
                else if (setting == 'friends' && p.ownerId.friendIds.map(String).includes(userId)) return true
            } else if (userPostSetting == 'friends' && p.ownerId.friendIds.map(String).includes(userId)) return true
            return false
        }))
        limit -= postsToReturn.length
    } while (postsToReturn.length < 10 && (skip + 10 < postsCount))
    return postsToReturn
}

async function createPost(ownerId, { text, images }) {
    await Post.create({
        ownerId,
        text,
        images
    })
}


async function likePost({ postId, type }, ownerId) {
    const post = await Post.findById(postId).populate('likeIds')
    if (post.ownerId == ownerId) throw new Error('Can\'t like own posts!')
    if (post.likeIds.some(l => l.ownerId.toString() == ownerId)) throw new Error('Already liked!')
    const like = await Like.create({ ownerId, type })
    post.likeIds.push(like._id)
    await post.save()
}

async function removeLikePost(postId, likeId) {
    const post = await Post.findById(postId)
    post.likeIds.splice(post.likeIds.indexOf(likeId), 1)
    await Promise.all([post.save(), Like.findByIdAndDelete(likeId)])
}


async function getComments({ postId, commentId }) {
    if (postId)
        return Post.findById(postId).select('commentIds').populate({
            path: 'commentIds',
            populate: {
                path: 'ownerId',
            },
            populate: {
                path: 'likeIds'
            }
        }).lean()
    if (commentId)
        return Comment.findById(commentId).select('commentIds').populate({
            path: 'commentIds',
            populate: {
                path: 'ownerId',
            },
            populate: {
                path: 'likeIds'
            }
        }).lean()
}

async function commentPost({ commentId, postId, text }, ownerId) {
    let commentedOn
    let comment
    if (postId) {
        commentedOn = await Post.findById(postId)
        comment = await Comment.create({ ownerId, text })
    } else if (commentId) {
        commentedOn = await Comment.findById(commentId)
        comment = await Comment.create({ ownerId, text })
    }
    commentedOn.commentIds.push(comment._id)
    await commentedOn.save()
    return Comment.findById(comment._id).populate('ownerId').populate('likeIds').lean()
}

async function likeComment({ commentId, type }, ownerId) {
    const comment = await Comment.findById(commentId).populate('likeIds')
    if (comment.ownerId == ownerId) throw new Error('Can\'t like own comments!')
    if (comment.likeIds.some(l => l.ownerId.toString() == ownerId)) throw new Error('Already liked!')
    const like = await Like.create({ ownerId, type })
    comment.likeIds.push(like._id)
    await comment.save()
}

module.exports = {
    getAllPosts,
    createPost,
    likePost,
    removeLikePost,
    getComments,
    commentPost,
    likeComment
}