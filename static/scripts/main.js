const profilePic = document.getElementById('profilePic')
const profileDropDown = document.getElementById('profileDropDown')
document.querySelector('html').addEventListener('click', (e) => {
    if (profileDropDown.style.display != 'none' && profileDropDown.style.display != '' && e.target.parentElement != profileDropDown) hideProfileDrop(e)
    else if (e.target == profilePic) showProfileDrop(e)
})

function showProfileDrop(e) {
    e.preventDefault()
    profileDropDown.style.display = 'block'
}
function hideProfileDrop(e) {
    profileDropDown.style.display = 'none'
}