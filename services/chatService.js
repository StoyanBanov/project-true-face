const Chat = require("../models/Chat");
const Message = require("../models/Message");

function getAllChatsForUser(userId) {
    return Chat.find({ userIds: userId }).populate('userIds').lean()
}

function addMessageToChat({ chatId, ownerId, text }) {
    const chat = Chat.findById(chatId)
    if (chat) {
        const message = Message.create({
            chatId,
            ownerId,
            text
        })
        chat.messageIds.push(message._id)
    } else throw new Error('No such chat')
}

function getChat(chatId) {
    return Chat.findById(chatId).populate('messageIds').lean()
}

module.exports = {
    getAllChatsForUser,
    addMessageToChat,
    getChat
}