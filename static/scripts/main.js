import { profilePicView, chatIconView } from "/static/views.js"

const profilePic = document.getElementById('profilePic')
const chatIcon = document.getElementById('chatIcon')
const dropDown = document.getElementById('dropDown')
let currentViewName
window.addEventListener('click', async (e) => {
    if (dropDown.style.display == 'block' && e.target != dropDown && e.target != profilePic && e.target != chatIcon) {
        dropDown.style.display = 'none'
    } else if (e.target == profilePic) {
        handleDropDown('profilePic', profilePicView)
    } else if (e.target == chatIcon) {
        handleDropDown('chatView', chatIconView)
    }
})

async function handleDropDown(name, viewCallBack) {
    if (dropDown.style.display != 'block' || currentViewName != name) {
        dropDown.style.display = 'block'
        dropDown.innerHTML = await viewCallBack()
        currentViewName = name
    } else if (currentViewName == name) dropDown.style.display = 'none'
}