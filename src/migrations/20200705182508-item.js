const { INTEGER, STRING, DATE, NOW } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable(
        "items",
        {
          id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          created_at: {
            type: DATE,
            allowNull: false,
            defaultValue: NOW(),
          },
          title: {
            type: STRING,
            allowNull: false,
          },
          price: {
            type: INTEGER,
            allowNull: false,
          },
          image: {
            type: STRING,
            allowNull: true,
          },
          user_id: {
            type: INTEGER,
            references: {
              model: 'users',
              as: "user",
              foreignKey: "user_id",
            }
          }
        },
        {
          options: {
            createdAt: false,
            updatedAt: false,
          },
        }
    );
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable("items");
  },
};
