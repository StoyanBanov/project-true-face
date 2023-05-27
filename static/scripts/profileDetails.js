import { scrollWindow, scrollProps } from "/static/scripts/scrollWindowUtil.js"
import { postsView } from "/static/profileViews.js"
import { get, put } from "/static/scripts/api.js"

const profileBox = document.querySelector('.profileBox')
const profileId = profileBox.id
const list = profileBox.querySelector('ul')

scrollProps.skip = 1
scrollProps.currentListOption = 'showPosts'
scrollWindow(list, profileId)

profileBox.addEventListener('click', async e => {
    if (e.target.tagName != 'A') return
    const btnName = e.target.textContent.trim()
    if (['Accept', 'Remove', 'Undo request', 'Request'].includes(btnName)) {
        await put(`people/${btnName.replace(' ', '-').toLocaleLowerCase()}-friend`, { friendId: profileId })
        window.location.reload()
    } else if (e.target.textContent == 'Posts' && scrollProps.currentListOption != 'showPosts') {
        scrollProps.currentListOption = 'showPosts'
        scrollProps.skip = 0
        const posts = await get(`profile/user-posts?skip=${scrollProps.skip}&userId=${profileId}`)
        list.innerHTML = postsView(posts)
    } else scrollProps.currentListOption = ''
})