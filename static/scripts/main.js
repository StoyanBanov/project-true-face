import { profilePicView, chatIconView, chatIconViewLi, chatBoxView, chatBoxLiView, chatBoxSettingsView } from "/static/views.js"
import { postsView } from "/static/profileViews.js"
import { get, put, del } from "/static/scripts/api.js"

const userId = await get('profile/current-user?select=_id')
const socket = io('/', { query: `userId=${userId}` });

const postsUl = document.querySelector('.homePosts')
const profilePic = document.getElementById('profilePic')
const chatIcon = document.querySelector('#chatIcon svg')
const chatIconPath = document.querySelector('#chatIcon path')
const dropDown = document.getElementById('dropDown')
let currentViewName
let isLoadingChats = false
let isLoadingPosts = false
let openChatBoxes = []
let chatSkip = 0
let postsSkip = 1
window.addEventListener('click', async (e) => {
    if (dropDown.style.display == 'flex' && e.target != dropDown && e.target != profilePic && e.target != chatIcon && e.target != chatIconPath) {
        dropDown.style.display = 'none'
    } else if (e.target == profilePic) {
        handleDropDown('profilePic', profilePicView)
    } else if (e.target == chatIcon || e.target == chatIconPath) {
        chatSkip = 0
        const chats = await get('chats?skip=' + chatSkip++)
        handleDropDown('chatView', chatIconView, chats)
    }
},)

addEventListener('scroll', async e => {
    if (postsUl.getBoundingClientRect().bottom < innerHeight && !isLoadingPosts) {
        isLoadingPosts = true
        const posts = await get('all-posts?skip=' + postsSkip++)
        postsUl.innerHTML += postsView(posts)
        isLoadingPosts = false
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
        const chatSettings = await get(`chats/${chatId}/settings`)
        if (!chatSettings.mutedUserIds.includes(userId)) await appendChatBox(chatId)
    } else {
        chatUl.innerHTML += chatBoxLiView({ text, ownerId, createdOn }, userId)
        chatUl.scrollTo(0, chatUl.scrollHeight);
    }
});

function handleDropDown(name, viewCallBack, ...params) {
    if (dropDown.style.display != 'flex' || currentViewName != name) {
        dropDown.style.display = 'flex'
        dropDown.innerHTML = viewCallBack(...params)
        if (name == 'chatView') {
            const liHeight = dropDown.querySelector('ul').children[0].offsetHeight
            const lisCount = dropDown.querySelector('ul').children.length
            if (liHeight * lisCount + 33 < window.innerHeight) dropDown.style.height = liHeight * lisCount + 33 + 'px'
            else dropDown.style.height = window.innerHeight - 100 + 'px'
        } else if (name == 'profilePic') dropDown.style.height = '60px'

        currentViewName = name
    } else if (currentViewName == name) {
        dropDown.style.display = 'none'
        chatSkip = 0
    }
}

async function appendChatBox(chatId) {
    let chatUl = document.getElementById(chatId + '-chat')
    const [chat, messages] = await Promise.all([get(`chats/${chatId}`), get(`chats/${chatId}/messages?lastMessageId=-1`)])
    if (chatUl || !chat) return

    if (openChatBoxes.length == 4) {
        removeChatBox(0)
    }

    setTimeout(() => {
        document.body.querySelector('#chats').innerHTML += chatBoxView(chat, messages, userId, openChatBoxes.length * 320 + 100)
        const chatBoxDiv = document.getElementById(chatId + '-box')
        openChatBoxes.push(chatBoxDiv)
        chatUl = chatBoxDiv.querySelector('ul')
        chatUl.scrollTo(0, chatUl.scrollHeight);
    }, 300)
}

window.onMessageSubmit = e => {
    e.preventDefault();
    const text = Object.fromEntries((new FormData(e.target)).entries()).text
    if (text) {
        socket.emit('chat message', text, e.target.getAttribute('chat-id'));
        e.target.reset()
    }
}

window.onMessageKeyUp = e => {
    const chatSubmit = e.target.parentElement.querySelector('button');
    if (e.target.value) chatSubmit.disabled = false
    else chatSubmit.disabled = true
}

window.onCloseMsgBox = e => {
    const chatId = e.currentTarget.getAttribute('chat-id')
    const chatBox = document.getElementById(chatId + '-box')
    chatBox.remove()
    removeChatBox(openChatBoxes.indexOf(chatBox))
}

window.onChatDropScroll = async e => {
    if (e.target.lastChild.getBoundingClientRect().bottom + window.pageYOffset == e.target.getBoundingClientRect().bottom + window.pageYOffset
        && !isLoadingChats) {
        isLoadingChats = true
        const chats = await get('chats?skip=' + chatSkip++)
        if (chats) e.target.innerHTML += chats.map(chatIconViewLi).join('\n')
        isLoadingChats = false
    }
}

window.onChatBoxScroll = async e => {
    const chatId = e.target.id.slice(0, -5)
    const firstLi = e.target.firstChild
    if (e.target.getBoundingClientRect().top == firstLi.getBoundingClientRect().top) {
        const messages = await get(`chats/${chatId}/messages?lastMessageId=${firstLi.id}`)
        if (messages.length > 0) {
            e.target.innerHTML = messages.reverse().map(m => chatBoxLiView(m, userId)).join('\n') + e.target.innerHTML
            e.target.scrollTo({
                top: Array.from(e.target.children).slice(0, messages.length).reduce((totalHeight, li) => totalHeight + li.offsetHeight, 0),
                left: 0,
                behavior: "instant",
            });
        }
    }
}

window.onClickChatSettings = async e => {
    const chatId = e.currentTarget.getAttribute('chat-id')
    const chatBox = document.getElementById(chatId + '-box')
    const settingsDiv = chatBox.querySelector('.chatSettings')
    if (!settingsDiv.innerHTML) {
        const chat = await get('chats/' + chatId)
        settingsDiv.innerHTML = chatBoxSettingsView(chat, userId)
        chatBox.style.height = chatBox.offsetHeight + settingsDiv.offsetHeight + 'px'
    } else {
        chatBox.style.height = chatBox.offsetHeight - settingsDiv.offsetHeight + 'px'
        settingsDiv.innerHTML = ''
    }
}

window.onSetChatName = async e => {
    const chatId = e.currentTarget.getAttribute('chat-id')
    await put(`chats/${chatId}`, { name: e.currentTarget.parentElement.querySelector('input').value })
}

window.onSetChatTheme = async e => {
    const theme = e.currentTarget.parentElement.querySelector('select').value
    const chatId = e.currentTarget.getAttribute('chat-id')
    await put(`chats/${chatId}/settings`, { theme })
    setChatClassesForTheme(theme, document.getElementById(chatId + '-box'))
}

window.onMuteChat = async e => {
    await put(`chats/${e.currentTarget.getAttribute('chat-id')}/settings`, { mutedId: userId })
    e.target.textContent = e.target.textContent == 'mute' ? 'unmute' : 'mute'
}

window.onDeleteChat = async e => {
    const chatId = e.target.getAttribute('chat-id')
    removeChatBox(document.getElementById(chatId + '-box'))
    await del('chats/' + chatId)
}

function removeChatBox(boxId) {
    openChatBoxes.splice(boxId, 1)[0].remove()
    openChatBoxes.slice(boxId).forEach(box => {
        setTimeout(() => { box.style.right = (Number(box.style.right.slice(0, -2)) - 320) + 'px' }, 300)
    });
}

function setChatClassesForTheme(theme, chatBox) {
    if (theme == 'dark') {
        chatBox.classList.add('chatDark')
        Array.from(chatBox.querySelectorAll('circle')).forEach(c => { c.style.fill = 'white' })
        Array.from(chatBox.querySelectorAll('line')).forEach(c => { c.style.stroke = 'white' })
    } else {
        chatBox.classList.remove('chatDark')
        Array.from(chatBox.querySelectorAll('circle')).forEach(c => { c.style.fill = 'gray' })
        Array.from(chatBox.querySelectorAll('.chatTopBar line')).forEach(c => { c.style.stroke = 'red' })
        Array.from(chatBox.querySelectorAll('.chatSettings line')).forEach(c => { c.style.stroke = 'green' })
    }
}