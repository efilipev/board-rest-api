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
        getterMethods: {
            getName() {
                return this.get("name");
            },
            getId() {
                return this.get("id");
            },
        },
        defaultScope: {
            attributes: {
                exclude: ["password"],
            },
        },
        timestamps: false,
        modelName: "users",
    },
};
