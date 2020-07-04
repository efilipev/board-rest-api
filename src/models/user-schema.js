const { INTEGER, STRING } = require('sequelize');

module.exports = {
    id: {
        dataType: INTEGER,
            primaryKey: true,
            autoIncrement: true,
    },
    name: {
        dataType: STRING,
            allowNull: false
    },
    password: {
        dataType: STRING,
            allowNull: false
    },
    email: {
        dataType: STRING,
            allowNull: false
    },
    phone: {
        dataType: STRING,
            allowNull: true
    }
};
