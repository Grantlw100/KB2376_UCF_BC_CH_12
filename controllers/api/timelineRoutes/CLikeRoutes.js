const router = require('express').Router();
const withAuth = require('../../../utils/auth');
const { CLike } = require('../../../models');
const sendNotification = require('../../../utils/sendNotification');
const Follower = require('../../../models')

router.get('/:post_id/comments/:comment_id/likes', withAuth, async (req, res) => {
    try {
        const likes = await CLike.findAll({
        where: {
            comment_id: req.params.comment_id,
        },
        });
        res.status(200).json(likes);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });

    }
    });

router.get('/:post_id/comments/:comment_id/likes/:like_id', withAuth, async (req, res) => {
    try {
        const like = await CLike.findByPk(req.params.like_id);
        res.status(200).json(like);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });

    }
    });

router.post('/:post_id/comments/:comment_id/likes', withAuth, async (req, res) => {
    if (!req.session.user_id) {
        res.status(403).json({ message: "You are not authorized to like this comment" });
        return;
    }
    console.log('Adding like to comment',req.body);
    try {
        const user_id = req.session.user_id;
        const comment_id = req.params.comment_id;
        isFollower = await Follower.findOne({
            where: {
                user_id: user_id,
                following_id: comment_id,
            },
        });
        const newCLike = await CLike.create({
        user_id: user_id,
        comment_id: comment_id,
        isFollower: isFollower ? true : false,
        });
        if (newCLike) {
            const notification = {
                type: 'liked',
                sender_id: req.session.user_id,
                receiver_id: req.params.user_id,
                reference_id: newCLike.id,
                entityType: 'comment'
            };
            sendNotification(notification);
        }
        res.status(200).json(newCLike);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });

    }
    });

router.delete('/:post_id/comments/:comment_id/likes/:like_id', withAuth, async (req, res) => {
    try {
        if (!req.session.user_id) {
        res.status(403).json({ message: "You are not authorized to delete this like" });
        return;
        }
        const likeData = await CLike.destroy({
        where: {
            id: req.params.like_id,
        },
        });
        if (!likeData) {
        res.status(404).json({ message: 'No like found with this id!' });
        return;
        }
        res.status(200).json(likeData);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });

    }
    });

module.exports = router;