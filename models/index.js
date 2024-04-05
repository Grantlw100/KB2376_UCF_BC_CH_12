
const User = require('./users');
const Post = require('./posts');
const Comment = require('./comments');
const PLike = require('./PLike');
const CLike = require('./CLike');
const Follower = require('./follower');
const Tag = require('./tags');
const Notification = require('./notification')


// User-Post Associations
User.hasMany(Post, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'user_id' });

// User-Comment Associations
User.hasMany(Comment, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'user_id' });

// Post-Comment Associations
Post.hasMany(Comment, { foreignKey: 'post_id', onDelete: 'CASCADE' });
Comment.belongsTo(Post, { foreignKey: 'post_id' });

// Post-Like (PLike) Associations
User.hasMany(PLike, { foreignKey: 'user_id', onDelete: 'CASCADE' });
PLike.belongsTo(User, { foreignKey: 'user_id' });

Post.hasMany(PLike, { foreignKey: 'post_id', onDelete: 'CASCADE' });
PLike.belongsTo(Post, { foreignKey: 'post_id' });

// Comment-Like (CLike) Associations
User.hasMany(CLike, { foreignKey: 'user_id', onDelete: 'CASCADE' });
CLike.belongsTo(User, { foreignKey: 'user_id' });

Comment.hasMany(CLike, { foreignKey: 'comment_id', onDelete: 'CASCADE' });
CLike.belongsTo(Comment, { foreignKey: 'comment_id' });

// User-Follower Associations
User.belongsToMany(User, { as: 'Followers', through: Follower, foreignKey: 'following_id', otherKey: 'follower_id', onDelete: 'CASCADE' });
User.belongsToMany(User, { as: 'Following', through: Follower, foreignKey: 'follower_id', otherKey: 'following_id', onDelete: 'CASCADE' });

// Post-User Many-to-Many relationship through Tag
Post.belongsToMany(User, { through: Tag, foreignKey: 'post_id', otherKey: 'user_id', onDelete: 'CASCADE' });
User.belongsToMany(Post, { through: Tag, foreignKey: 'user_id', otherKey: 'post_id' });

// Comment hasMany Replies
Comment.hasMany(Comment, { as: 'Replies', foreignKey: 'original_comment_id', onDelete: 'CASCADE' });
Comment.belongsTo(Comment, { as: 'OriginalComment', foreignKey: 'original_comment_id' });

// Notification Associations
User.hasMany(Notification, { foreignKey: 'receiver_id', onDelete: 'CASCADE' });
Notification.belongsTo(User, { as: 'Recipient', foreignKey: 'receiver_id' });

User.hasMany(Notification, { foreignKey: 'sender_id', onDelete: 'CASCADE' });
Notification.belongsTo(User, { as: 'Sender', foreignKey: 'sender_id' });

Post.hasMany(Notification, { foreignKey: 'post_id', onDelete: 'CASCADE' });
Notification.belongsTo(Post, { foreignKey: 'post_id' });

Comment.hasMany(Notification, { foreignKey: 'comment_id', onDelete: 'CASCADE' });
Notification.belongsTo(Comment, { foreignKey: 'comment_id' });

// Tag-Comment Associations
Comment.hasMany(Tag, { foreignKey: 'comment_id', onDelete: 'CASCADE' });
Tag.belongsTo(Comment, { foreignKey: 'comment_id' });

// Tag-Post Associations
Post.hasMany(Tag, { foreignKey: 'post_id', onDelete: 'CASCADE' });
Tag.belongsTo(Post, { foreignKey: 'post_id' });

module.exports = { User, Post, Comment, PLike, CLike, Follower, Tag, Notification };

