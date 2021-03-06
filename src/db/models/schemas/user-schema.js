const { INTEGER, STRING } = require("sequelize");
const db = require("../../../config/db");

module.exports = {
    schema: {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: STRING,
            allowNull: false,
        },
        password: {
            type: STRING,
            allowNull: false,
            exclude: true,
        },
        email: {
            type: STRING,
            allowNull: false,
        },
        phone: {
            type: STRING,
            allowNull: true,
        },
    },
    options: {
        sequelize: db,
        defaultScope: {
            attributes: {
                exclude: ["password"],
            },
        },
        timestamps: false,
        modelName: "users",
    },
};
