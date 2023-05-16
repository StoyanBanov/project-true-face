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
            <img width="30" height="30" src="/static/images/${c.userIds[0] && c.userIds[0].profilePic ? c.userIds[0].profilePic : 'profile.png'}">
            <a href="javascript:void(0)" id="${c._id}">${c.name ?? 'former user'}</a>
            </li>`
}

export function chatBoxView(chat, userId) {
    return `<a onclick="onCloseMsgBox(event)" href="javascript:void(0)">X</a>
            <ul onscroll="onChatBoxScroll(event)" id="${chat._id}-chat" class="chatMessages">${chat.messageIds.map(m => chatBoxLiView(m, userId)).join('\n')}</ul>
            <form onsubmit="onMessageSubmit(event)" class="chatForm" action="">
                <input onkeyup="onMessageKeyUp(event)" name="text" class="chatInput" autocomplete="off" />
                <button disabled>Send</button>
            </form>`
}

export function chatBoxLiView(message, userId) {
    return `<li style="${userId == message.ownerId ? 'text-align:right;"' : 'color:blue;"'}>${message.createdOn.split(' ').slice(1, 4).join(' ')}: ${message.text}</li>`
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

export function name(params) {

}