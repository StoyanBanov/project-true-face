import { get } from "/static/scripts/api.js"
const usersList = document.getElementById('usersList')
let skip = 1
let scrolledCount = 0
let scrollYPrev = 0

window.addEventListener('scroll', async e => {
    if (scrollYPrev < window.scrollY) {
        scrolledCount++
        scrollYPrev = window.scrollY
        if (scrolledCount % 45 == 0) {
            getUsers()
        }
    }
})

function createUserCards(users) {
    const userLis = users.map(user => {
        const li = document.createElement('li')
        li.innerHTML = `<div>
    <img width="100" height="100" src="/static/images/${user.profilePic ? `${user.profilePic}` : 'profile.png'}">
    <h2>{{username}}</h2>
    ${user.isFriend ? `<p>friends</p>` : `<a href="/add-friend/${user._id}">Add friend</a>`}
    <p>${user.friendsCount} friends</p>
</div>`
        return li
    });
    return userLis
}

async function getUsers() {
    const users = await get('people/' + skip)
    usersList.append(...createUserCards(users))
    skip++
}