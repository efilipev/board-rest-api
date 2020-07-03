const { Sequelize, DataTypes, Model } = require('sequelize');
const User = require('User');

class Item extends Model{}

Item.init(
    {
        created_at: {dataType: DataTypes.DATE, allowNull: false},
        title: { dataType: String, allowNull: false },
        price: { dataType: String, allowNull: false },
        image: { dataType: String, allowNull: true},
        user_id: { dataType: String, allowNull: false},
        user: { dataType: User, allowNull: false}
    },
    {
        sequelize,
        createdAt: false,
        modelName: Item
    }
);

module.exports = Item;
