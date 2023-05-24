export function friendsView(users) {
    return `${users.map(u => `<li id="${u._id}">
    <img width="100" height="100" src="/static/images/${u.profilePic ?? 'profile.png'}">
    <h2>${u.username}</h2>
    <p>${u.friendsCount} friends</p>
    ${u.isFriend ? `<a href="javascript:void(0)">Unfriend</a>` : u.isRequested ? `<a href="javascript:void(0)">Accept</a>` : `<a href="javascript:void(0)">Add</a>`}
    </li > `).join('\n')}`
}

export function postsView(posts) {
    return `${posts.map(p => `<li class="postCard" id="${p._id}">
    ${!p.isCurrentUserPost ? `<div>
        <img class="postProfilePic" width="50" height="50"
            src="/static/images/${p.ownerId.profilePic ?? profile.png}">
        <a id="postUsername" href="/profile/${p.ownerId._id}">${p.ownerId.username}</a>
    </div>` : ''}
    <p>${p.text}</p>
    ${p.images ? p.images.map(i => `<img width="500px" height="700px" src="/static/images/${i}">`).join('\n') : ''}
    <div class="postActions">
        <p>${p.likesCount}</p>
        ${p.isLiked ? `<a href="javascript:void(0)">Liked</a>` : !p.isCurrentUserPost ? `<a href="javascript:void(0)">Like</a>` : ''}
        <a href="javascript:void(0)">Comments</a>
        ${p.isCurrentUserPost ? `<a href="/profile/deletePost/{{_id}}">Delete</a>` : ''}
    </div>
    </li > `).join('\n')}`
}