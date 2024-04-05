const follow = document.querySelector('#followButton')
const unfollow = document.querySelector('#unfollowButton')

const follower_id = document.body.dataset.loggedInUserId;
const following_id = document.body.dataset.userId;

console.log(follower_id, following_id)

const followUser = async (event) => {
    event.preventDefault();
    const following_id = event.target.dataset.userId;
    const follower_id = document.body.dataset.loggedInUserId; // Assuming you have the logged-in user's ID stored in the body's data attribute
    console.log('Following user:', following_id, 'from user:', follower_id);
    const response = await fetch(`/api/profile/follow/`, {
        method: 'POST',
        body: JSON.stringify({ following_id, follower_id }),
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
        document.location.reload();
    } else {
        alert('Failed to follow user');
    }
};

const unfollowUser = async (event) => {
    event.preventDefault();
    
    const following_id = event.target.dataset.userId;
    console.log('Unfollowing user:', event.target.dataset.userId);
    const response = await fetch(`/api/profile/follow/${following_id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
        document.location.reload();
    } else {
        alert('Failed to unfollow user');
    }
}


if (follow) {
    follow.addEventListener('click', followUser);
}

if (unfollow) {
    unfollow.addEventListener('click', unfollowUser);
}