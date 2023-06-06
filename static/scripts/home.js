import { commentLiView } from "/static/views.js"
import { post } from "/static/scripts/api.js"
import { handleSubmit } from "/static/scripts/util.js"
import { scrollWindow } from "/static/scripts/scrollWindowUtil.js"
import { handlePostAction } from "/static/scripts/postActionsUtil.js"

const postsUl = document.querySelector('.homePosts')
scrollWindow(postsUl, 'showHomePosts', 1)

postsUl.addEventListener('click', async e => {
    if (e.target.tagName != 'A' || e.target.id == 'postUsername') return
    e.preventDefault()
    await handlePostAction(e.target)
})

export const onPostComment = handleSubmit(onComment)

async function onComment({ text }, e) {
    const id = e.target.parentElement.parentElement.parentElement.id
    const comment = await post('posts/comments', (e.target.parentElement.parentElement.parentElement.querySelector('.postActions') ? { text, postId: id } : { text, commentId: id }))
    const commentLi = document.createElement('li')
    commentLi.innerHTML = commentLiView(comment)
    e.target.parentElement.parentElement.querySelector('ul').prepend(commentLi)
    const commentA = document.createElement('a')
    commentA.href = 'javascript:void(0)'
    commentA.textContent = 'Comment'
    e.target.parentElement.parentElement.replaceChild(commentA, e.target.parentElement)
}