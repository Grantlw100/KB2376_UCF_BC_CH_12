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
    //used for the user who is receiving the notification
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
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    },
    message: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: 'notification',
    underscored: true,
}
);

module.exports = Notification;