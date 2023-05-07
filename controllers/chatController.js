const { getAllChatsForUser, getChatById } = require('../services/chatService');

const chatController = require('express').Router()

chatController.get('/', async (req, res) => {
    try {
        const chats = (await getAllChatsForUser(req.user._id)).map(c => {
            if (!c.name) {
                c.userIds.splice(c.userIds.findIndex(u => u._id == req.user._id), 1)
                c.name = c.userIds[0].username
            }
            return c
        })
        res.json(chats)
    } catch (error) {
        console.log(error.message);
        res.status(404).end()
    }
})

chatController.get('/:id', async (req, res) => {
    try {
        const chat = (await getChatById(req.params.id))
        chat.messageIds.map(m => { m.createdOn = m.createdOn.toString(); return m })
        res.json(chat)
    } catch (error) {
        console.log(error.message);
        res.status(404).end()
    }
})

module.exports = chatController