const { Model } = require('sequelize');
const userSchema = require('../models/user-schema');
const db = require('../config/db');

class User extends Model {}

User.init( userSchema,
    { sequelize: db, timestamps: false, modelName: 'user' }
);

module.exports = User;
