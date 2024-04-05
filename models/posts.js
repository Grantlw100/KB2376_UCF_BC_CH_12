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