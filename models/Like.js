const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    ownerId: { type: Types.ObjectId },
    type: { type: String, enum: ['thumb', 'heart', 'laugh', 'anger'] }
})

const Like = model('Like', schema)

module.exports = Like