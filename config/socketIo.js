const { Server } = require('socket.io');
const { getAllChatsForUser, addMessageToChat } = require('../services/chatService');

module.exports = server => {
    const io = new Server(server)
    io.on('connection', async socket => {
        const userId = socket.handshake.query.userId.slice(3, -1)
        const userChats = await getAllChatsForUser(userId, 'userIds')
        if (userChats.length > 0) socket.join(userChats.map(c => c._id.toString()))

        socket.on('chat message', async (text, chatId) => {
            const chat = userChats.find(c => c._id == chatId)
            if (chat && chat.userIds.map(String).includes(userId)) {
                io.to(chatId).emit('chat message', text, chatId);
                await addMessageToChat(chatId, userId, text)
            }
        });
    });
}