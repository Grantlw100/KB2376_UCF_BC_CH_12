async function sendMessage() {
    const recipient = document.getElementById('recipient').value;
    const messageContent = document.getElementById('message').value;
    const message = {
        receiver_id: recipient,
        message: messageContent,
    };
    console.log('Sending message:', message);
    try {
        const response = await fetch('/api/profile/message', { 
            method: 'POST',
            body: JSON.stringify(message),
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
            console.log('Message sent successfully');
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
    if (event.target.classList.contains('send-reply')) {
        const senderContainer = event.target.closest('li');
        const textarea = event.target.previousElementSibling;
        let senderUserName = senderContainer.getAttribute('data-sender-userName');
        console.log('senderContainer:', senderUserName);
        const messageContent = textarea.value.trim();
        console.log('messageContent:', messageContent, 'senderUserName:', senderUserName);
        if (!messageContent) {
            console.error('Message content is empty');
            return;
        }
        const message = {
            receiver_id: senderUserName, 
            message: messageContent,
        };

        
        try {
            const response = await fetch('/api/profile/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(message),
            });

            if (response.ok) {
                console.log('Message sent successfully');
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
        const replyInputDiv = this.nextElementSibling;
        replyInputDiv.classList.toggle('hidden');
        Array.from(replyInputDiv.children).forEach(child => {
            child.classList.toggle('hidden');
        });
    });
});