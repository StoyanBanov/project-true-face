import { commentsView, createCommentView, commentLiView } from "/static/views.js"
import { get, put, post } from "/static/scripts/api.js"
import { handleSubmit } from "/static/scripts/util.js"

document.querySelector('.homePosts').addEventListener('click', async e => {
    if (e.target.tagName != 'A') return
    e.preventDefault()
    let postDiv = e.target.parentElement.parentElement
    let id = postDiv.id
    if (e.target.textContent == 'Like') {
        if (e.target.parentElement.className == 'commentActions') {
            await put('posts/comments/like', { commentId: id, type: 'thumb' })
        } else {
            await put('posts/likePost', { postId: id, type: 'thumb' })
        }
        e.target.parentElement.querySelector('p').textContent = Number(e.target.parentElement.querySelector('p').textContent) + 1
        const likedP = document.createElement('p')
        likedP.textContent = 'Liked'
        e.target.parentElement.replaceChild(likedP, e.target)
    } else if (e.target.textContent == 'Comments') {
        const commentsDiv = postDiv.querySelector('.commentsBox')
        if (commentsDiv) {
            commentsDiv.remove()
            return
        }
        let comments = await get(`posts/comments?${e.target.parentElement.className == 'commentActions' ? 'commentId' : 'postId'}=${id}`)
        postDiv.innerHTML += commentsView(comments)
    } else if (['Comment', 'Be the first to comment'].includes(e.target.textContent)) {
        const addCommentDiv = document.createElement('div')
        addCommentDiv.innerHTML = createCommentView()
        e.target.parentElement.replaceChild(addCommentDiv, e.target)
    }
})

export const onPostComment = handleSubmit(onComment)

async function onComment({ text }, e) {
    const id = e.target.parentElement.parentElement.parentElement.id
    const comment = await post('posts/comments', (e.target.parentElement.parentElement.parentElement.querySelector('.postActions') ? { text, postId: id } : { text, commentId: id }))
    const commentLi = document.createElement('li')
    commentLi.innerHTML = commentLiView(comment)
    console.log(comment);
    e.target.parentElement.parentElement.querySelector('ul').prepend(commentLi)
    const commentA = document.createElement('a')
    commentA.href = 'javascript:void(0)'
    commentA.textContent = 'Comment'
    e.target.parentElement.parentElement.replaceChild(commentA, e.target.parentElement)
}