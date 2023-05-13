const { Schema, model, Types: { ObjectId } } = require('mongoose')
const UserSettings = require('./UserSettings')
const Post = require('./Post')
const fs = require('fs')

const schema = new Schema({
    username: { type: String, required: true, minLength: 5, maxLength: 20 },
    email: { type: String, required: true, minLength: 7, maxLength: 30 },
    gender: { type: String, enum: ['', 'male', 'female'] },
    profilePic: { type: String },
    password: { type: String, required: true },
    roles: { type: [String], enum: ['user', 'admin'], default: ['user'] },
    verified: { type: Boolean, default: false },
    friendIds: { type: [ObjectId], ref: 'User', default: [] },
    friendRequestIds: { type: [ObjectId], ref: 'User', default: [] },
    friendPendingIds: { type: [ObjectId], ref: 'User', default: [] },
    settingsId: { type: ObjectId, ref: 'UserSettings' }
})

schema.index({ username: 1 }, {
    unique: true,
    collation: {
        locale: 'en',
        strength: 2
    }
})

schema.index({ email: 1 }, {
    unique: true,
    collation: {
        locale: 'en',
        strength: 2
    }
})

schema.virtual('friendsCount').get(function () {
    return this.friendIds.length
})

schema.pre('deleteOne', { document: false, query: true }, async function () {
    const user = await this.model.findOne(this.getFilter())
    if (user.profilePic)
        fs.unlink(`./static/images/${user.profilePic}`, (err) => {
            if (err) console.log(err);
        })
    const friends = await this.model.find({ '_id': { $in: user.friendIds.concat(user.friendRequestIds).concat(user.friendRequestIds) } })
    friends.forEach(f => {
        f.friendIds.splice(f.friendIds.indexOf(user._id))
        f.friendPendingIds.splice(f.friendIds.indexOf(user._id), 1)
        f.friendRequestIds.splice(f.friendIds.indexOf(user._id), 1)
    })
    await Promise.all([...friends.map(f => f.save()), UserSettings.findByIdAndDelete(user.settingsId), Post.deleteMany({ ownerId: user._id })])
})

const User = model('User', schema)

module.exports = User