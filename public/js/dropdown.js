document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    const dropdownButton = document.getElementById('Dropdown');
    const dropdownMenu = document.getElementById('dropdown');
    if (dropdownButton)
    dropdownButton.addEventListener('click', function() {
        dropdownMenu.classList.toggle('hidden');
    });
});

document.addEventListener('DOMContentLoaded', function() {
  const searchForm = document.getElementById('userSearchForm');

  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const userName = document.getElementById('searchQuery').value.trim();
    if (userName) {
      window.location.href = `/api/profile/findByUserName/${encodeURIComponent(userName)}`; // Redirect to the user's profile page
    }
  });
});


