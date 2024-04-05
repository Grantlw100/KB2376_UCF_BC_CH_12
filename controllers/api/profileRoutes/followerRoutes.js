const router = require('express').Router();
const withAuth = require('../../../utils/auth');
const { Follower, Notification } = require('../../../models');
const sendNotification = require('../../../utils/sendNotification');

router.get('/', withAuth, async (req, res) => {
    if (!req.params.user_id) {
        res.status(404).json({ message: "No user found with this id!" });
        return;
    }
    console.log('Getting all followers');
    try {
        const followers = await Follower.findAll({
            where: {
                following_id: req.params.user_id,
            },
        });
        res.status(200).json(followers);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });

    }
});

router.get('/:follower_id', withAuth, async (req, res) => {
    if (!req.params.user_id) {
        res.status(404).json({ message: "No user found with this id!" });
        return;
    }
    console.log('Getting all following');
    try {
        const following = await Follower.findAll({
            where: {
                user_id: req.params.user_id,
            },
        });
        res.status(200).json(following);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });

    }
});

router.post('/', withAuth, async (req, res) => {
    if (!req.session.user_id) {
        res.status(403).json({ message: "You are not authorized to follow this user" });
        return;
    }
    console.log('Adding follower',req.body);
    try {
        const newFollower = await Follower.create({
            follower_id: req.body.follower_id,
            following_id: req.body.following_id,
        });
        console.log('newFollower', newFollower);
        if (newFollower) {
            const notification = {
                type: 'followed',
                sender_id: req.body.follower_id,
                receiver_id: req.body.following_id,
                reference_id: newFollower.id,
                entityType: 'account'
            };
            sendNotification(notification);
        }
        res.status(200).json(newFollower);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });

    }
});

router.delete('/:following_id', withAuth, async (req, res) => {
    const follower_id = req.session.user_id;
    const following_id = req.params.following_id;

    try {
        const followerData = await Follower.destroy({
            where: {
                follower_id: follower_id,
                following_id: following_id,
            },
        });

        if (!followerData) {
            return res.status(404).json({ message: 'No follow relationship found with this id!' });
        }
        res.status(200).json({ message: 'Unfollow successful.' });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});



module.exports = router;