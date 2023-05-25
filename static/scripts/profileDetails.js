import { get, put } from "/static/scripts/api.js"

document.querySelector('.profileBox').addEventListener('click', async e => {
    if (e.target.tagName != 'A') return
    const profileId = e.currentTarget.id
    const btnName = e.target.textContent.trim()
    if (['Accept', 'Remove', 'Undo request', 'Request'].includes(btnName)) {
        await put(`people/${btnName.replace(' ', '-').toLocaleLowerCase()}-friend`, { friendId: profileId })
    }
    window.location.reload()
})