const { Sequelize, DataTypes, Model } = require('sequelize');
const User = require('src/models/User');

class Item extends Model{}

Item.init(
    {
        created_at: {dataType: DataTypes.DATE, allowNull: false},
        title: { dataType: DataTypes.STRING, allowNull: false },
        price: { dataType: DataTypes.NUMBER, allowNull: false },
        image: { dataType: DataTypes.STRING, allowNull: true},
        user_id: { dataType: DataTypes.STRING, allowNull: false},
        user: { dataType: 'User', allowNull: false}
    },
    {
        sequelize,
        createdAt: false,
        modelName: Item
    }
);

Item.hasOne(User);

module.exports = Item;
