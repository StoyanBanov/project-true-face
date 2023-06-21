import { put } from "/static/scripts/api.js"
import { scrollWindow, loadDataOnWindow } from "/static/scripts/scrollWindowUtil.js"
import { handlePostAction } from "/static/scripts/postActionsUtil.js"

const list = document.getElementById('profileList')
const listOptions = document.getElementById('profileListOptions')

const profilePicFromInput = document.getElementById('profilePicFromInput')

document.getElementById('profilePicInput').addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
        let fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.addEventListener('load', () => {
            document.getElementById('profilePicFromInput').src = fileReader.result
        })
    }
})

profilePicFromInput.addEventListener('click', e => {
    //TODO
})

scrollWindow(list, 'showPosts', 1)

listOptions.addEventListener('click', async e => {
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
    } else {
        await handlePostAction(e.target)
    }
})