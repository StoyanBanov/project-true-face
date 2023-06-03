import Image from '../models/Image'

async function getAllUserImages(ownerId) {
    return Image.find({ ownerId })
}

async function getImageById(id) {
    return Image.findById(id)
}

async function deleteImageById(id) {
    return Image.findByIdAndDelete(id)
}

module.exports = {
    getAllUserImages,
    getImageById,
    deleteImageById
}