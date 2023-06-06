import { commentsView, createCommentView } from "/static/views.js"
import { get, put, del } from "/static/scripts/api.js"

export async function handlePostAction(clickedOn) {
    let postDiv = clickedOn.parentElement.parentElement
    let id = postDiv.id
    if (clickedOn.textContent == 'Like') {
        await put('posts/like', clickedOn.parentElement.className == 'commentActions' ? { commentId: id, type: 'thumb' } : { postId: id, type: 'thumb' })
        clickedOn.parentElement.querySelector('p').textContent = Number(clickedOn.parentElement.querySelector('p').textContent) + 1
        clickedOn.textContent = 'Liked'
    } else if (clickedOn.textContent == 'Comments') {
        const commentsDiv = postDiv.querySelector('.commentsBox')
        if (commentsDiv) {
            commentsDiv.remove()
            return
        }
        let comments = await get(`posts/comments?${clickedOn.parentElement.className == 'commentActions' ? 'commentId' : 'postId'}=${id}`)
        postDiv.innerHTML += commentsView(comments)
    } else if (['Comment', 'Be the first to comment'].includes(clickedOn.textContent)) {
        const addCommentDiv = document.createElement('div')
        addCommentDiv.innerHTML = createCommentView()
        clickedOn.parentElement.replaceChild(addCommentDiv, clickedOn)
    } else if (clickedOn.textContent == 'Liked') {
        await put('posts/removeLike', clickedOn.parentElement.className == 'commentActions' ? { commentId: id } : { postId: id })
        clickedOn.parentElement.querySelector('p').textContent = Number(clickedOn.parentElement.querySelector('p').textContent) - 1
        clickedOn.textContent = 'Like'
    } else if (clickedOn.textContent == 'Delete') {
        await del(`posts?${clickedOn.parentElement.className == 'commentActions' ? `commentId` : `postId`}=${id}`)
        clickedOn.parentElement.parentElement.parentElement.remove()
    }
}