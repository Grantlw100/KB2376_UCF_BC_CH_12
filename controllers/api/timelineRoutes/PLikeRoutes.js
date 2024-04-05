const router = require('express').Router();
const withAuth = require('../../../utils/auth');
const { PLike, Post, Follower } = require('../../../models');
const sendNotification = require('../../../utils/sendNotification');

// Post Likes (PLike): Likes related to posts can also be nested under posts.

// POST /api/posts/:post_id/likes - Like a post
// DELETE /api/posts/:post_id/likes/:like_id - Unlike a post
// GET /api/posts/:post_id/likes - Get likes for a post
// GET /api/posts/:post_id/likes/:like_id - Get a specific like for a post

router.get('/', withAuth, async (req, res) => {
    if (!req.params.post_id) {
        res.status(404).json({ message: "No post found with this id!" });
        return;
    }
    console.log('Getting likes for post',req.params.post_id);
    try {
        const likes = await PLike.findAll({
            where: {
                post_id: req.params.post_id,
            },
        });
        res.status(200).json(likes);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });

    }
    });

router.get('/:post_id/:like_id', withAuth, async (req, res) => {
    if (!req.params.post_id) {
        res.status(404).json({ message: "No post found with this id!" });
        return;
    }
    console.log('Getting like for post',req.params.like_id);
    try {
        const like = await PLike.findByPk(req.params.like_id);
        res.status(200).json(like);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });

    }
    });

    router.post('/:post_id', withAuth, async (req, res) => {
        if (!req.session.user_id) {
            return res.status(403).json({ message: "You are not authorized to like this post" });
        } 
    
        const post_id = req.params.post_id;
        // Fetch post to get author's ID
        const post = await Post.findByPk(post_id, {
            attributes: ['user_id'],
        });
    
        if (!post) {
            return res.status(404).json({ message: "No post found with this id!" });
        }
    
        const user_id = req.session.user_id;
        const author_id = post.user_id; // Author of the post
        // Check if the current user follows the author
        const isFollower = await Follower.findOne({
            where: {
                follower_id: user_id,
                following_id: author_id,
            },
        });
    
        try {
            const newPLike = await PLike.create({
                user_id: user_id,
                post_id: post_id,
                isFollower: !!isFollower,
            });
    
            if (newPLike) {
                // Assuming you have a function sendNotification implemented
                const notification = {
                    type: 'liked',
                    sender_id: user_id,
                    receiver_id: author_id,
                    reference_id: newPLike.id,
                    entityType: 'post',
                };
                sendNotification(notification); // Make sure this function is properly implemented
            }
    
            res.json(newPLike);
        } catch (err) {
            console.error('Error adding like to post:', err);
            res.status(500).json({ message: "Internal server error", error: err.message });
        }
    });
    

router.delete('/:post_id', withAuth, async (req, res) => {
    if (!req.session.user_id) {
        return res.status(403).json({ message: "You are not authorized to unlike this post" });
    }

    const post_id = req.params.post_id;
    const user_id = req.session.user_id;

    try {
        const like = await PLike.findOne({
            where: {
                user_id: user_id,
                post_id: post_id,
            },
        });

        if (!like) {
            return res.status(404).json({ message: "No like found for this post" });
        }

        await like.destroy();
        res.status(200).json({ message: "Like removed successfully" });
    } catch (err) {
        console.error('Error removing like from post:', err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});
module.exports = router;