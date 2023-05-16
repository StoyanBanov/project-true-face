import { friendsView, postsView } from "/static/profileViews.js"
import { get, put } from "/static/scripts/api.js"

//const showRequestsA = document.getElementById('showRequests')
const list = document.getElementById('profileList')
const listOptions = document.getElementById('profileListOptions')
let currentListOption = 'showPosts'
let skip = 1
let isAddingMoreData = false

listOptions.addEventListener('click', async e => {
    if (list.style.display != 'block') list.style.display = 'block'
    if (e.target.id == currentListOption) return
    skip = 0
    if (e.target.id == 'showRequests') {
        const friendRequests = await get('people/request-friend?skip=' + skip++)
        list.innerHTML = friendRequests.length > 0 ? friendsView(friendRequests) : list.innerHTML = `<li><p>No requests</p></li>`
    } else if (e.target.id == 'showFriends') {
        const friends = await get('people/friends?skip=' + skip++)
        list.innerHTML = friends.length > 0 ? friendsView(friends) : list.innerHTML = `<li><p>No friends</p></li>`
    } else if (e.target.id == 'showPosts') {
        const posts = await get('profile/my-posts?skip=' + skip++)
        list.innerHTML = posts.length > 0 ? postsView(posts) : list.innerHTML = `<li><p>You haven\'t posted yet</p></li>`
    }
    currentListOption = e.target.id
})

addEventListener('scroll', async e => {
    if (list.getBoundingClientRect().bottom < window.innerHeight && !isAddingMoreData) {
        isAddingMoreData = true
        if (currentListOption == 'showRequests') {
            const friendRequests = await get('people/request-friend?skip=' + skip++)
            list.innerHTML += friendsView(friendRequests)
        } else if (currentListOption == 'showFriends') {
            const friends = await get('people/friends?skip=' + skip++)
            list.innerHTML += friendsView(friends)
        } else if (currentListOption == 'showPosts') {
            const posts = await get('profile/my-posts?skip=' + skip++)
            list.innerHTML += postsView(posts)
        }
        isAddingMoreData = false
    }
})

list.addEventListener('click', async e => {
    if (e.target.tagName != 'A') return
    if (e.target.textContent == 'Add') {
        const li = e.target.parentElement
        await put('people/accept-friend', { friendId: li.id })
        li.remove()
    }
})