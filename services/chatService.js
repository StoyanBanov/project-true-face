const Chat = require("../models/Chat");
const ChatSettings = require("../models/ChatSettings");
const Message = require("../models/Message");
const User = require("../models/User");

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

async function createChat({ name, admin, userIds, type }) {
    if (admin) userIds.push(admin)
    const [chat, chatSettings] = await Promise.all([Chat.create({ name, admin, userIds, type }), ChatSettings.create({})])
    chat.settingsId = chatSettings._id
    await chat.save()
}

async function updateChat(id, { admin, name }) {
    const chat = await Chat.findById(id)
    if (chat) {
        if (admin) {
            if (chat.userIds.includes(admin)) chat.admin = admin
            else throw new Error('No such user in this chat!')
        }
        if (name) {
            chat.name = name
        }
        await chat.save()
    } else throw new Error('No such chat!')
}

async function deleteChat(id) {
    await Chat.findOneAndDelete({ _id: id })
}

async function updateChatSettings(id, { theme, mutedId }) {
    const chat = await Chat.findById(id)
    if (chat) {
        const settings = await ChatSettings.findById(chat.settingsId)
        if (theme) settings.theme = theme
        if (mutedId) {
            if (chat.userIds.includes(mutedId)) {
                if (!settings.mutedUserIds.includes(mutedId)) {
                    settings.mutedUserIds.push(mutedId)
                } else {
                    settings.mutedUserIds.splice(settings.mutedUserIds.indexOf(mutedId), 1)
                }
            } else throw new Error('No such user in this chat, or already muted!')
        }
        await settings.save()
    } else throw new Error('No such chat!')
}

async function getChatSettings(chatId) {
    return Chat.findById(chatId).populate('settingsId').lean()
}

module.exports = {
    getAllChatsForUser,
    addMessageToChat,
    getChatById,
    getChatMessages,
    createChat,
    updateChat,
    deleteChat,
    updateChatSettings,
    getChatSettings
}