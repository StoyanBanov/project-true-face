import { profilePicView, chatIconView, chatBoxView, chatBoxLiView } from "/static/views.js"
import { get } from "/static/scripts/api.js"

const userId = await get('profile/current-user?select=_id')
const socket = io('/', { query: `userId=${userId}` });

const profilePic = document.getElementById('profilePic')
const chatIcon = document.getElementById('chatIcon')
const dropDown = document.getElementById('dropDown')
let currentViewName
let openChatBoxes = []
window.addEventListener('click', async (e) => {
    if (dropDown.style.display == 'block' && e.target != dropDown && e.target != profilePic && e.target != chatIcon) {
        dropDown.style.display = 'none'
    } else if (e.target == profilePic) {
        handleDropDown('profilePic', profilePicView)
        dropDown.style.height = '60px'
    } else if (e.target == chatIcon) {
        const chats = await get('chats')
        dropDown.style.height = chats.length * 40 + 30 + 'px'
        handleDropDown('chatView', chatIconView, chats)
    }
})

dropDown.addEventListener('click', async e => {
    if (e.target.tagName != 'A' || dropDown.children[0] == e.target) return
    if (currentViewName == 'chatView') {
        e.preventDefault()
        await appendChatBox(e.target.id)
    }
})

socket.on('chat message', async ({ text, chatId, ownerId, createdOn }) => {
    let chatUl = document.getElementById(chatId + '-chat')
    if (!chatUl) {
        await appendChatBox(chatId)
        chatUl = document.getElementById(chatId + '-chat')
    } else {
        chatUl.innerHTML += chatBoxLiView({ text, ownerId, createdOn }, userId)
        chatUl.scrollTo(0, chatUl.scrollHeight);
    }
});

function handleDropDown(name, viewCallBack, ...params) {
    if (dropDown.style.display != 'block' || currentViewName != name) {
        dropDown.style.display = 'block'
        dropDown.innerHTML = viewCallBack(...params)
        currentViewName = name
    } else if (currentViewName == name) dropDown.style.display = 'none'
}

async function appendChatBox(chatId) {
    let chatUl = document.getElementById(chatId + '-chat')
    const chat = await get(`chats/${chatId}`)
    if (chatUl || !chat) return
    const chatBoxDiv = document.createElement('div')
    chatBoxDiv.className = 'chatBox'

    chatBoxDiv.style.right = `${openChatBoxes.length * 320 + 100}px`
    openChatBoxes.push(chatBoxDiv)
    if (openChatBoxes.length > 4) {
        removeChatBox(0)
    }

    setTimeout(() => {
        chatBoxDiv.innerHTML = chatBoxView(chat, userId)
        document.body.appendChild(chatBoxDiv)
        chatUl = chatBoxDiv.children[1]
        chatUl.scrollTo(0, chatUl.scrollHeight);
    }, 300)
}

export function onMessageSubmit(e) {
    e.preventDefault();
    const text = Object.fromEntries((new FormData(e.target)).entries()).text
    if (text) {
        socket.emit('chat message', text, getChatIdFromChatBox(e.target));
        e.target.reset()
    }
}

export function onMessageKeyUp(e) {
    const chatSubmit = document.querySelector('.chatForm > button');
    if (e.target.value) chatSubmit.disabled = false
    else chatSubmit.disabled = true
}

export function onCloseMsgBox(e) {
    e.target.parentElement.remove()
    const boxId = openChatBoxes.indexOf(e.target.parentElement)
    removeChatBox(boxId)
}

function removeChatBox(boxId) {
    openChatBoxes.splice(boxId, 1)[0].remove()
    openChatBoxes.slice(boxId).forEach(box => {
        setTimeout(() => { box.style.right = (Number(box.style.right.slice(0, -2)) - 320) + 'px' }, 300)
    });
}

function getChatIdFromChatBox(element) {
    return element.parentElement.children[1].id.split('-')[0]
}