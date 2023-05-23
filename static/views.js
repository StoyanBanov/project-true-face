export function profilePicView() {
    return `<a href="/profile">profile</a>
            <a href="/profile/settings">settings</a>
            <a href="/logout">logout</a>`
}

export function chatIconView(chats) {
    return `<a href="/chats/create">create chat</a>
            <ul onscroll="onChatDropScroll(event)" class="chatDropdownUl">${chats.map(chatIconViewLi).join('\n')}</ul>`
}

export function chatIconViewLi(c) {
    return `<li>
            <img style="border-radius:50%" width="30" height="30" src="/static/images/${c.userIds[0] && c.userIds[0].profilePic ? c.userIds[0].profilePic : 'profile.png'}">
            <a href="javascript:void(0)" id="${c._id}">${c.name ?? 'former user'}</a>
            </li>`
}

export function chatBoxView(chat, messages, userId, styleRight) {
    return `<div style="right:${styleRight}px;" id="${chat._id}-box" class="chatBox ${chat.settingsId.theme == 'dark' ? 'chatDark' : ''}">
                <div class="chatSettings"></div>
                <div class="chatTopBar">
                    <div class="chatName">
                        <p>${chat.name ?? 'former user'}</p>
                    </div>
                    <a chat-id="${chat._id}" onclick="onClickChatSettings(event)" href="javascript:void(0)">
                        <svg height="20" width="20">
                            <circle class="${chat.settingsId.theme == 'light' ? 'chatSettingsDotsGray' : 'chatSettingsDotsWhite'}" cx="10" cy="6" r="2" />
                            <circle class="${chat.settingsId.theme == 'light' ? 'chatSettingsDotsGray' : 'chatSettingsDotsWhite'}" cx="10" cy="12" r="2" />
                            <circle class="${chat.settingsId.theme == 'light' ? 'chatSettingsDotsGray' : 'chatSettingsDotsWhite'}" cx="10" cy="18" r="2" />
                        </svg>
                    </a>
                    <a chat-id="${chat._id}" onclick="onCloseMsgBox(event)" href="javascript:void(0)">
                        <svg width="20" height="20">
                            <line class="${chat.settingsId.theme == 'light' ? 'chatSettingsCloseGray' : 'chatSettingsCloseWhite'}" x1="4" x2="16" y1="6" y2="18"></line>
                            <line class="${chat.settingsId.theme == 'light' ? 'chatSettingsCloseGray' : 'chatSettingsCloseWhite'}" x1="4" x2="16" y1="18" y2="6"></line>
                        </svg>
                    </a>
                </div>
                <ul onscroll="onChatBoxScroll(event)" id="${chat._id}-chat" class="chatMessages">${messages.reverse().map(m => chatBoxLiView(m, userId)).join('\n')}</ul>
                <form chat-id="${chat._id}" onsubmit="onMessageSubmit(event)" class="chatForm" action="">
                    <input onkeyup="onMessageKeyUp(event)" name="text" class="chatInput" autocomplete="off" />
                    <button disabled>Send</button>
                </form>
            </div>`
}

export function chatBoxSettingsView(chat, userId) {
    return `${!chat.admin || chat.admin == userId
        ? `
            ${chat.admin ? `
            <div class="chatSet">
                <div>
                    <input id="chat-name" value="${chat.name}">
                </div>
                <a chat-id="${chat._id}" onclick="onSetChatName(event)" href="javascript:void(0)">
                    <svg width="20" height="20">
                        <line x1="2" x2="8" y1="12" y2="19" class="${chat.settingsId.theme == 'light' ? 'chatSettingsCheckLight' : 'chatSettingsCheckDark'}"></line>
                        <line x1="8" x2="14" y1="19" y2="8" class="${chat.settingsId.theme == 'light' ? 'chatSettingsCheckLight' : 'chatSettingsCheckDark'}"></line>
                    </svg>
                </a>
            </div>` : `<p>${chat.name}</p>`}
            
            <div class="chatSet">
                <div>
                    <select name="chat-theme" >
                        <option ${chat.settingsId.theme == 'dark' ? 'selected' : ''}>dark</option>
                        <option ${chat.settingsId.theme == 'light' ? 'selected' : ''}>light</option>
                    </select>
                </div>
                <a chat-id="${chat._id}" onclick="onSetChatTheme(event)" href="javascript:void(0)">
                    <svg width="20" height="20">
                        <line x1="2" x2="8" y1="12" y2="19" class="${chat.settingsId.theme == 'light' ? 'chatSettingsCheckLight' : 'chatSettingsCheckDark'}"></line>
                        <line x1="8" x2="14" y1="19" y2="8" class="${chat.settingsId.theme == 'light' ? 'chatSettingsCheckLight' : 'chatSettingsCheckDark'}"></line>
                    </svg>
                </a>
            </div>
            <a chat-id="${chat._id}" onclick="onMuteChat(event)" href="javascript:void(0)">${chat.settingsId.mutedUserIds.includes(userId) ? 'unmute' : 'mute'}</a>
            ${chat.admin ? `<a chat-id="${chat._id}" class="${chat.settingsId.theme == 'dark' ? '' : 'chatDeleteLight'}" href="javascript:void(0)" onclick="onDeleteChat(event)">Delete</a>` : ''}`
        : `
            <p style="margin:0;">${chat.name}</p>
            <p style="margin:0;">${chat.settingsId.theme}</p>
            <a chat-id="${chat._id}" onclick="onMuteChat(event)" href="javascript:void(0)">${chat.settingsId.mutedUserIds.includes(userId) ? 'unmute' : 'mute'}</a>`} `
}

export function chatBoxLiView(message, userId) {
    return `<li id="${message._id}" style="${message.ownerId && userId == message.ownerId._id ? 'text-align:right;"' : 'color: blue; "'}>${message.createdOn.split(' ').slice(1, 4).join(' ')}: ${message.text}</li>`
}

export function commentsView(comments) {
    return `<div class="commentsBox">
            <a href="javascript:void(0)">${comments.length
            ? `Comment</a><ul style="height:200px;">${comments.map(c => `<li>${commentLiView(c)}</li>`).join('\n')}</ul>`
            : 'Be the first to comment</a><ul></ul>'}
            </div>`
}

export function commentLiView(comment) {
    const textArr = comment.text.split('')
    comment.text = ''
    while (textArr.length > 0) {
        comment.text += textArr.splice(0, 72).join('') + '\n'
    }
    return `<div id="${comment._id}" class="commentContent">
                <img width="20" height="20" src="/static/images/${comment.ownerId.profilePic ?? 'profile.png'}">
                <p>${comment.text}</p>
                <div class="commentActions">
                    <p>${comment.likesCount}</p>
                    ${!comment.currentUserComment ? `<a href="javascript:void(0)">${comment.isLiked ? `Liked` : `Like`}</a>` : ''}
                    <a href="javascript:void(0)">Comments</a>
                    ${comment.currentUserComment ? '<a href="javascript:void(0)">Delete</a>' : ''}
                </div>
            </div>`
}

export function createCommentView() {
    return `<form onsubmit="onPostComment(event)" action="#" method="post">
                <textarea name="text"></textarea>
                <input type="submit" value="Comment">
            </form>`
}