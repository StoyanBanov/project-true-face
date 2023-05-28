import { scrollWindow, scrollProps } from "/static/scripts/scrollWindowUtil.js"
import { postsView, friendsView } from "/static/profileViews.js"
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
    } else {
        scrollProps.skip = 0
        let url
        let view
        if (e.target.textContent == 'Posts' && scrollProps.currentListOption != 'showPosts') {
            url = 'profile/user-posts'
            view = postsView
        } else if (e.target.textContent == 'Friends' && scrollProps.currentListOption != 'showFriends') {
            url = 'people/friends'
            view = friendsView
        } else scrollProps.currentListOption = ''
        if (view) {
            const data = await get(url + `?skip=${scrollProps.skip++}&userId=${profileId}`)
            list.innerHTML = view(data)
            scrollProps.currentListOption = e.target.id
        }
    }
})