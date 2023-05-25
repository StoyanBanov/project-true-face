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
    if (e.target.textContent == 'Add') {
        await put('people/request-friend', { friendId: li.id })
        e.target.textContent = 'Undo request'
    } else if (e.target.textContent == 'Accept') {
        await put('people/accept-friend', { friendId: li.id })
        e.target.textContent = 'Unfriend'
    } else if (e.target.textContent == 'Remove') {
        if (window.confirm('Are you sure?')) {
            await put('people/remove-friend', { friendId: li.id })
            e.target.textContent = 'Add'
        }
    }
})

async function getUsers() {
    users = await get('people/' + skip++)
    usersList.append(...createUserCards(users))
    console.log(skip);
}