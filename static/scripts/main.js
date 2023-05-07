import { profilePicView, chatIconView, chatBoxView } from "/static/views.js"
import { get } from "/static/scripts/api.js"

const userId = Object.fromEntries(document.cookie.split('; ').map(c => c.split('='))).userId
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

socket.on('chat message', async (text, chatId) => {
    const messageLi = document.createElement('li');
    messageLi.textContent = text;
    let chatUl = document.getElementById(chatId + '-chat')
    if (!chatUl) {
        await appendChatBox(chatId)
        chatUl = document.getElementById(chatId + '-chat')
    }
    chatUl.appendChild(messageLi);
    chatUl.scrollTo(0, chatUl.scrollHeight);
});

async function handleDropDown(name, viewCallBack, ...params) {
    if (dropDown.style.display != 'block' || currentViewName != name) {
        dropDown.style.display = 'block'
        dropDown.innerHTML = await viewCallBack(...params)
        currentViewName = name
    } else if (currentViewName == name) dropDown.style.display = 'none'
}

async function appendChatBox(chatId) {
    const chatBoxDiv = document.createElement('div')
    chatBoxDiv.className = 'chatBox'

    const chat = await get(`chats/${chatId}`)
    chatBoxDiv.style.right = `${openChatBoxes++ * 320 + 100}px`

    chatBoxDiv.innerHTML = await chatBoxView(chat)
    document.body.appendChild(chatBoxDiv)

    const chatForm = document.querySelector('.chatForm');
    const chatInput = document.querySelector('.chatInput');
    const chatSubmit = document.querySelector('.chatForm > button');

    chatInput.addEventListener('keypress', e => {
        if (e.target.value) chatSubmit.disabled = false
        else chatSubmit.disabled = true
    })

    chatForm.addEventListener('submit', e => {
        e.preventDefault();
        if (chatInput.value) {
            socket.emit('chat message', chatInput.value, e.target.parentElement.children[0].id.split('-')[0]);
            chatInput.value = '';
        }
    });
}