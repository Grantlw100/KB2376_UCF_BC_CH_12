// document.addEventListener('DOMContentLoaded', () => {
//     document.querySelectorAll('.delete-post-button').forEach(button => {
//         button.addEventListener('click', deletePost);
//     });

    

//     document.querySelectorAll('.dislike-button').forEach(button => {
//         button.addEventListener('click', dislikePost);
//     });

//     document.querySelectorAll('.add-comment-button').forEach(button => {
//         button.addEventListener('click', addComment);
//     })

//     document.querySelectorAll('.like-comment-button').forEach(button => {
//         button.addEventListener('click', likeComment);
//     })  
//     document.querySelectorAll('.dislike-comment-button').forEach(button => {
//         button.addEventListener('click', dislikeComment);
//     })

//     document.querySelectorAll('.delete-comment-button').forEach(button => {
//         button.addEventListener('click', deleteComment);
//     })

//     document.querySelectorAll('.get-replies-button').forEach(button => {
//         button.addEventListener('click', getReplies);
//     })

//     document.querySelectorAll('.add-reply-button').forEach(button => {
//         button.addEventListener('click', addReply);
//     })

//     document.querySelectorAll('.like-reply-button').forEach(button => {
//         button.addEventListener('click', likeReply);
//     })

//     document.querySelectorAll('.dislike-reply-button').forEach(button => {
//         button.addEventListener('click', dislikeReply);
//     })

//     document.querySelectorAll('.delete-reply-button').forEach(button => {
//         button.addEventListener('click', deleteReply);
//     })

//     document.querySelectorAll('.hide-replies-button').forEach(button => {
//         button.addEventListener('click', hideReplies);
//     })

//     document.querySelectorAll('.show-replies-button').forEach(button => {
//         button.addEventListener('click', showReplies);

//     });

//     document.querySelectorAll('.show-tags-button').forEach(button => {
//         button.addEventListener('click', showTags);
//     })

//     document.querySelectorAll('.hide-tags-button').forEach(button => {
//         button.addEventListener('click', hideTags);
//     })

//     document.querySelectorAll('.add-tag-button').forEach(button => {
//         button.addEventListener('click', addTag);
//     })

//     document.querySelectorAll('.delete-tag-button').forEach(button => {
//         button.addEventListener('click', deleteTag);
//     })

//     document.querySelector('#profile-button').addEventListener('click', dashboardProfile);
    
//     getPosts();

// });

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.user-profile-link').forEach(element => {
        element.addEventListener('click', goToUserProfile);
    });
});

async function goToUserProfile(event) {
    const userName = event.target.getAttribute('data-user-name');
    window.location.href = `/api/profile/findByUserName/${encodeURIComponent(userName)}`;
    // Assuming you're doing client-side navigation, adjust as necessary
}

async function likePost(event) {
    event.preventDefault();
    console.log('likePost function called');
    
    const button = event.currentTarget;
    const post_id = button.getAttribute('data-post-id');
    console.log(`Post ID: ${post_id}`); // Check if post_id is logged correctly

    const response = await fetch(`/api/timeline/likes/${post_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id }),
    });

    if (response.ok) {
        console.log('Post liked successfully');
        document.location.reload();
    } else {
        const errorResponse = await response.json();
        console.error('Failed to like post', errorResponse.message);
    }
}


document.querySelectorAll('.like-post-button').forEach(button => {
    button.addEventListener('click', likePost);
});

async function dislikePost(event) {
    event.preventDefault();
    console.log('dislikePost function called');
    
    const button = event.currentTarget;
    const post_id = button.getAttribute('data-post-id');
    console.log(`Post ID: ${post_id}`); // Check if post_id is logged correctly

    const response = await fetch(`/api/timeline/likes/${post_id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id }),
    });

    if (response.ok) {
        console.log('Post disliked successfully');
        document.location.reload();
    } else {
        const errorResponse = await response.json();
        console.error('Failed to dislike post', errorResponse.message);
    }
}

document.querySelectorAll('.dislike-post-button').forEach(button => {
    button.addEventListener('click', dislikePost);
});

document.addEventListener('DOMContentLoaded', () => {
    const shit = document.querySelector('.like-comment-button')
    const shitshit = shit.getAttribute('data-post-creator-id')
    console.log(shitshit)
})

async function addComment(event) {
    event.preventDefault();
    console.log('addComment function called');

    const button = event.currentTarget;
    const postId = button.getAttribute('data-post-id');
    // Now also getting the post creator's user ID
    const postElement = document.querySelector(`article[data-post-id="${postId}"]`);
    const postCreatorId = postElement.getAttribute('data-post-creator-id');

    const commentInput = postElement.querySelector('.comment-input');
    const content = commentInput.value.trim();

    console.log(`Post ID: ${postId}`, `Comment: ${content}`, `Post Creator ID: ${postCreatorId}`);

    const response = await fetch(`/api/timeline/comments/${postId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, postCreatorId }), // Including postCreatorId in the body
    });

    if (response.ok) {
        console.log('Comment added successfully');
        // Optionally, update the comments list dynamically instead of reloading
        document.location.reload();
    } else {
        const errorResponse = await response.json();
        console.error('Failed to add comment:', errorResponse.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.add-comment-button').forEach(button => {
        button.addEventListener('click', addComment);
    });
});


// Ensure correct targeting for initialization of event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.add-comment-button').forEach(button => {
        button.addEventListener('click', addComment);
    });
});


document.querySelectorAll('.add-comment-button').forEach(button => {
    button.addEventListener('click', addComment);
});

async function likeComment(event) {
    event.preventDefault();
    
    // Use closest() to find the nearest parent article element
    const article = event.target.closest('article.post');
    const postId = article.dataset.postId;
    const postCreatorId = article.dataset.postCreatorId;
    const commentId = event.target.dataset.commentId;
    
    // Logging to confirm values
    console.log(`Post ID: ${postId}, Post Creator ID: ${postCreatorId}`);
    
    console.log(`Comment ID: ${commentId}, Post ID: ${postId}, Post Creator ID: ${postCreatorId}`);

    const response = await fetch(`/api/timeline/comments/likes/${commentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, postId, postCreatorId }),
    });

    if (response.ok) {
        console.log('Comment liked successfully');
        document.location.reload(); // Consider dynamically updating the like count instead
    } else {
        const errorResponse = await response.json();
        console.error('Failed to like comment:', errorResponse.message);
    }
}

// Add event listeners to like comment buttons
document.querySelectorAll('.like-comment-button').forEach(button => {
    button.addEventListener('click', likeComment);
});

async function dislikeComment(event) {
    event.preventDefault();
    console.log('dislikeComment function called');
    
    const button = event.currentTarget;
    const commentId = button.getAttribute('data-comment-id');
    const postId = button.getAttribute('data-post-id'); // Getting the post ID
    const commentCreatorId = button.getAttribute('data-comment-creator-id'); // Getting the comment creator's user ID

    console.log(`Comment ID: ${commentId}, Post ID: ${postId}, Comment Creator ID: ${commentCreatorId}`);

    const response = await fetch(`/api/timeline/comments/likes/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, postId, commentCreatorId }),
    });

    if (response.ok) {
        console.log('Comment disliked successfully');
        document.location.reload(); // Consider dynamically updating the like count instead
    } else {
        const errorResponse = await response.json();
        console.error('Failed to dislike comment:', errorResponse.message);
    }
}

// Add event listeners to dislike comment buttons
document.querySelectorAll('.dislike-comment-button').forEach(button => {
    button.addEventListener('click', dislikeComment);
});

async function deleteComment(event) {
    event.preventDefault();
    console.log('deleteComment function called');
    
    const button = event.currentTarget;
    const commentId = button.getAttribute('data-comment-id');
    const postId = button.getAttribute('data-post-id'); // Getting the post ID
    const commentCreatorId = button.getAttribute('data-comment-creator-id'); // Getting the comment creator's user ID

    console.log(`Comment ID: ${commentId}, Post ID: ${postId}, Comment Creator ID: ${commentCreatorId}`);

    const response = await fetch(`/api/timeline/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, commentCreatorId }),
    });

    if (response.ok) {
        console.log('Comment deleted successfully');
        document.location.reload(); // Consider dynamically updating the comment list instead
    } else {
        const errorResponse = await response.json();
        console.error('Failed to delete comment:', errorResponse.message);
    }
}

// Add event listeners to delete comment buttons
document.querySelectorAll('.delete-comment-button').forEach(button => {
    button.addEventListener('click', deleteComment);
});




document.querySelectorAll('.reply-button').forEach(button => {
    button.addEventListener('click', function() {
        let commentId 
        if (this.hasAttribute('data-comment-id'))
            {commentId = this.getAttribute('data-comment-id')}
        else {commentId = this.getAttribute('data-reply-id')}
        // Assuming the reply input div is the next sibling of the button
        const replyInputDiv = this.nextElementSibling;
        replyInputDiv.classList.toggle('hidden');
        // Toggle for each child of replyInputDiv
        Array.from(replyInputDiv.children).forEach(child => {
            child.classList.toggle('hidden');
        });
    });
});

async function replyToComment(event) {
    event.preventDefault();
    console.log('replyToComment function called');
    

    const button = event.currentTarget;
    let original_comment_id;
    if (button.hasAttribute('data-comment-id')) {
    original_comment_id = button.getAttribute('data-comment-id');
    console.log('Saving reply to comment')
    } else { original_comment_id = button.getAttribute('data-reply-id')
    console.log('Saving reply to reply')}
    const postId = document.querySelector(".post").getAttribute("data-post-id") // Getting the post ID
    const replyInput = button.previousElementSibling;
    const content = replyInput.value.trim();

    console.log(`Original Comment ID: ${original_comment_id}, Post ID: ${postId}, Reply: ${content}, isReply: true`);

    const response = await fetch(`/api/timeline/comments/replies/${original_comment_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, postId, original_comment_id }),
    });

    if (response.ok) {
        console.log('Reply added successfully');
        document.location.reload(); // Consider dynamically updating the reply list instead
    } else {
        const errorResponse = await response.json();
        console.error('Failed to add reply:', errorResponse.message);
    }
}



// Add event listeners to reply buttons
document.querySelectorAll('.add-reply-button').forEach(button => {
    button.addEventListener('click', replyToComment);
});

async function deleteReply(event) {
    event.preventDefault();
    console.log('deleteReply function called');
    
    const button = event.currentTarget;
    const replyId = button.getAttribute('data-reply-id');
    const postId = button.closest('article').getAttribute('data-post-id') // Getting the post ID
    const replyCreatorId = button.getAttribute('data-reply-creator-id'); // Getting the reply creator's user ID

    console.log(`Reply ID: ${replyId}, Post ID: ${postId}, Reply Creator ID: ${replyCreatorId}`);

    const response = await fetch(`/api/timeline/comments/${replyId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, replyCreatorId }),
    });

    if (response.ok) {
        console.log('Reply deleted successfully');
        document.location.reload(); // Consider dynamically updating the reply list instead
    } else {
        const errorResponse = await response.json();
        console.error('Failed to delete reply:', errorResponse.message);
    }
}

// Add event listeners to delete reply buttons
document.querySelectorAll('.delete-reply-button').forEach(button => {
    button.addEventListener('click', deleteReply);
});

async function likeReply(event) {
    event.preventDefault();
    
    // Use closest() to find the nearest parent article element
    const article = event.target.closest('article.post');
    const postId = article.dataset.postId;
    const postCreatorId = article.dataset.postCreatorId;
    const replyId = event.target.dataset.replyId;
    
    // Logging to confirm values
    console.log(`Post ID: ${postId}, Post Creator ID: ${postCreatorId}`);
    
    console.log(`Reply ID: ${replyId}, Post ID: ${postId}, Post Creator ID: ${postCreatorId}`);

    const response = await fetch(`/api/timeline/comments/likes/${replyId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replyId, postId, postCreatorId }),
    });

    if (response.ok) {
        console.log('Reply liked successfully');
        document.location.reload(); // Consider dynamically updating the like count instead
    } else {
        const errorResponse = await response.json();
        console.error('Failed to like reply:', errorResponse.message);
    }
}

// Add event listeners to like reply buttons
document.querySelectorAll('.like-reply-button').forEach(button => {
    button.addEventListener('click', likeReply);
});

async function dislikeReply(event) {
    event.preventDefault();
    console.log('dislikeReply function called');
    
    const button = event.currentTarget;
    const replyId = button.getAttribute('data-reply-id');
    const postId = button.closest('article').getAttribute('data-post-id'); // Getting the post ID
    const replyCreatorId = button.getAttribute('data-reply-creator-id'); // Getting the reply creator's user ID

    console.log(`Reply ID: ${replyId}, Post ID: ${postId}, Reply Creator ID: ${replyCreatorId}`);

    const response = await fetch(`/api/timeline/comments/likes/${replyId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replyId, postId, replyCreatorId }),
    });

    if (response.ok) {
        console.log('Reply disliked successfully');
        document.location.reload(); // Consider dynamically updating the like count instead
    } else {
        const errorResponse = await response.json();
        console.error('Failed to dislike reply:', errorResponse.message);
    }
}

// Add event listeners to dislike reply buttons
async function showReplies(event) {
    event.preventDefault();
    console.log('showReplies function called');
    
    // Assuming the button has a data-comment-id attribute since we're showing/hiding replies for a comment
    const button = event.currentTarget;
    const commentId = button.getAttribute('data-comment-id');
    console.log(`Comment ID: ${commentId}`);

    // Find the closest parent li element for the comment, then the replies container within it
    const commentContainer = button.closest('li[data-comment-id="' + commentId + '"]');
    const repliesContainer = commentContainer.querySelector('.replies');
    
    // Toggle the visibility of the replies container
    repliesContainer.classList.toggle('hidden');

    // Update the button text based on the visibility state of the replies container
    if (repliesContainer.classList.contains('hidden')) {
        button.textContent = 'Show Replies';
    } else {
        button.textContent = 'Hide Replies';
    }
}

// Attaching event listeners to all "Show Replies" buttons
document.querySelectorAll('.show-replies-button').forEach(button => {
    button.addEventListener('click', showReplies);
});


// Add event listeners to show replies buttons
document.querySelectorAll('.show-replies-button').forEach(button => {
    button.addEventListener('click', showReplies);
});
