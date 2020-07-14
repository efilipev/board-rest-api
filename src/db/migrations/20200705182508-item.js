const { INTEGER, STRING, DATE } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable( 'items', {
      created_at: {type: DATE, allowNull: false},
      title: { type: STRING, allowNull: false },
      price: { type: INTEGER, allowNull: false },
      image: { type: STRING, allowNull: true},
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('items');
  }
};
