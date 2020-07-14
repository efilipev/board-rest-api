const { Model } = require("sequelize");
const { user } = require("../models/schemas");
const Item = require("../models/Item");

class User extends Model {}

User.init(user.schema, user.options);

Item.belongsTo(User, {
    as: "user",
    foreignKey: "user_id",
    timestamps: false,
});

User.hasMany(Item, {
    as: "user",
    foreignKey: "user_id",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});

module.exports = User;
