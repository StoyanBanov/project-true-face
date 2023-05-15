import { createUserCards } from "/static/scripts/util.js"
import { get, put } from "/static/scripts/api.js"
const usersList = document.getElementById('usersList')
let skip = 1
let users = []

window.addEventListener('scroll', async e => {
    if (usersList.children[usersList.children.length - 1].getBoundingClientRect().bottom - window.innerHeight <= 0) {
        getUsers()
    }
})

usersList.addEventListener('click', async e => {
    if (e.target.tagName != 'A') return
    const li = e.target.parentElement
    e.target.remove()
    if (e.target.textContent == 'Add') {
        await put('people/request-friend', { friendId: li.id })
        li.innerHTML += `<p>Friendship requested</p>`
    } else if (e.target.textContent == 'Accept') {
        await put('people/accept-friend', { friendId: li.id })
        li.innerHTML += `<p>friends</p>`
    }
})

async function getUsers() {
    users = await get('people/' + skip++)
    usersList.append(...createUserCards(users))
    console.log(skip);
}