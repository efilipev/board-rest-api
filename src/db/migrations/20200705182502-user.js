const { INTEGER, STRING } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('users', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: STRING,
        allowNull: false
      },
      password: {
        type: STRING,
        allowNull: false
      },
      email: {
        type: STRING,
        allowNull: false
      },
      phone: {
        type: STRING,
        allowNull: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('users');
  }
};
