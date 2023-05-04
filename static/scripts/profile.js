import { get, put } from "/static/scripts/api.js"
import { createUserCards } from "/static/scripts/util.js"

const showRequestsA = document.getElementById('showRequests')
const friendRequestsUl = document.getElementById('friendRequests')
showRequestsA.addEventListener('click', async e => {
    friendRequestsUl.style.display = 'block'
    const friendRequests = await get('people/request-friend')
    if (friendRequests.length > 0) friendRequestsUl.replaceChildren(...createUserCards(friendRequests))
    else friendRequestsUl.innerHTML = `<li><p>No requests</p></li>`
})

friendRequestsUl.addEventListener('click', async e => {
    if (e.target.tagName != 'A') return
    const li = e.target.parentElement
    await put('people/accept-friend', { friendId: li.id })
    li.remove()
})