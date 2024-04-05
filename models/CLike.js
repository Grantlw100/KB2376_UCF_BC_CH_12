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