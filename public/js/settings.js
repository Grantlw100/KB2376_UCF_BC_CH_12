document.addEventListener('DOMContentLoaded', function() {
    const user_id = document.querySelector('.hats').getAttribute('data-user-id');
    document.querySelector('.settings-for-general').addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        
        const settingsData = Object.fromEntries(formData.entries());
        console.log('settingsData:', settingsData);
        try {
            const response = await fetch(`/api/users/${user_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settingsData),
            });

            if (response.ok) {
                alert('Settings updated successfully!');
            } else {
                throw new Error('Failed to update settings.');
            }
        } catch (error) {
            console.error('Error updating settings:', error);
        }
    });

    /*
    // This section is commented out and can be implemented later for profile picture upload
    // Handle profile picture upload
    document.querySelector('.form.settings-form[enctype="multipart/form-data"]').addEventListener('submit', async (event) => {
        event.preventDefault();
        // Your profile picture upload logic goes here
    });
    */

    document.querySelector('.settings-for-delete').addEventListener('submit', async (event) => {
        event.preventDefault() ;

        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                const response = await fetch(`/api/users/${userId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('Account deleted successfully!');
                    window.location.href = '/'; 
                } else {
                    throw new Error('Failed to delete account.');
                }
            } catch (error) {
                console.error('Error deleting account:', error);
            }
        }
    });

    document.querySelector('.settings-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);

        const settingsData = {
            notifications_enabled: formData.get('notifications_enabled') === 'on',
            dark_mode_enabled: formData.get('dark_mode_enabled') === 'on',
        };
        console.log('settingsData:', settingsData);
        console.log('user_id:', user_id);
        if (!user_id) {
            console.error('User ID is undefined or not found.');
        }
        try {
            const response = await fetch(`/api/profile/${user_id}/subsettings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settingsData),
            });

            if (response.ok) {
                alert('Notification settings updated successfully!');
            } else {
                throw new Error('Failed to update notification settings.');
            }
        } catch (error) {
            console.error('Error updating notification settings:', error);
        }
    });
});
