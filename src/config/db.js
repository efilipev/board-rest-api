const { Sequelize } = require("sequelize");
const dbConfig = require('../config/mysql');

const db = new Sequelize(dbConfig.get('database'),
    dbConfig.get('username'),
    dbConfig.get('password'),
    dbConfig.get('options')
);

db.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(e => {
        console.error('Unable to connect to the database:', e);
    });

module.exports = db;
