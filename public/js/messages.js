async function sendMessage() {
    const recipient = document.getElementById('recipient').value;
    const messageContent = document.getElementById('message').value; // Assuming the textarea has an ID of 'message'
    const message = {
        receiver_id: recipient,
        message: messageContent,
    };
    console.log('Sending message:', message);
    try {
        const response = await fetch('/api/profile/message', { // Changed to match the server route, adjust if necessary
            method: 'POST',
            body: JSON.stringify(message),
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
            console.log('Message sent successfully');
            // Consider clearing the form or giving user feedback
        } else {
            const errorResponse = await response.json();
            console.error('Failed to send message:', errorResponse.message);
        }
    } catch (error) {
        console.error('Failed to send message:', error.message);
    }
}

document.getElementById('send-message').addEventListener('click', sendMessage);

document.addEventListener('click', async (event) => {
    // Check if the clicked element is a send-reply button
    if (event.target.classList.contains('send-reply')) {
        // Access the sender's username from the data attribute of the button
        const senderContainer = event.target.closest('li');
        // Find the textarea for reply in the same container (reply-input) as the clicked button
        const textarea = event.target.previousElementSibling;
        let senderUserName = senderContainer.getAttribute('data-sender-userName');
        console.log('senderContainer:', senderUserName);
        // Retrieve the message content from the textarea
        const messageContent = textarea.value.trim();
        console.log('messageContent:', messageContent, 'senderUserName:', senderUserName);
        if (!messageContent) {
            console.error('Message content is empty');
            return;
        }
        const message = {
            receiver_id: senderUserName, // Ensure this is the intended receiver's user ID
            message: messageContent,
        };

        // Send the message
        try {
            const response = await fetch('/api/profile/message', { // Adjust the fetch URL as per your route setup
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(message),
            });

            if (response.ok) {
                console.log('Message sent successfully');
                // Clear the textarea after sending
                textarea.value = '';
            } else {
                const errorResponse = await response.json();
                console.error('Failed to send message:', errorResponse.message);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
});


document.querySelectorAll('.reply-button').forEach(button => {
    button.addEventListener('click', function() {
        // Assuming the reply input div is the next sibling of the button
        const replyInputDiv = this.nextElementSibling;
        replyInputDiv.classList.toggle('hidden');
        // Toggle for each child of replyInputDiv
        Array.from(replyInputDiv.children).forEach(child => {
            child.classList.toggle('hidden');
        });
    });
});