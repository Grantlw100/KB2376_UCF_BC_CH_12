document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.querySelector('.signup-form');

    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the form from submitting through the HTML form action
            
            // Collecting form data
            const formData = new FormData(signupForm);
            const userData = {
                name: formData.get('name'),
                userName: formData.get('username'),
                email: formData.get('email'),
                password: formData.get('password'),
                bio: formData.get('bio'),
                // For profile picture, assuming you want to handle the file upload differently or later
            };
            console.log('User data:', userData);
            // Optional: handle file upload here if needed
            // Note: Files in formData require different handling, often with multer on the server-side

            try {
                // Sending a POST request to the server
                const response = await fetch('/api/profile/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                if (response.ok) {
                    console.log('Signup successful');
                    // Redirect the user to another page or display a success message
                    window.location.href = '/dashboard'; // Example redirect after signup
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message);
                }
            } catch (error) {
                console.error('Signup failed:', error);
                // Display an error message on the form
            }
        });
    }
});
