const Chat = require("../models/Chat");
const ChatSettings = require("../models/ChatSettings");
const Message = require("../models/Message");

async function getAllChatsForUser({ userId, select, skip }) {
    if (skip == 'all ') return Chat.find({ userIds: userId }).select(select).lean()
    else if (select) return Chat.find({ userIds: userId }).select(select).skip(skip * 10).limit(10).lean()
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
        return message
    } else throw new Error('No such chat')
}

async function getChatById(chatId) {
    return Chat.findById(chatId).populate('userIds').populate('settingsId').lean()
}

async function getChatMessages(chatId, lastMessageId) {
    let lastMessage
    try {
        lastMessage = await Message.findById(lastMessageId)
    } catch (error) {

    }
    createdOn = lastMessage ? { $lt: lastMessage.createdOn } : { $gt: -1 }
    return Message.find({ chatId, createdOn }).sort('-_id').limit(10).populate('ownerId').lean()
}

async function createChat({ name, admin, userIds }) {
    if (admin) userIds.push(admin)
    const [chat, chatSettings] = await Promise.all([Chat.create({ name, admin, userIds }), ChatSettings.create({})])
    chat.settingsId = chatSettings._id
    await chat.save()
}

module.exports = {
    getAllChatsForUser,
    addMessageToChat,
    getChatById,
    getChatMessages,
    createChat
}