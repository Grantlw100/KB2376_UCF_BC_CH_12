document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.querySelector('.signup-form');

    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 
            const formData = new FormData(signupForm);
            const userData = {
                name: formData.get('name'),
                userName: formData.get('username'),
                email: formData.get('email'),
                password: formData.get('password'),
                bio: formData.get('bio'),
            };
            console.log('User data:', userData);
            
            try {
                const response = await fetch('/api/profile/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                if (response.ok) {
                    console.log('Signup successful');
                    window.location.href = '/dashboard'; 
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message);
                }
            } catch (error) {
                console.error('Signup failed:', error);
            }
        });
    }
});
