import { scrollWindow, loadDataOnWindow } from "/static/scripts/scrollWindowUtil.js"
import { put } from "/static/scripts/api.js"

const profileBox = document.querySelector('.profileBox')
const profileId = profileBox.id
const list = document.getElementById('profileList')

scrollWindow(list, 'showPosts', 1, profileId)

profileBox.addEventListener('click', async e => {
    if (e.target.tagName != 'A') return
    const btnName = e.target.textContent.trim()
    if (['Accept', 'Remove', 'Undo request', 'Request'].includes(btnName)) {
        await put(`people/${btnName.replace(' ', '-').toLocaleLowerCase()}-friend`, { friendId: profileId })
        window.location.reload()
    } else {
        await loadDataOnWindow(list, e.target.id, profileId)
    }
})