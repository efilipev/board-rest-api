const { Sequelize, DataTypes, Model } = require('sequelize');

class User extends Model {}

User.init({
        name: { dataType: String, allowNull: false },
        password: { dataType: String, allowNull: false },
        email: { dataType: String, allowNull: false},
        phone: { dataType: String, allowNull: true}
    },
    {
        sequelize,
        createdAt: false,
        modelName: User
    }
);

module.exports = User;
