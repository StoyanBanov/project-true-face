import { postsView } from "/static/profileViews.js"
import { get, put } from "/static/scripts/api.js"

const profileBox = document.querySelector('.profileBox')
const profileId = profileBox.id
const list = profileBox.querySelector('ul')
let currentListOption = 'showPosts'
let isAddingMoreData = false
let skip = 1

profileBox.addEventListener('click', async e => {
    if (e.target.tagName != 'A') return
    const btnName = e.target.textContent.trim()
    if (['Accept', 'Remove', 'Undo request', 'Request'].includes(btnName)) {
        await put(`people/${btnName.replace(' ', '-').toLocaleLowerCase()}-friend`, { friendId: profileId })
        window.location.reload()
    } else if (e.target.textContent == 'Posts' && currentListOption != 'showPosts') {
        currentListOption = 'showPosts'
        skip = 0
        const posts = await get(`profile/user-posts?skip=${skip}&userId=${profileId}`)
        posts.push(...posts)
        posts.push(...posts)
        list.innerHTML = postsView(posts)
    } else currentListOption = ''
})

addEventListener('scroll', async e => {
    if (list.getBoundingClientRect().bottom < window.innerHeight && !isAddingMoreData) {
        isAddingMoreData = true
        if (currentListOption == 'showPosts') {
            const posts = await get(`profile/user-posts?skip=${skip++}&userId=${profileId}`)
            list.innerHTML += postsView(posts)
        }
        isAddingMoreData = false
    }
})