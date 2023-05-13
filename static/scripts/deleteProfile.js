import { del } from "/static/scripts/api.js"

document.getElementById('delete').addEventListener('click', async e => {
    e.preventDefault()
    await del('profile')
    location.reload()
})