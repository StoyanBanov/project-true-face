import { get } from "/static/scripts/api.js"

export function profilePicView() {
    return `<a href="/profile">profile</a>
            <a href="/profile/settings">settings</a>
            <a href="/logout">logout</a>`
}

export async function chatIconView() {
    const chats = await get('chats')
    return `<a href="javascript:void(0)">create chat</a>
            <ul>${chats.map(c => `<li id="${c._id}">
            <img width="30" height="30" src="/static/images/${c.userIds[0].profilePic ?? 'profile.png'}">
            <a href="javascript:void(0)">${c.name}</a>
            </li>`).join('\n')}</ul>`
}