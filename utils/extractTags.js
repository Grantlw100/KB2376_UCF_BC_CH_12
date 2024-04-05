function extractTags(inputText) {
    const tagRegex = /@(\w+)/g;
    let tags = [];
    let match;

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
            const user = await User.findOne({ where: { userName: tagName } });
            if (user) {
                await Tag.create({
                    post_id: postId,
                    tagging_user_id: userId,
                    tagged_user_id: user.id, 
                    comment_id: commentId,
                });
            } else {
                console.log(`User not found for tag: ${tagName}`);
            }
        } catch (error) {
            console.error(`Error creating tag for ${tagName}:`, error);
        }
    }
}

module.exports = { extractTags, createTag };