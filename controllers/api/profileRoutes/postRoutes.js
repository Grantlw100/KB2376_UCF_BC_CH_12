const router = require('express').Router();
const withAuth = require('../../../utils/auth');
const { Post, Tag, User } = require('../../../models');
const sendNotification = require('../../../utils/sendNotification');
const { createTag, extractTags } = require('../../../utils/extractTags');


router.get('/', withAuth, async (req, res) => {
    if (!req.session.user_id || !req.session.logged_in) {
        res.status(403).json({ message: "You are not authorized to view this page" });
        return;
    }
    console.log('Getting all posts');
    try {
        const posts = await Post.findAll(
            {
                where: {
                    user_id: req.session.user_id
                }
            }
        );
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });

    }
});

router.get('/:post_id', withAuth, async (req, res) => {
    if (!req.params.id) {
        res.status(404).json({ message: "No post found with this id!" });
        return;
    }
    console.log('Getting post',req.params.id);
    try {
        const post = await Post.findByPk(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });

    }
});

router.post('/', withAuth, async (req, res) => {
    if (!req.session.user_id) {
        res.status(403).json({ message: "You are not authorized to create a post" });
        return;
    }
    console.log('Creating post',req.body);
    const content = req.body.content;
    const tags = extractTags(content);
    try {
        const user_id = req.session.user_id;
        const title = req.body.title;
        console.log('Tags:',tags);
        const newPost = await Post.create({
            user_id,
            title,
            content,
        });
        if (tags.length) {
            newTags = await createTag(tags, newPost.id, user_id);
            for (let i = 0; i < newTags.length; i++) {
                const notification = {
                    user_id: newTags[i].user_id,
                    type: 'tag',
                    reference_id: newPost.id,
                    sender_id: user_id,
                    receiver_id: newTags[i].user_id,
                    read: false,
                    body: `You were tagged in a post by ${req.session.userName}`,
                    entityType: 'post',
                };
                sendNotification(notification);
            }
        }
        res.status(200).json(newPost);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });

    }
});

router.put('/:post_id', withAuth, async (req, res) => {
    if (!req.session.user_id) {
        res.status(403).json({ message: "You are not authorized to update this post" });
        return;
    }
    console.log('Updating post',req.params.id,req.body);
    try {
        const updatedPost = await Post.update(req.body, {
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });

    }
});

router.delete('/:post_id', withAuth, async (req, res) => {
    if (!req.session.user_id) {
        res.status(403).json({ message: "You are not authorized to delete this post" });
        return;
    }
    console.log('Deleting post',req.params.id);
    try {
        const postData = await Post.destroy({
            where: {
                id: req.params.id,
            },
        });
        if (!postData) {
            res.status(404).json({ message: 'No post found with this id!' });
            return;
        }
        res.status(200).json(postData);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });

    }
});

module.exports = router;