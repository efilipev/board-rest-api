const { Sequelize } = require("sequelize");
const dbConfig = require("../config/config");

const db = new Sequelize(
    dbConfig.development.database,
    dbConfig.development.username,
    dbConfig.development.password,
    dbConfig.development.options
);

db.authenticate()
    .then(() => {
        console.log("Connection has been established successfully.");
    })
    .catch((e) => {
        console.error("Unable to connect to the database:", e);
    });

module.exports = db;
