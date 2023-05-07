import { profilePicView, chatIconView, chatBoxView, chatBoxLiView } from "/static/views.js"
import { get } from "/static/scripts/api.js"

const userId = await get('profile/current-user?select=_id')
const socket = io('/', { query: `userId=${userId}` });

const profilePic = document.getElementById('profilePic')
const chatIcon = document.getElementById('chatIcon')
const dropDown = document.getElementById('dropDown')
let currentViewName
let openChatBoxes = 0
window.addEventListener('click', async (e) => {
    if (dropDown.style.display == 'block' && e.target != dropDown && e.target != profilePic && e.target != chatIcon) {
        dropDown.style.display = 'none'
    } else if (e.target == profilePic) {
        handleDropDown('profilePic', profilePicView)
    } else if (e.target == chatIcon) {
        const chats = await get('chats')
        handleDropDown('chatView', chatIconView, chats)
    }
})

dropDown.addEventListener('click', async e => {
    if (e.target.tagName != 'A') return
    if (currentViewName == 'chatView') {
        e.preventDefault()
        await appendChatBox(e.target.id)
    }
})

socket.on('chat message', async (text, chatId, ownerId) => {
    let chatUl = document.getElementById(chatId + '-chat')
    if (!chatUl) {
        await appendChatBox(chatId)
        chatUl = document.getElementById(chatId + '-chat')
    }
    chatUl.innerHTML += chatBoxLiView({ text, ownerId }, userId)
    chatUl.scrollTo(0, chatUl.scrollHeight);
});

function handleDropDown(name, viewCallBack, ...params) {
    if (dropDown.style.display != 'block' || currentViewName != name) {
        dropDown.style.display = 'block'
        dropDown.innerHTML = viewCallBack(...params)
        currentViewName = name
    } else if (currentViewName == name) dropDown.style.display = 'none'
}

async function appendChatBox(chatId) {
    const chatBoxDiv = document.createElement('div')
    chatBoxDiv.className = 'chatBox'

    const chat = await get(`chats/${chatId}`)
    chatBoxDiv.style.right = `${openChatBoxes++ * 320 + 100}px`

    chatBoxDiv.innerHTML = chatBoxView(chat, userId)
    document.body.appendChild(chatBoxDiv)
}

export function onMessageSubmit(e) {
    e.preventDefault();
    const text = Object.fromEntries((new FormData(e.target)).entries()).text
    if (text) {
        socket.emit('chat message', text, e.target.parentElement.children[0].id.split('-')[0]);
        e.target.reset()
    }
}

export function onMessageKeyUp(e) {
    const chatSubmit = document.querySelector('.chatForm > button');
    if (e.target.value) chatSubmit.disabled = false
    else chatSubmit.disabled = true
}