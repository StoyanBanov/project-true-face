export function createUserCards(users) {
    const userLis = users.map(user => {
        const li = document.createElement('li'); li.id = user._id
        li.innerHTML = `
    <img width="100" height="100" src="/static/images/${user.profilePic ?? 'profile.png'}">
    <h2>${user.username}</h2>
    <p>${user.friendsCount} friends</p>
    ${user.isFriend ? `<p>friends</p>` : user.isRequested ? `<a href="javascript:void(0)">Accept</a>` : `<a href="javascript:void(0)">Add</a>`}`
        return li
    });
    return userLis
}