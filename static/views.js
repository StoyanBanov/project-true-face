export function profilePicView() {
    return `<a href="/profile">profile</a>
            <a href="/profile/settings">settings</a>
            <a href="/logout">logout</a>`
}

export function chatIconView(chats) {
    return `<a href="javascript:void(0)">create chat</a>
            <ul>${chats.map(c => `<li>
            <img width="30" height="30" src="/static/images/${c.userIds[0].profilePic ?? 'profile.png'}">
            <a href="javascript:void(0)" id="${c._id}">${c.name}</a>
            </li>`).join('\n')}</ul>`
}

export function chatBoxView(chat, userId) {
    return `<ul id="${chat._id}-chat" class="chatMessages">${chat.messageIds.map(m => chatBoxLiView(m, userId)).join('\n')}</ul>
    <form onsubmit="onMessageSubmit(event)" class="chatForm" action="">
        <input onkeyup="onMessageKeyUp(event)" name="text" class="chatInput" autocomplete="off" />
        <button disabled>Send</button>
    </form>`
}

export function chatBoxLiView(message, userId) {
    return `<li style="${userId == message.ownerId ? 'text-align:right;"' : 'color:blue;"'}>${message.text}</li>`
}