import { Schema, model, Types } from 'mongoose'

const schema = new Schema({
    ownerId: { type: Types.ObjectId, required: true },
    name: { type: String, required: true }
})

const Image = model('Image', schema)

module.exports = Image