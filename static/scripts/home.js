import { put } from "/static/scripts/api.js"

document.querySelector('.homePosts').addEventListener('click', async e => {
    if (e.target.tagName != 'A') return
    if (e.target.textContent == 'Like') {
        const postDiv = e.target.parentElement
        const postId = postDiv.id
        await put('posts/likePost', { postId, type: 'thumb' })
        const likedP = document.createElement('p')
        likedP.textContent = 'Liked'
        postDiv.replaceChild(likedP, e.target)
    }
})