const router = require('express').Router();
const { User, Post, Follower } = require('../../../models');
const withAuth = require('../../../utils/auth');
const sendNotification = require('../../../utils/sendNotification');


router.get('/', withAuth, async (req, res) => {
    console.log('Getting all users');
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });

    }
});

router.get('/findByUserName/:userName', withAuth, async (req, res) => {
    try {
        const loggedInUserId = req.session.user_id;
        const user = await User.findOne({
            where: { userName: req.params.userName },
        });

        console.log('User:', user);
        if (user) {
            const isFollowing = await Follower.findOne({
                where: {
                    following_id: user.id,
                    follower_id: loggedInUserId
                }
            });

            const posts = await Post.findAll({
                where: {
                    user_id: user.id
                }
            });

            const postsData = posts.map(post => ({
                id: post.id, 
                title: post.title, 
                content: post.content,
                createdAt: post.createdAt,
            }));

            console.log('Posts:', postsData);
            let myProfile = null;
            loggedInUserId === user.id ? myProfile = true : myProfile = null;

            const context = {
                profilePicture: user.profilePicture,
                bio: user.bio,
                userName: user.userName,
                name: user.name,
                isFollowing: !!isFollowing,
                posts: postsData,
                userId: user.id,
                loggedInUserId: loggedInUserId,
                logged_in: req.session.logged_in,
                myProfile: myProfile,
            };

            const template = (req.params.userName === req.session.userName) ? 'profile' : 'otherUser';

            res.render(template, context);
        } else {
            res.status(404).json({ message: "No user found with this userName!" });
        }
    } catch (err) {
        console.error('Error finding user:', err);
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

router.post('/login', async (req, res) => {
    console.log('Login attempt received', req.body); 
  
    try {
      const userData = await User.findOne({ where: { userName: req.body.userName } });
      console.log('User lookup:', userData ? 'User found' : 'User not found'); 
  
      if (!userData) {
        console.log('No user data found for userName:', req.body.userName); 
        res.status(400).json({ message: 'Account not found, please try again' });
        return;
      }
  
      const validPassword = await userData.checkPassword(req.body.password);
      console.log('Password check:', validPassword ? 'Valid password' : 'Invalid password'); 
  
      if (!validPassword) {
        console.log('Invalid password for userName:', req.body.userName); 
        res.status(400).json({ message: 'Invalid password, please try again' });
        return;
      }
  
      req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.logged_in = true;
        
        console.log('Login successful for user:', req.body.userName); 
        res.json({ user: userData, message: 'You are now logged in!' });
      });
  
    } catch (err) {
      console.error('Login error:', err); 
      res.status(500).json({ message: 'Error logging in', error: err.message });
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

router.put('/:id/subsettings', withAuth, async (req, res) => {
    console.log('Updating user settings',req.params.id,req.body);
    try {
        const { notifications_enabled, dark_mode_enabled} = req.body;
        const updatedUser = await User.update(
            {
                notificationsEnabled: notifications_enabled,
                darkModeEnabled: dark_mode_enabled,
            },
            {
                where: {
                    id: req.params.id,
                },
            }
        );

        if (updatedUser) {
            res.json({ message: 'Settings updated successfully.' });
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        console.error('Error updating user settings:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
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

router.post('/message', withAuth, async (req, res) => {
    console.log('Sending message',req.body);
    try {
        const receiver_username = req.body.receiver_id;
        const receiver = await User.findOne({ where: { userName: receiver_username } });
        if (!receiver) {
            res.status(404).json({ message: 'No user found with this username' });
            return;
        }
        const receiver_id = receiver.id;
        const message = req.body.message;
        const notification = {
            user_id: receiver_id,
            type: 'messaged',
            sender_id: req.session.user_id,
            receiver_id: receiver_id,
            reference_id: req.session.user_id,
            body: `You have a new message from ${req.session.userName}`,
            entityType: 'account',
            customMessage: message,
        };
        console.log('Sending message:', notification);
        sendNotification(notification);
        res.status(200).json({ message: 'Message sent successfully' });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });

    }
});

module.exports = router;