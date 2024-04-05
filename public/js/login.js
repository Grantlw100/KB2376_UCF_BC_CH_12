// Wait for the DOM to be loaded
document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.querySelector('.login-form');

  // Add an event listener for form submission
  loginForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevent the default form submission

      // Collect the form data
      const userName = document.querySelector('#email-login').value.trim();
      const password = document.querySelector('#password-login').value.trim();

      if (userName && password) {
          // Send a POST request to the server with the email and password
          try {
              const response = await fetch('/api/profile/login', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ userName, password }),
              });

              if (response.ok) {
                  // If login was successful, redirect to the dashboard
                  document.location.replace('/dashboard');
              } else {
                  alert('Failed to log in.');
              }
          } catch (err) {
              console.error('Failed to log in:', err);
          }
      }
  });
});
