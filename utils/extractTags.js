function extractTags(inputText) {
    // Regular expression to find all instances of '@' followed by alphanumeric characters
    const tagRegex = /@(\w+)/g;
    let tags = [];
    let match;

    // Loop over all matches and add them to the tags array
    while ((match = tagRegex.exec(inputText)) !== null) {
        tags.push(match[1]);
    }

    return tags;
}

const { Tag, User } = require('../models');

async function createTag(tags, postId, userId, commentId) {
    if (!commentId) commentId = null;
    for (const tagName of tags) {
        try {
            // Look up the user ID based on the username (tagName)
            const user = await User.findOne({ where: { userName: tagName } });
            if (user) {
                // If the user exists, create a tag with their user ID
                await Tag.create({
                    post_id: postId,
                    tagging_user_id: userId, // Passed in as an argument
                    tagged_user_id: user.id, // Use the found user's ID
                    comment_id: commentId,
                });
            } else {
                console.log(`User not found for tag: ${tagName}`);
                // Handle cases where the user is not found (e.g., skip or log)
            }
        } catch (error) {
            console.error(`Error creating tag for ${tagName}:`, error);
            // Handle any errors that occur during the user lookup or tag creation
        }
    }
}

module.exports = { extractTags, createTag };