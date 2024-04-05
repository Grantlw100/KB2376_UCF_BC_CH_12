const router = require('express').Router();
const { Comment, CLike, Follower, User, Tag } = require('../../../models');
const withAuth = require('../../../utils/auth');
const sendNotification = require('../../../utils/sendNotification');
const { createTag, extractTags } = require('../../../utils/extractTags');

router.get('/', withAuth, async (req, res) => {
    console.log('Getting comments for post:', req.params.post_id);
    try {
        const user_id = req.session.user_id;
        const post_id = req.params.post_id;

        if (!user_id) {
            return res.status(403).json({message: 'You must be logged in to Posts.'});
        } else if (!post_id) {
            return res.status(403).json({message: 'Post not found.'});
        }

        const comments = await Comment.findAll({
            where: { post_id },
         });
        console.log('Comments:', comments)

        res.status(200).json(comments);
    } catch (err) {
        console.error('Error', err);
        res.status(500).json({ message: 'Internal server error.', error: err.message})
    }
});

router.get('/:comment_id', withAuth, async (req, res) => {
    console.log('Getting comment:', req.params.comment_id);
    try {
        const user_id = req.session.user_id;
        const comment_id = req.params.comment_id;

        if (!user_id) {
            return res.status(403).json({message: 'You must be logged in to Posts.'});
        } else if (!comment_id) {
            return res.status(403).json({message: 'Comment not found.'});
        }

        const comment = await Comment.findOne({
            where: {
                id: req.params.comment_id,
            },
            });
        console.log('Comment:', comment)

        res.status(200).json(comment);
    } catch (err) {
        console.error('Error', err);
        res.status(500).json({ message: 'Internal server error.', error: err.message})
    }
});

router.get('/:comment_id/replies', withAuth, async (req, res) => {
    console.log('Getting comment:', req.params.comment_id);
    try {
        const user_id = req.session.user_id;
        const original_comment_id = req.params.comment_id;

        if (!user_id) {
            return res.status(403).json({message: 'You must be logged in to Posts.'});
        } else if (!original_comment_id) {
            return res.status(403).json({message: 'Comment not found.'});
        }

        const comment = await Comment.findAll({
            where: {original_comment_id:req.params.comment_id,
                     is_reply: true}
            });
        console.log('Comment:', comment)

        res.status(200).json(comment);
    } catch (err) {
        console.error('Error', err);
        res.status(500).json({ message: 'Internal server error.', error: err.message})
    }
});

router.get('/:comment_id/replies/:comment_id', withAuth, async (req, res) => {
    console.log('Getting comment:', req.params.comment_id);
    try {
        const user_id = req.session.user_id;
        const comment_id = req.params.comment_id;

        if (!user_id) {
            return res.status(403).json({message: 'You must be logged in to Posts.'});
        } else if (!comment_id) {
            return res.status(403).json({message: 'Comment not found.'});
        }

        const comment = await Comment.findOne({
            where: { comment_id: req.params.comment_id, is_reply: true},
            });
        console.log('Comment:', comment)

        res.status(200).json(comment);
    } catch (err) {
        console.error('Error', err);
        res.status(500).json({ message: 'Internal server error.', error: err.message})
    }
});

router.post('/:post_id', withAuth, async (req, res) => {
    console.log('Received request body:', req.body);
    try {
        const {content, postCreatorId} = req.body;
        const post_id = req.params.post_id;
        const user_id = req.session.user_id;
        const tags = await extractTags(content);

        console.log('Destrucutured Values:', content, post_id, user_id)

        if (!user_id) {
            return res.status(403).json({message: 'You must be logged in to comment on a post.'});
        } else if (!post_id) {
            return res.status(403).json({message: 'Post not found.'});
        }

        const newComment = await Comment.create({
            content,
            post_id,
            user_id,
        });
        if (newComment) {
            const notification = {
                user_id: postCreatorId,
                type: 'commented on',
                sender_id: req.session.user_id,
                receiver_id: postCreatorId,
                reference_id: newComment.id,
                entityType: 'post'
            };
            sendNotification(notification);
        }
        console.log('New Comment:', newComment)
        console.log('Tags:', tags)
        if (tags.length) {
            const newTags = createTag(tags, post_id, req.session.user_id, newComment.id);
            for (let i = 0; i < newTags.length; i++) {
                const notification = {
                    user_id: newTags[i].user_id,
                    type: 'tagged',
                    sender_id: req.session.user_id,
                    receiver_id: newTags[i].user_id,
                    reference_id: newComment.id,
                    entityType: 'account'
                };
                sendNotification(notification);
            }
        }

        res.status(200).json(newComment);
    } catch (err) {
        console.error('Error', err);
        res.status(500).json({ message: 'Internal server error.', error: err.message})
    }
});

router.post('/replies/:comment_id', withAuth, async (req, res) => {
    console.log('Received request body:', req.body);
    try {
        const content = req.body.content;
        const post_id = req.body.postId;
        const user_id = req.session.user_id;
        const original_comment_id = req.body.original_comment_id;
        const is_reply = true;
        const originalComment = await Comment.findOne({
            where: {id: original_comment_id},
            attributes: ['user_id']
        })
        const originalCommentCreatorId = originalComment.user_id;

        const tags = await extractTags(content);
        console.log('tags:', tags)

        if (!user_id) {
            return res.status(403).json({message: 'You must be logged in to reply to a comment on a post.'});
        } else if (!original_comment_id) {
            return res.status(403).json({message: 'Comment not found.'});
        }
        
        const newComment = await Comment.create({
            content: content,
            post_id: post_id,
            user_id: user_id,
            original_comment_id: original_comment_id,
            is_reply: is_reply
        });
        console.log('Original Comment Creator:', originalCommentCreatorId)
        if (newComment) {
            const notification = {
                user_id: originalCommentCreatorId,
                type: 'replied to',
                sender_id: req.session.user_id,
                receiver_id: originalCommentCreatorId,
                reference_id: newComment.id,
                entityType: 'comment'
            };
            sendNotification(notification);
        }
if (tags.length) {
    const newTags = await createTag(tags, post_id, req.session.user_id, newComment.id);

    if (newTags && Array.isArray(newTags)) {
        for (let i = 0; i < newTags.length; i++) {
            const notification = {
                user_id: newTags[i].tagged_user_id,
                type: 'tagged',
                sender_id: req.session.user_id,
                receiver_id: newTags[i].tagged_user_id,
                reference_id: newComment.id,
                entityType: 'comment' 
            };
            await sendNotification(notification); 
        }
    }
}

        console.log('')
        console.log('New Comment:', newComment)

        res.status(200).json(newComment);
    } catch (err) {
        console.error('Error', err);
        res.status(500).json({ message: 'Internal server error.', error: err.message})
    }
});

router.put('/:comment_id', withAuth, async (req, res) => {
    console.log('Received request body:', req.body);
    try {
        const {content} = req.body;
        const post_id = req.params.post_id;
        const user_id = req.session.user_id;
        const comment_id = req.params.comment_id;

        if (!user_id) {
            return res.status(403).json({message: 'You must be logged in to update a comment on a post.'});
        } else if (!comment_id) {
            return res.status(403).json({message: 'Comment not found.'});
        }

        const updatedComment = await Comment.update({
            content,
            post_id,
            user_id,
        },
        {
            where: {
                id: comment_id,
            },
        });

        console.log('Updated Comment:', updatedComment)

        res.status(200).json(updatedComment);
    } catch (err) {
        console.error('Error', err);
        res.status(500).json({ message: 'Internal server error.', error: err.message})
    }
});

router.delete('/:comment_id', withAuth, async (req, res) => {
    console.log('Received request body:', req.body);
    try {
        const user_id = req.session.user_id;
        const comment_id = req.params.comment_id;

        if (!user_id) {
            return res.status(403).json({message: 'You must be logged in to delete a comment on a post.'});
        } else if (!comment_id) {
            return res.status(403).json({message: 'Comment not found.'});
        }

        const deletedComment = await Comment.destroy({
            where: {
                id: req.params.comment_id,
            },
        });

        console.log('Deleted Comment:', deletedComment)

        res.status(200).json(deletedComment);
    } catch (err) {
        console.error('Error', err);
        res.status(500).json({ message: 'Internal server error.', error: err.message})
    }
});



router.get('/:comment_id/likes', withAuth, async (req, res) => {
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

router.get('/:comment_id/likes/:like_id', withAuth, async (req, res) => {
    try {
        const like = await CLike.findByPk(req.params.like_id);
        res.status(200).json(like);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });

    }
    });

router.post('/likes/:comment_id', withAuth, async (req, res) => {
    const { postId, postCreatorId } = req.body;
    const userId = req.session.user_id;
    const commentId = req.params.comment_id;
    const isFollower = await Follower.findOne({
        where: {
            follower_id: userId,
            following_id: postCreatorId,
        },
    });
    try {
        const newCLike = await CLike.create({
            user_id: userId,
            comment_id: commentId,
            isFollower: !!isFollower,
        });

        if (newCLike) {
            sendNotification({
                user_id: postCreatorId,
                type: 'liked',
                sender_id: userId,
                receiver_id: postCreatorId,
                reference_id: newCLike.id,
                entityType: 'comment'
            });
        }

        res.status(200).json(newCLike);
    } catch (err) {
        console.error('Error adding like to comment:', err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});
    
router.delete('/likes/:comment_id', withAuth, async (req, res) => {
    const user_id = req.session.user_id;
    console.log('Deleting like:', user_id);
    try {
        const like = await CLike.
            findOne({
                where: {
                    user_id: user_id
                },
            });
            console.log('Like:', like);
        if (!like) {
            return res.status(404).json({ message: "No like found with this id!" });
        }

        if (like.user_id !== user_id) {
            return res.status(403).json({ message: "You are not authorized to delete this like" });
        }

        await like.destroy(
            { where: { user_id: user_id } }
        );
        res.status(200).json({ message: "Like deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});



module.exports = router;