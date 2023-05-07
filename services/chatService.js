const Chat = require("../models/Chat");
const Message = require("../models/Message");

async function getAllChatsForUser(userId, select) {
    if (select) return Chat.find({ userIds: userId }).select(select).lean()
    return Chat.find({ userIds: userId }).populate('userIds').lean()
}

async function addMessageToChat(chatId, ownerId, text) {
    const chat = await Chat.findById(chatId)
    if (chat) {
        const message = await Message.create({
            chatId,
            ownerId,
            text
        })
        chat.messageIds.push(message._id)
        await chat.save()
    } else throw new Error('No such chat')
}

async function getChatById(chatId) {
    return Chat.findById(chatId).populate('messageIds').lean()
}

module.exports = {
    getAllChatsForUser,
    addMessageToChat,
    getChatById
}