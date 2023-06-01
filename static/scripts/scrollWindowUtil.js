import { get } from "/static/scripts/api.js"
import { friendsView, postsView } from "/static/profileViews.js"

let currentListOption
let skip

export function scrollWindow(list, listOptionInitial, skipInitial, profileId) {
    currentListOption = listOptionInitial
    setContainerClass(list, currentListOption)
    skip = skipInitial
    let isAddingMoreData = false
    addEventListener('scroll', async e => {
        if (list.getBoundingClientRect().bottom <= window.innerHeight && !isAddingMoreData) {
            isAddingMoreData = true
            await setUpDataAndView(list, profileId, true)
            isAddingMoreData = false
        }
    })
}

export async function loadDataOnWindow(list, btnId, profileId) {
    if (btnId == currentListOption) return
    currentListOption = btnId ?? currentListOption
    setContainerClass(list, currentListOption)
    skip = 0
    await setUpDataAndView(list, profileId, false)
}

async function setUpDataAndView(list, profileId, isScroll) {
    let url
    let view = currentListOption.includes('Post') ? postsView : friendsView
    if (currentListOption == 'showPosts') {
        url = 'profile/user-posts'
    } else if (currentListOption == 'showFriends') {
        url = 'people/friends'
    } else if (currentListOption == 'showRequests') {
        url = 'people/request-friend'
    } else if (currentListOption == 'showHomePosts') {
        url = 'all-posts'
    }
    if (view) {
        const data = await get(url + `?skip=${skip++}${profileId ? `&userId=${profileId}` : ''}`)
        if (!isScroll) list.innerHTML = data.length > 0 ? view(data) : `<li><p>Nothing to show</p></li>`
        else if (data.length > 0) list.innerHTML += view(data)
    }
}

function setContainerClass(container, listOption) {
    console.log(listOption);
    if (!listOption.includes('Post'))
        container.className = 'friendsContainer'
    else container.className = ''
}