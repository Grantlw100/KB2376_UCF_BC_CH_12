const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

class CLike extends Model {}
CLike.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id'
        }
    },
    comment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'comment',
            key: 'id'
        }
    }, 
    isFollower: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: 'clike',
    underscored: true,
});

module.exports = CLike;

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/connection');


class Comment extends Model { }

Comment.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
            model: 'user',
            key: 'id'
        }
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
            model: 'post',
            key: 'id'
        }
    },
    tag_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        foreignKey: true,
        references: {
            model: 'tag',
            key: 'id'
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    is_reply: {
        type: DataTypes.BOOLEAN, // Correct
        allowNull: true,
        defaultValue: false
    },    
    original_comment_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        foreignKey: true,
        references: {
            model: 'comment',
            key: 'id'
        }
    }
}, {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: 'comment',
    underscored: true,
});

module.exports = Comment;


const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Follower extends Model {}

Follower.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    following_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: 'follower',
    underscored: true,
}
);

module.exports = Follower;

const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

class Notification extends Model {}
Notification.init(
{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id'
        }
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reference_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    body: {
        type: DataTypes.STRING,
        allowNull: false
    },
    entityType: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: 'notification',
    underscored: true,
}
);

module.exports = Notification;

const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

class PLike extends Model {}

PLike.init(
{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { 
            model: 'user',
            key: 'id'
        }
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'post',
            key: 'id'
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    isFollower: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    }
}, {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: 'plike',
    underscored: true,
}
);

module.exports = PLike;

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/connection');


class Post extends Model {}

Post.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
            model: 'user',
            key: 'id'
        }
    },
    shares: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    sharedPost: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    original_post_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        foreignKey: true,
        references: {
            model: 'post',
            key: 'id'
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
},
 {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: 'post',
    underscored: true,
});

module.exports = Post;

const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

class Tag extends Model {}

Tag.init(
{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    post_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'post',
            key: 'id'
        }
    },
    // This field is removed if you're tagging in comments instead
    comment_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'comment',
            key: 'id'
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        modelName: 'tag',   
        underscored: true,
    }
);

module.exports = Tag;

const { DataTypes, Model} = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class User extends Model {
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}
User.init(
    {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bio: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [8],
        },
    },
    profilePic: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
},
    {
    hooks: {
        beforeCreate: async (newUserData) => {
            newUserData.password = await bcrypt.hash(newUserData.password, 10);
            return newUserData;
        },
        beforeUpdate: async (updatedUserData) => {
            updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
            return updatedUserData;
        },
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: 'user',
    underscored: true,
}

)



module.exports = User;


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
User.hasMany(Notification, { foreignKey: 'recipient_id', onDelete: 'CASCADE' });
Notification.belongsTo(User, { as: 'Recipient', foreignKey: 'recipient_id' });

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

