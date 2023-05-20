const { body } = require('express-validator');
const { getAllChatsForUser, getChatById, createChat, getChatMessages, updateChatSettings, getChatSettings, updateChat } = require('../services/chatService');
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

chatController.put('/:id', body('name').trim(), async (req, res) => {
    try {
        await updateChat(req.params.id, req.body)
        res.status(201)
    } catch (error) {
        console.log(error);
        res.status(404)
    }
    res.end()
})

chatController.get('/:id/settings', async (req, res) => {
    try {
        const { settingsId } = await getChatSettings(req.params.id)
        res.status(201).json(settingsId)
    } catch (error) {
        console.log(error);
        res.status(404).end()
    }
})

chatController.put('/:id/settings', async (req, res) => {
    try {
        await updateChatSettings(req.params.id, req.body)
        res.status(201)
    } catch (error) {
        console.log(error);
        res.status(404)
    }
    res.end()
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
            const userForChatName = chat.userIds.find(u => u._id != req.user._id)
            if (userForChatName) chat.name = userForChatName.username
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