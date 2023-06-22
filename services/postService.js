const Comment = require("../models/Comment")
const Like = require("../models/Like")
const Post = require("../models/Post")
const User = require("../models/User")

async function getAllPosts(userId, skip) {
    userPostSetting = (await User.findById(userId).populate('settingsId')).settingsId.postsISee
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

async function getUserPosts(ownerId, skip) {
    return Post.find({ ownerId })
        .populate({
            path: 'likeIds',
            populate: {
                path: 'ownerId',
            }
        })
        .populate('ownerId')
        .skip(skip * 10).limit(10).lean()
}

async function createPost(ownerId, { text, images }) {
    await Post.create({
        ownerId,
        text,
        images: images || []
    })
}

async function deletePost({ postId, commentId }, ownerId) {
    let toBeDeleted
    if (postId) {
        toBeDeleted = await Post.findById(postId)
    } else if (commentId) {
        toBeDeleted = await Comment.findById(commentId)
    }
    if (toBeDeleted.ownerId != ownerId) throw new Error('This item is not yours!')

    if (postId) {
        await Post.findOneAndDelete({ _id: postId })
    } else if (commentId) {
        await Comment.findByIdAndDelete(commentId)
    }
}

async function addLike({ commentId, postId, type }, ownerId) {
    let liked
    if (postId) liked = await Post.findById(postId).populate('likeIds')
    else if (commentId) liked = await Comment.findById(commentId).populate('likeIds')

    if (liked.ownerId == ownerId) throw new Error('Can\'t like own posts!')
    if (liked.likeIds.some(l => l.ownerId.toString() == ownerId)) throw new Error('Already liked!')
    const like = await Like.create({ ownerId, type })
    liked.likeIds.push(like._id)
    await liked.save()
}

async function removeLike({ commentId, postId }, ownerId) {
    let liked
    if (postId) liked = await Post.findById(postId).populate('likeIds')
    else if (commentId) liked = await Comment.findById(commentId).populate('likeIds')
    const like = liked.likeIds.find(l => l.ownerId.toString() == ownerId)
    if (like) {
        liked.likeIds.splice(liked.likeIds.indexOf(like._id), 1)
        await Promise.all([liked.save(), Like.findByIdAndDelete(like._id)])
    } else throw new Error('You haven\'t liked this post!')
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

async function addComment({ commentId, postId, text }, ownerId) {
    let commentedOn
    if (postId) commentedOn = await Post.findById(postId)
    else if (commentId) commentedOn = await Comment.findById(commentId)
    const comment = await Comment.create({ ownerId, text })
    commentedOn.commentIds.push(comment._id)
    await commentedOn.save()
    return Comment.findById(comment._id).populate('ownerId').populate('likeIds').lean()
}

module.exports = {
    getAllPosts,
    getUserPosts,
    createPost,
    deletePost,
    addLike,
    removeLike,
    getComments,
    addComment
}