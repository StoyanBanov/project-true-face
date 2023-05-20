import { profilePicView, chatIconView, chatIconViewLi, chatBoxView, chatBoxLiView, chatBoxSettingsView } from "/static/views.js"
import { postsView } from "/static/profileViews.js"
import { get } from "/static/scripts/api.js"

const userId = await get('profile/current-user?select=_id')
const socket = io('/', { query: `userId=${userId}` });

const postsUl = document.querySelector('.homePosts')
const profilePic = document.getElementById('profilePic')
const chatIcon = document.getElementById('chatIcon')
const dropDown = document.getElementById('dropDown')
let currentViewName
let isLoadingChats = false
let isLoadingPosts = false
let openChatBoxes = []
let chatSkip = 0
let postsSkip = 1
window.addEventListener('click', async (e) => {
    if (dropDown.style.display == 'flex' && e.target != dropDown && e.target != profilePic && e.target != chatIcon) {
        dropDown.style.display = 'none'
    } else if (e.target == profilePic) {
        handleDropDown('profilePic', profilePicView)
        dropDown.style.height = '60px'
    } else if (e.target == chatIcon) {
        chatSkip = 0
        const chats = await get('chats?skip=' + chatSkip++)
        if (chats.length * 34 + 33 < window.innerHeight) dropDown.style.height = chats.length * 34 + 33 + 'px'
        else dropDown.style.height = window.innerHeight - 100 + 'px'
        handleDropDown('chatView', chatIconView, chats)
    }
})

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
        chatSkip = 0
    }
}

async function appendChatBox(chatId) {
    let chatUl = document.getElementById(chatId + '-chat')
    const [chat, messages] = await Promise.all([get(`chats/${chatId}`), get(`chats/${chatId}/messages?lastMessageId=-1`)])
    if (chatUl || !chat) return
    const chatBoxDiv = document.createElement('div')
    chatBoxDiv.className = 'chatBox'

    chatBoxDiv.style.right = `${openChatBoxes.length * 320 + 100}px`
    openChatBoxes.push(chatBoxDiv)
    if (openChatBoxes.length > 4) {
        removeChatBox(0)
    }

    setTimeout(() => {
        chatBoxDiv.innerHTML = chatBoxView(chat, messages, userId)
        document.body.appendChild(chatBoxDiv)
        chatUl = chatBoxDiv.querySelector('ul')
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
    const chatSubmit = e.target.parentElement.querySelector('button');
    if (e.target.value) chatSubmit.disabled = false
    else chatSubmit.disabled = true
}

window.onCloseMsgBox = e => {
    const chatBox = e.currentTarget.parentElement.parentElement
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
    const chatBox = e.currentTarget.parentElement.parentElement
    if (!chatBox.firstChild.innerHTML) {
        const chat = await get('chats/' + chatBox.querySelector('ul').id.slice(0, -5))
        chatBox.firstChild.innerHTML = chatBoxSettingsView(chat, userId)
        chatBox.style.height = chatBox.offsetHeight + chatBox.firstChild.offsetHeight + 'px'
    } else {
        chatBox.style.height = chatBox.offsetHeight - chatBox.firstChild.offsetHeight + 'px'
        chatBox.firstChild.innerHTML = ''
    }
}

window.onSetChatName = async e => {

}

window.onSetChatTheme = async e => {

}

function removeChatBox(boxId) {
    openChatBoxes.splice(boxId, 1)[0].remove()
    openChatBoxes.slice(boxId).forEach(box => {
        setTimeout(() => { box.style.right = (Number(box.style.right.slice(0, -2)) - 320) + 'px' }, 300)
    });
}

function getChatIdFromChatBox(element) {
    return element.parentElement.querySelector('ul').id.split('-')[0]
}