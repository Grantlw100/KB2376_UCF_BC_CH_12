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