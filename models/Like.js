const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    ownerId: { type: Types.ObjectId, required: true },
    type: { type: String, enum: ['thumb', 'heart', 'laugh', 'anger'], required: true }
})

const Like = model('Like', schema)

module.exports = Like