import { get } from "/static/scripts/api.js"
import { friendsView, postsView } from "/static/profileViews.js"

export const scrollProps = {
    currentListOption: '',
    skip: 1
}
let isAddingMoreData = false

export function scrollWindow(list, profileId) {
    addEventListener('scroll', async e => {
        if (list.getBoundingClientRect().bottom < window.innerHeight && !isAddingMoreData) {
            isAddingMoreData = true
            if (scrollProps.currentListOption == 'showRequests') {
                const friendRequests = await get('people/request-friend?skip=' + scrollProps.skip++)
                list.innerHTML += friendsView(friendRequests)
            } else if (scrollProps.currentListOption == 'showFriends') {
                const friends = await get(`people/friends?skip=${0}${profileId ? `&userId=${profileId}` : ''}`)
                list.innerHTML += friendsView(friends)
            } else if (scrollProps.currentListOption == 'showPosts') {
                const posts = await get(`profile/user-posts?skip=${scrollProps.skip++}${profileId ? `&userId=${profileId}` : ''}`)
                list.innerHTML += postsView(posts)
            }
            isAddingMoreData = false
        }
    })
}