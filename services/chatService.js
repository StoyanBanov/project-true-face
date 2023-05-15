const Chat = require("../models/Chat");
const Message = require("../models/Message");

async function getAllChatsForUser({ userId, select, skip }) {
    if (select) return Chat.find({ userIds: userId }).select(select).skip(skip * 10).limit(10).lean()
    return Chat.find({ userIds: userId }).populate('userIds').skip(skip * 10).limit(10).lean()
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
        return message
    } else throw new Error('No such chat')
}

async function getChatById(chatId) {
    return Chat.findById(chatId).populate('messageIds').lean()
}

async function createChat({ name, admin, userIds }) {
    userIds.push(admin)
    await Chat.create({ name, admin, userIds })
}

module.exports = {
    getAllChatsForUser,
    addMessageToChat,
    getChatById,
    createChat
}