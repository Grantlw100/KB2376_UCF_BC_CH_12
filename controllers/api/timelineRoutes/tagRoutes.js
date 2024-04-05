const withAuth = require('../../../utils/auth');
const router = require('express').Router();
const { Tag } = require('../../../models');
const { sendNotification } = require('../../../utils/sendNotification');

router.get('/:post_id/tags', withAuth, async (req, res) => {
    console.log('Getting all tags');
    try {
        const tags = await Tag.findAll({
            where: {
                post_id: req.params.post_id,
            },
        });
        res.status(200).json(tags);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });

    }
});

router.get('/:post_id/tags/:tag_id', withAuth, async (req, res) => {
    if (!req.params.tag_id) {
        res.status(404).json({ message: "No tag found with this id!" });
        return;
    }
    console.log('Getting tag',req.params.id);
    try {
        const tag = await Tag.findByPk(req.params.id);
        res.status(200).json(tag);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });

    }
});

router.get('/comments/:comment_id/tags', withAuth, async (req, res) => {
    console.log('Getting all tags');
    try {
        const tags = await Tag.findAll({
            where: {
                comment_id: req.params.comment_id,
            },
        });
        res.status(200).json(tags);
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

router.post('/:post_id/tags', withAuth, async (req, res) => {
    if (!req.session.user_id) {
        res.status(403).json({ message: "You are not authorized to create a tag" });
        return;
    }
    console.log('Creating tag',req.body);
    try {
        const user_id = req.session.user_id;
        const post_id = req.params.post_id;
        const newTag = await Tag.create({
            user_id: user_id,
            post_id: post_id,
        });
        if (newTag) {
            const notification = {
                type: 'tagged',
                sender_id: req.session.user_id,
                receiver_id: req.params.user_id,
                reference_id: newTag.id,
                entityType: 'account'
            };
            sendNotification(notification);
        }
        res.status(200).json(newTag);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });

    }
});

router.post('/comments/:comment_id/tags', withAuth, async (req, res) => {
    if (!req.session.user_id) {
        return res.status(403).json({ message: "You are not authorized to create a tag" });
    }

    try {
        const { user_id } = req.body; 
        const comment_id = req.params.comment_id;

        const newTag = await Tag.create({
            user_id,
            comment_id: comment_id,
        });
        const notification = {
            type: 'tagged',
            sender_id: req.session.user_id,
            receiver_id: user_id,
            reference_id: newTag.id,
            entityType: 'account'
        };
        await sendNotification(notification);

        res.status(200).json(newTag);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

router.put('/:post_id/tags/:tag_id', withAuth, async (req, res) => {
    if (!req.session.user_id) {
        res.status(403).json({ message: "You are not authorized to update this tag" });
        return;
    }
    if (!req.params.tag_id) {
        res.status(404).json({ message: "No tag found with this id!" });
        return;
    }
    console.log('Updating tag',req.params.id,req.body);
    const tag_id = req.params.tag_id;
    try {
        const updatedTag = await Tag.update(req.body, {
            where: {
                id: tag_id,
            },
        });
        res.status(200).json(updatedTag);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });

    }
});

router.delete('/:post_id/tags/:tag_id', withAuth, async (req, res) => {
    if (!req.session.user_id) {
        res.status(403).json({ message: "You are not authorized to delete this tag" });
        return;
    }
    try {
        const tagData = await Tag.destroy({
            where: {
                id: req.params.tag_id,
            },
        });
        if (!tagData) {
            res.status(404).json({ message: 'No tag found with this id!' });
            return;
        }
        res.status(200).json(tagData);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });

    }
});

module.exports = router;