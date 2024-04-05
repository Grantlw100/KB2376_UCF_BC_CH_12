const User = require('../models/users');
const Notification = require('../models/notification');

async function sendNotification({ type, sender_id, receiver_id, reference_id, entityType, customMessage }) {
    const sender = await User.findByPk(sender_id);
    let body;
    switch (type) {
        case 'tag':
            body = `You were tagged in a post by ${sender.userName}`;
            break;
        case 'messaged':
            body = `You have a new message from ${sender.userName}`;
            break;
        case 'liked':
            body = `${sender.userName} liked your post`;
            break;
        case 'commented':
            body = `${sender.userName} commented on your post`;
            break;
        case'followed':
            body = `${sender.userName} followed you`;
            break;
        default:
            break;
    }

    let messageContent = customMessage ? customMessage : null;

    await Notification.create({
        user_id: receiver_id,
        type,
        reference_id,
        sender_id,
        receiver_id,
        body,
        entityType,
        message: messageContent, 
    });
}

module.exports = sendNotification;
