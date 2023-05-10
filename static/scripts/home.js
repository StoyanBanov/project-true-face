import { commentsView, createCommentView, commentLiView } from "/static/views.js"
import { get, put, post } from "/static/scripts/api.js"
import { handleSubmit } from "/static/scripts/util.js"

document.querySelector('.homePosts').addEventListener('click', async e => {
    if (e.target.tagName != 'A') return
    e.preventDefault()
    const postDiv = e.target.parentElement.parentElement
    const postId = postDiv.id
    if (e.target.textContent == 'Like') {
        await put('posts/likePost', { postId, type: 'thumb' })
        const likedP = document.createElement('p')
        likedP.textContent = 'Liked'
        postDiv.replaceChild(likedP, e.target)
    } else if (e.target.textContent == 'Comments') {
        const commentsDiv = postDiv.querySelector('.commentsBox')
        if (commentsDiv) {
            commentsDiv.remove()
            return
        }
        const { commentIds: comments } = await get(`posts/comments?postId=${postId}`)
        console.log(comments);
        postDiv.innerHTML += commentsView(comments)
    } else if (['Comment', 'Be the first to comment'].includes(e.target.textContent)) {
        const addCommentDiv = document.createElement('div')
        addCommentDiv.innerHTML = createCommentView()
        e.target.parentElement.replaceChild(addCommentDiv, e.target)
    }
})

export const onPostComment = handleSubmit(onComment)

async function onComment({ text }, e) {
    const comment = await post('posts/comments', { text, postId: e.target.parentElement.parentElement.parentElement.id })
    const commentLi = document.createElement('li')
    commentLi.innerHTML = commentLiView(comment)
    e.target.parentElement.parentElement.querySelector('ul').prepend(commentLi)
    const commentA = document.createElement('a')
    commentA.href = 'javascript:void(0)'
    commentA.textContent = 'Comment'
    e.target.parentElement.parentElement.replaceChild(commentA, e.target.parentElement)
}