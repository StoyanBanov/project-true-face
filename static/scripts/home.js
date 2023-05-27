import { commentsView, createCommentView, commentLiView } from "/static/views.js"
import { get, put, post, del } from "/static/scripts/api.js"
import { handleSubmit } from "/static/scripts/util.js"
import { postsView } from "/static/profileViews.js"

const postsUl = document.querySelector('.homePosts')
let postsSkip = 1
let isLoadingPosts = false

document.querySelector('.homePosts').addEventListener('click', async e => {
    if (e.target.tagName != 'A' || e.target.id == 'postUsername') return
    e.preventDefault()
    let postDiv = e.target.parentElement.parentElement
    let id = postDiv.id
    if (e.target.textContent == 'Like') {
        await put('posts/like', e.target.parentElement.className == 'commentActions' ? { commentId: id, type: 'thumb' } : { postId: id, type: 'thumb' })
        e.target.parentElement.querySelector('p').textContent = Number(e.target.parentElement.querySelector('p').textContent) + 1
        e.target.textContent = 'Liked'
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
    } else if (e.target.textContent == 'Liked') {
        await put('posts/removeLike', e.target.parentElement.className == 'commentActions' ? { commentId: id } : { postId: id })
        e.target.parentElement.querySelector('p').textContent = Number(e.target.parentElement.querySelector('p').textContent) - 1
        e.target.textContent = 'Like'
    } else if (e.target.textContent == 'Delete') {
        await del(`posts?${e.target.parentElement.className == 'commentActions' ? `commentId` : `postId`}=${id}`)
        e.target.parentElement.parentElement.parentElement.remove()
    }
})


//Todo: Use scrollUtil
addEventListener('scroll', async e => {
    if (postsUl && postsUl.getBoundingClientRect().bottom < innerHeight && !isLoadingPosts) {
        isLoadingPosts = true
        const posts = await get('all-posts?skip=' + postsSkip++)
        postsUl.innerHTML += postsView(posts)
        isLoadingPosts = false
    }
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