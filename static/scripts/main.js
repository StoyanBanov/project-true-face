import { profilePicView, chatIconView, chatIconViewLi, chatBoxView, chatBoxLiView } from "/static/views.js"
import { get } from "/static/scripts/api.js"

const userId = await get('profile/current-user?select=_id')
const socket = io('/', { query: `userId=${userId}` });

const profilePic = document.getElementById('profilePic')
const chatIcon = document.getElementById('chatIcon')
const dropDown = document.getElementById('dropDown')
let currentViewName
let openChatBoxes = []
let skip = 0
window.addEventListener('click', async (e) => {
    if (dropDown.style.display == 'flex' && e.target != dropDown && e.target != profilePic && e.target != chatIcon) {
        dropDown.style.display = 'none'
        skip = 0
    } else if (e.target == profilePic) {
        handleDropDown('profilePic', profilePicView)
        dropDown.style.height = '60px'
    } else if (e.target == chatIcon) {
        const chats = await get('chats/' + skip++)
        if (chats.length * 34 + 33 < window.innerHeight) dropDown.style.height = chats.length * 34 + 33 + 'px'
        else dropDown.style.height = window.innerHeight - 100 + 'px'
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
    if (dropDown.style.display != 'flex' || currentViewName != name) {
        dropDown.style.display = 'flex'
        dropDown.innerHTML = viewCallBack(...params)
        currentViewName = name
    } else if (currentViewName == name) {
        dropDown.style.display = 'none'
        skip = 0
    }
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

window.onMessageSubmit = e => {
    e.preventDefault();
    const text = Object.fromEntries((new FormData(e.target)).entries()).text
    if (text) {
        socket.emit('chat message', text, getChatIdFromChatBox(e.target));
        e.target.reset()
    }
}

window.onMessageKeyUp = e => {
    const chatSubmit = document.querySelector('.chatForm > button');
    if (e.target.value) chatSubmit.disabled = false
    else chatSubmit.disabled = true
}

window.onCloseMsgBox = e => {
    e.target.parentElement.remove()
    const boxId = openChatBoxes.indexOf(e.target.parentElement)
    removeChatBox(boxId)
}

window.onChatDropScroll = async e => {
    if (e.target.children[e.target.children.length - 1].getBoundingClientRect().bottom + window.pageYOffset == e.target.getBoundingClientRect().bottom + window.pageYOffset) {
        const chats = await get('chats/' + skip++)
        e.target.innerHTML += chats.map(chatIconViewLi).join('\n')
    }
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