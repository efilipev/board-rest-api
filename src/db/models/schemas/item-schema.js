const { STRING, INTEGER, DATE, NOW } = require("sequelize");
const db = require("../../../config/db");

module.exports = {
    schema: {
        created_at: { type: DATE, allowNull: false, defaultValue: NOW() },
        title: { type: STRING, allowNull: false },
        price: { type: INTEGER, allowNull: false },
        image: { type: STRING, allowNull: true },
    },
    options: {
        sequelize: db,
        createdAt: false,
        updatedAt: false,
        modelName: "items",
    },
};
