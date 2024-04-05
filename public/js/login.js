document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.querySelector('.login-form');

  loginForm.addEventListener('submit', async (event) => {
      event.preventDefault(); 
      const userName = document.querySelector('#email-login').value.trim();
      const password = document.querySelector('#password-login').value.trim();

      if (userName && password) {
          try {
              const response = await fetch('/api/profile/login', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ userName, password }),
              });

              if (response.ok) {
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
