document.addEventListener('DOMContentLoaded', function() {
    const postForm = document.querySelector('.post-form');

    if (postForm) {
        postForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the form from submitting through the HTML form action
            
            // Collecting form data
            const formData = new FormData(postForm);
            const postData = {
                title: formData.get('title'),
                content: formData.get('content'),
            };

            try {
                // Sending a POST request to the server to create a new post
                const response = await fetch('/api/profile/:user_id/posts/', { // Assuming your API endpoint for creating a post is '/api/posts'
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postData)
                });

                if (response.ok) {
                    console.log('Post created successfully');
                    alert('Post created successfully! Taking you back to your Dashboard.');
                    window.location.href = '/dashboard';
         // Example redirect after creating a post
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message);
                }
            } catch (error) {
                console.error('Failed to create the post:', error);
                // Display an error message on the form
            }
        });
    }
});
