index.js that splits into homeroutes and api routes

const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');

router.use('/', homeRoutes);
router.use('/api', apiRoutes);

module.exports = router;

homeroutes.js

const router = require('express').Router();
const withAuth = require('../utils/auth');
const { User, Post, Comment } = require('../models');

router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }
  res.render('login');
});

router.get('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).redirect('/');
    });
  } else {
    res.status(404).end();
  }
});

router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }],
    });

    const user = userData.get({ plain: true });

    res.render('dashboard', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/home', withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('home', {
      posts,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/help', withAuth, async (req, res) => {
  try {
    res.render('help', {
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/signup', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }
  res.render('signup');
});

router.get('/', (req, res) => {
  res.render('homepage');
});

router.get('/profile', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/post', withAuth, async (req, res) => {
  try {
    res.render('post', {
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/settings', withAuth, async (req, res) => {
  try {
    res.render('settings', {
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/messages', withAuth, async (req, res) => {
  try {
    res.render('messages', {
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

index.js that splits into the timeline routes and the profile routes 

const router = require('express').Router();
const apiRoutes = require('./profileRoutes');
const timelineRoutes = require('./timelineRoutes');

router.use('/profile', apiRoutes);
router.use('/timeline', timelineRoutes);

module.exports = router;

from the profileRoutes folder this is the index.js 
const router = require('express').Router();

const followerRoutes = require('./followerRoutes');
const postRoutes = require('./postRoutes');
const userRoutes = require('./userRoutes');

router.use('/:user_id/follow', followerRoutes);
router.use('/:user_id/posts', postRoutes);
router.use('/', userRoutes);

module.exports = router;

followerRoutes.js

const router = require('express').Router();
const withAuth = require('../../../utils/auth');
const { Follower, Notification } = require('../../../models');
const sendNotification = require('../../../utils/sendNotification');

// Followers: Since followers are directly related to users, you might consider nesting these routes under users to reflect the relationship.

// POST /api/users - User follows another user
// DELETE /api/users/:user_id/unfollow - User unfollows another user
// GET /api/usersers - List all followers of a user
// GET /api/usersing - List all users a user is following
// Posts, Comments, Tags, Likes (PLike and CLike)

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
            user_id: req.session.user_id,
            following_id: req.params.user_id,
        });
        if (newFollower) {
            const notification = {
                type: 'followed',
                sender_id: req.session.user_id,
                receiver_id: req.params.user_id,
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
    if (!req.session.user_id) {
        res.status(403).json({ message: "You are not authorized to unfollow this user" });
        return;
    }
    console.log('Removing follower',req.body);
    try {
        const followerData = await Follower.destroy({
            where: {
                user_id: req.session.user_id,
                following_id: req.params.user_id,
            },
        });
        if (!followerData) {
            res.status(404).json({ message: 'No follower found with this id!' });
            return;
        }
        res.status(200).json(followerData);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });

    }
});



module.exports = router;

postRoutes.js

const router = require('express').Router();
const withAuth = require('../../../utils/auth');
const { Post } = require('../../../models');

// Posts: /api/posts

// GET / - List all posts
// POST / - Create a new post
// GET /:id - Get a specific post
// PUT /:id - Update a specific post
// DELETE /:id - Delete a specific post

router.get('/', withAuth, async (req, res) => {
    if (!req.session.user_id || !req.session.logged_in) {
        res.status(403).json({ message: "You are not authorized to view this page" });
        return;
    }
    console.log('Getting all posts');
    try {
        const posts = await Post.findAll();
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
    try {
        const newPost = await Post.create({
            ...req.body,
            user_id: req.session.user_id,
        });
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

userRoutes.js

const router = require('express').Router();
const { User } = require('../../../models');
const withAuth = require('../../../utils/auth');

// Users: /api/users

// GET / - List all users
// POST / - Create a new user
// GET /:id - Get a specific user
// PUT /:id - Update a specific user
// DELETE /:id - Delete a specific user

router.get('/', withAuth, async (req, res) => {
    console.log('Getting all users');
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });

    }
});

router.get('/:id', withAuth, async (req, res) => {
    if (!req.params.id) {
        res.status(404).json({ message: "No user found with this id!" });
        return;
    }
    console.log('Getting user',req.params.id);
    try {
        const user = await User.findByPk(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });

    }
});

router.post('/', async (req, res) => {
    console.log('Creating user',req.body);
    try {
        const newUser = await User.create(req.body);
        res.status(200).json(newUser);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });

    }
});

router.put('/:id', withAuth, async (req, res) => {
    if (!req.params.id) {
        res.status(404).json({ message: "No user found with this id!" });
        return;
    }
    console.log('Updating user',req.params.id,req.body);
    try {
        const updatedUser = await User.update(req.body, {
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });

    }
});

router.delete('/:id', withAuth, async (req, res) => {
    if (!req.params.id) {
        res.status(404).json({ message: "No user found with this id!" });
        return;
    }
    console.log('Deleting user',req.params.id);
    try {
        const deletedUser = await User.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json(deletedUser);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });

    }
});

module.exports = router;

this is the timeline routes folder and its index.js file 

const router = require('express').Router();   

const CommentRoutes = require('./CommentRoutes');
const PLikeRoutes = require('./PLikeRoutes');
const tagRoutes = require('./tagRoutes');

router.use('/:post_id/likes', PLikeRoutes);
router.use('/:post_id/comments', CommentRoutes);
router.use('/:post_id/tags', tagRoutes);


module.exports = router;

CommentRoutes.js

const router = require('express').Router();
const { Comment, CLike, Follower } = require('../../../models');
const withAuth = require('../../../utils/auth');
const sendNotification = require('../../../utils/sendNotification');

// Comments: Comments are related to posts, so consider nesting them.

// POST /api/posts - Add a comment to a post
// PUT /api/posts/:comment_id - Update a comment
// GET /api/posts - List comments for a post
// DELETE /api/posts/:comment_id - Delete a specific comment from a post
// GET /api/posts/:comment_id - Get a specific comment from a post

// POST /api/posts/:comment_id/comments - Add a reply to a comment
// PUT /api/posts/:comment_id/comments/:reply_id - Update a
// GET /api/posts/:comment_id/comments - List replies for a comment
// DELETE /api/posts/:comment_id/comments/:reply_id - Delete a

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

router.post('/', withAuth, async (req, res) => {
    console.log('Received request body:', req.body);
    try {
        const {content} = req.body;
        const post_id = req.params.post_id;
        const user_id = req.session.user_id;

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
                type: 'commented on',
                sender_id: req.session.user_id,
                receiver_id: req.params.user_id,
                reference_id: newComment.id,
                entityType: 'post'
            };
            sendNotification(notification);
        }

        console.log('New Comment:', newComment)

        res.status(200).json(newComment);
    } catch (err) {
        console.error('Error', err);
        res.status(500).json({ message: 'Internal server error.', error: err.message})
    }
});

router.post('/:comment_id/replies', withAuth, async (req, res) => {
    console.log('Received request body:', req.body);
    try {
        const {content} = req.body;
        const post_id = req.params.post_id;
        const user_id = req.session.user_id;
        const original_comment_id = req.params.comment_id;
        const is_reply = true;

        if (!user_id) {
            return res.status(403).json({message: 'You must be logged in to reply to a comment on a post.'});
        } else if (!original_comment_id) {
            return res.status(403).json({message: 'Comment not found.'});
        }

        const newComment = await Comment.create({
            content,
            post_id,
            user_id,
            original_comment_id,
            is_reply,
        });
        if (newComment) {
            const notification = {
                type: 'replied to',
                sender_id: req.session.user_id,
                receiver_id: req.params.user_id,
                reference_id: newComment.id,
                entityType: 'comment'
            };
            sendNotification(notification);
        }

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

// router.put('/:comment_id', withAuth, async (req, res) => {
//     console.log('Received request body:', req.body);
//     try {
//         const {content} = req.body;
//         const post_id = req.params.post_id;
//         const user_id = req.session.user_id;
//         const comment_id = req.params.comment_id;

//         if (!user_id) {
//             return res.status(403).json({message: 'You must be logged in to update a comment on a post.'});
//         } else if (!comment_id) {
//             return res.status(403).json({message: 'Comment not found.'});
//         }

//         const updatedComment = await Comment.update({
//             content,
//             post_id,
//             user_id,
//         },
//         {
//             where: {comment_id, is_reply: true},
//         });

//         console.log('Updated Comment:', updatedComment)

//         res.status(200).json(updatedComment);
//     } catch (err) {
//         console.error('Error', err);
//         res.status(500).json({ message: 'Internal server error.', error: err.message})
//     }
// });


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


// router.delete('/:comment_id/replies/:comment_id', withAuth, async (req, res) => {
//     console.log('Received request body:', req.body);
//     try {
//         const user_id = req.session.user_id;
//         const comment_id = req.params.comment_id;

//         if (!user_id) {
//             return res.status(403).json({message: 'You must be logged in to delete a comment on a post.'});
//         } else if (!comment_id) {
//             return res.status(403).json({message: 'Comment not found.'});
//         }

//         const deletedComment = await Comment.destroy({
//             where: {
//                 id: req.params.comment_id, 
//                 is_reply: true
//             },
//         });

//         console.log('Deleted Comment:', deletedComment)

//         res.status(200).json(deletedComment);
//     } catch (err) {
//         console.error('Error', err);
//         res.status(500).json({ message: 'Internal server error.', error: err.message})
//     }
// });


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

router.post('/:comment_id/likes/', withAuth, async (req, res) => {
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

router.delete('/:comment_id/likes/:like_id', withAuth, async (req, res) => {
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

PLikeRoutes.js

const router = require('express').Router();
const withAuth = require('../../../utils/auth');
const { PLike, Follower } = require('../../../models');
const sendNotification = require('../../../utils/sendNotification');

// Post Likes (PLike): Likes related to posts can also be nested under posts.

// POST /api/posts/:post_id/likes - Like a post
// DELETE /api/posts/:post_id/likes/:like_id - Unlike a post
// GET /api/posts/:post_id/likes - Get likes for a post
// GET /api/posts/:post_id/likes/:like_id - Get a specific like for a post

router.get('/:post_id/likes', withAuth, async (req, res) => {
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

router.get('/:post_id/likes/:like_id', withAuth, async (req, res) => {
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

router.post('/:post_id/likes', withAuth, async (req, res) => {
    if (!req.session.user_id) {
        res.status(403).json({ message: "You are not authorized to like this post" });
        return;
    } if (!req.params.post_id) {
        res.status(404).json({ message: "No post found with this id!" });
        return;
    }
    console.log('Adding like to post',req.body);
    const user_id = req.session.user_id;
    const post_id = req.params.post_id;
    const isFollower = await Follower.findOne({
        where: {
            user_id: user_id,
            following_id: post_id,
        },
    });
    try {
        const newPLike = await PLike.create({
            user_id: user_id,
            post_id: post_id,
            isFollower: isFollower ? true : false,
        });
        if (newPLike) {
            const notification = {
                type: 'liked',
                sender_id: req.session.user_id,
                receiver_id: req.params.user_id,
                reference_id: newPLike.id,
                entityType: 'post'
            };
            sendNotification(notification);
        }
        res.status(200).json(newPLike);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });

    }
    });

router.delete('/:post_id/likes/:like_id', withAuth, async (req, res) => {
    try {
        if (!req.session.user_id) {
            res.status(403).json({ message: "You are not authorized to delete this like" });
            return;
        } else if (!req.params.post_id) {
            res.status(404).json({ message: "No post found with this id!" });
            return;
        }
        const likeData = await PLike.destroy({
            where: {
                id: req.params.like_id,
            },
        });
        if (!likeData) {
            res.status(404).json({ message: "No like found with this id!" });
            return;
        }
        res.status(200).json(likeData);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

module.exports = router;

tagRoutes.js

const withAuth = require('../../../utils/auth');
const router = require('express').Router();
const { Tag } = require('../../../models');
const { sendNotification } = require('../../../utils/sendNotification');


// Tags: If tags are used to tag users in posts, consider whether tags should be managed independently or within the context of posts.

// POST /api/posts/:postId/tags - Tag a user in a post
// GET /api/posts/:postId/tags - Get tags for a post
// DELETE /api/posts/:postId/tags/:tagId - Remove a tag from a post
// GET /api/posts/:postId/tags/:tagId - Get a specific tag for a post
// PUT /api/posts/:postId/tags/:tagId - Update a specific tag for a post

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
        const { user_id } = req.body; // Assuming user_id of the user to be tagged is sent in the request body
        const comment_id = req.params.comment_id;

        // Optional: Check if the comment exists before proceeding to tag

        const newTag = await Tag.create({
            user_id,
            comment_id: comment_id,
        });

        // Send notification about tagging
        const notification = {
            type: 'tagged',
            sender_id: req.session.user_id,
            receiver_id: user_id, // User being tagged
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