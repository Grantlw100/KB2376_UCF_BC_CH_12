document.addEventListener('DOMContentLoaded', async () => {
  const user_id = document.body.dataset.user_id; // Assuming the user ID is stored as a data attribute on the body

  try {
      const response = await fetch(`/api/profile/${user_id}/posts/`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error('Failed to fetch posts.');
      }

      const posts = await response.json();
      updatePostsOnProfile(posts);
  } catch (error) {
      console.error('Error fetching posts:', error);
  }
});

function updatePostsOnProfile(posts) {
  const postsList = document.querySelector('.list-group');

  // Clear existing posts
  postsList.innerHTML = '';

  // Append new posts
  posts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.classList.add('list-group-item', 'list-group-item-action');
      postElement.innerHTML = `
          <h5 class="mb-1">${post.title}</h5>
          <p class="mb-1">${post.content}</p>
      `;
      postsList.appendChild(postElement);
});
}

