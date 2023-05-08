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
        let posts = await Post.find({}).where('ownerId').nin([userId]).populate({
            path: 'ownerId',
            populate: {
                path: 'settingsId'
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

async function likePost(postId, ownerId) {
    const post = Post.findById(postId)
    if (post.ownerId == ownerId) throw new Error('Can\'t like own posts')
    const like = await Like.create({ ownerId })
    post.likeIds.push(like._id)
    await post.save()
}

async function removeLikePost(postId, likeId) {
    const post = Post.findById(postId)
    post.likeIds.splice(post.likeIds.indexOf(likeId), 1)
    await Promise.all([post.save(), Like.findByIdAndDelete(likeId)])
}

module.exports = {
    getAllPosts,
    createPost,
    likePost,
    removeLikePost
}