const { Model } = require("sequelize");
const { item } = require("../models/schemas");

class Item extends Model {}

Item.init(item.schema, item.options);

module.exports = Item;
