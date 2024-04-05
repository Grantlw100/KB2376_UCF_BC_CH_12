const router = require('express').Router();
const withAuth = require('../utils/auth');
const { User, Post, Comment, Tag, CLike, PLike, Follower, Notification } = require('../models');
const { createTag, extractTags } = require('../utils/extractTags');



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
    const userFollowing = await Follower.findAll({
      where: { follower_id: req.session.user_id },
      attributes: ['following_id']
    });

    

    const following_ids = userFollowing.map(follow => follow.following_id);

    console.log("Following IDs:", following_ids);

    const postData = await Post.findAll({
      where: { user_id: following_ids },
      include: [
        {
          model: User,
          attributes: ['userName', 'profile_pic', 'id']
        },
        {
          model: PLike,
          attributes: ['id', 'createdAt','user_id']
        },
        {
          model: Tag,
          attributes: ['id']
        },
        {
          model: Comment,
          attributes: ['id', 'content', 'createdAt','user_id', 'tag_id'],
          where: { is_reply: false },
          include: [
            {
              model: CLike,
              attributes: ['id', 'createdAt','user_id']
            },
            {
              model: User,
              attributes: ['userName', 'profile_pic', 'id']
            },
            {
              model: Tag,
              attributes: ['id']
            },
            {
              model: Comment,
              as: 'Replies',
              attributes: ['id','user_id' ,'content', 'createdAt', 'tag_id', 'is_reply', 'original_comment_id'],
              include: 
                [
                  {
                    model: CLike,
                    attributes: [ 'id', 'createdAt','user_id' ],
                  },
                  {
                    model: User,
                    attributes: ['userName', 'profile_pic', 'id'],
                  },
                  {
                    model: Tag,
                    attributes: ['id'],
                  },
                  {
                    model: Comment,
                    as: 'Replies',
                    attributes: ['id', 'content', 'createdAt', 'tag_id', 'is_reply', 'original_comment_id'],
                    include: [
                      {
                        model: CLike,
                        attributes: ['id', 'createdAt','user_id']
                      },
                      {
                        model: User,
                        attributes: ['userName', 'profile_pic', 'id']
                      },
                      {
                        model: Tag,
                        attributes: ['id']
                      }]
                  }
                ] 
            },
          ],
          limit: 3 
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 10 
    });
    console.log("Raw Post Data:", JSON.stringify(postData, null, 2));

    const transformedPosts = postData.map(post => {
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        userName: post.user.userName,
        profilePictureUrl: post.user.profile_pic,
        postCreatorId: post.user.id,
        likesCount: post.plikes.length,
        createdAt: post.createdAt,
        userLiked: post.plikes.some(like => like.user_id === req.session.user_id),
        comments: post.comments.map(comment => {
          return {
            id: comment.id,
            content: comment.content,
            userName: comment.user.userName,
            commentCreatorId: comment.user.id,
            likesCount: comment.clikes.length, 
            isUserComment: comment.user_id === req.session.user_id,
            userLiked: comment.clikes.some(like => like.user_id === req.session.user_id),
            replies: comment.Replies.map(reply => {
              return {
                id: reply.id,
                content: reply.content,
                userName: reply.user.userName,
                replyCreatorId: reply.user.id,
                likesCount: reply.clikes.length, 
                isUserReply: reply.user_id === req.session.user_id,
                userLiked: reply.clikes.some(like => like.user_id === req.session.user_id),
              };
        }),
      };
    }),
  };
});
console.log("Transformed Posts:", JSON.stringify(transformedPosts, null, 2));

    
  res.render('dashboard', { posts: transformedPosts,
    logged_in: req.session.logged_in,
    loggedInUserId: req.session.user_id,
    userName: req.session.userName,
  });
  console.log("Posts:", transformedPosts);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});


router.get('/homepage', withAuth, async (req, res) => {
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
    const userSettings = await User.findByPk(req.session.user_id, {
      attributes: ['id','notifications_enabled','dark_mode_enabled']
    });
    console.log(userSettings);
    res.render('settings', {
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
      user: userSettings.get({ plain: true })
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/messages', withAuth, async (req, res) => {
  try {
      console.log('Fetching notifications for user ID:', req.session.user_id);

      const notifications = await Notification.findAll({
          where: { receiver_id: req.session.user_id },
          order: [['createdAt', 'DESC']], 
          include: [{
              model: User,
              as: 'Sender',
              attributes: ['userName']
          }]
      });

      console.log('Fetched notifications:', JSON.stringify(notifications, null, 2));

      const mappedNotifications = notifications.map(notification => ({
          id: notification.id,
          type: notification.type,
          body: notification.body,
          entityType: notification.entityType,
          createdAt: notification.createdAt,
          message: notification.message,
          senderName: notification.Sender ? notification.Sender.userName : 'Unknown', 
        }));

      console.log('Mapped notifications:', JSON.stringify(mappedNotifications, null, 2));

      const messages = mappedNotifications.filter(notification => notification.message !== null);
      const generalNotifications = mappedNotifications.filter(notification => notification.message === null);

      console.log('Messages:', JSON.stringify(messages, null, 2));
      console.log('General Notifications:', JSON.stringify(generalNotifications, null, 2));

      res.render('messages', {
          logged_in: req.session.logged_in,
          messages,
          notifications: generalNotifications
      });
  } catch (err) {
      console.error('Error fetching notifications:', err);
      res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});




module.exports = router;
