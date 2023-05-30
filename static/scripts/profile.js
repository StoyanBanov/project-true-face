import { put } from "/static/scripts/api.js"
import { scrollWindow, loadDataOnWindow } from "/static/scripts/scrollWindowUtil.js"

const list = document.getElementById('profileList')
const listOptions = document.getElementById('profileListOptions')

scrollWindow(list, 'showPosts', 1)

listOptions.addEventListener('click', async e => {
    if (list.style.display != 'block') list.style.display = 'block'
    if (e.target.id == scrollProps.currentListOption) return
    scrollProps.skip = 0
    await loadDataOnWindow(list, e.target.id)
})

list.addEventListener('click', async e => {
    if (e.target.tagName != 'A') return
    const li = e.target.parentElement
    if (e.target.textContent == 'Accept') {
        await put('people/accept-friend', { friendId: li.id })
        li.remove()
    } else if (e.target.textContent == 'Unfriend') {
        if (window.confirm('Are you sure?')) {
            await put('people/remove-friend', { friendId: li.id })
            li.remove()
        }
    }
})