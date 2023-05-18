const { body } = require('express-validator');
const { getAllChatsForUser, getChatById, createChat, getChatMessages } = require('../services/chatService');
const { getFriends } = require('../services/userService');

const chatController = require('express').Router()

chatController.get('/', async (req, res) => {
    try {
        const chats = (await getAllChatsForUser({ userId: req.user._id, skip: req.query.skip })).map(c => {
            if (!c.name) {
                c.userIds.splice(c.userIds.findIndex(u => u._id == req.user._id), 1)
                if (c.userIds[0]) c.name = c.userIds[0].username
            }
            return c
        })
        res.status(200).json(chats)
    } catch (error) {
        console.log(error);
        res.status(404).end()
    }
})

chatController.get('/create', async (req, res) => {
    const { friendIds: friends } = await getFriends(req.user._id, 0)
    res.render('createChat', {
        friends
    })
})

chatController.post('/create',
    body('name').trim(),
    body(['name', 'userIds']).isEmpty().withMessage('All fields are required!'),
    async (req, res) => {
        try {
            await createChat(Object.assign(req.body, { admin: req.user._id }))
            res.redirect('/')
        } catch (error) {
            console.log(error);
            const { friendIds: friends } = await getFriends(req.user._id, 0)
            res.render('createChat', {
                friends
            })
        }
    })

chatController.get('/:id', async (req, res) => {
    try {
        const chat = await getChatById(req.params.id)
        if (!chat.name) {
            chat.name = chat.userIds.find(u => u._id != req.user._id).username
        }
        res.status(200).json(chat)
    } catch (error) {
        console.log(error);
        res.status(404).end()
    }
})

chatController.get('/:id/messages', async (req, res) => {
    try {
        const messages = (await getChatMessages(req.params.id, req.query.lastMessageId)).map(m => { m.createdOn = m.createdOn.toString(); return m })
        res.status(200).json(messages)
    } catch (error) {
        console.log(error);
        res.status(404).end()
    }
})

module.exports = chatController