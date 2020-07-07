//const BaseService = require('../services/BaseService');
const BcryptPasswordService = require('../services/BcryptPasswordService');
const { User } = require('../db/models');

const UserService = {

    async create( user ) {
        user.password = BcryptPasswordService.generate( user.password );
        return await User.create( user );
    },

    async findUserById( id ) {
       return  await User.findOne({
            where: id
        });
    },

    async findUserByEmail() {},

    async findUserByName( name ) {},

    async updateUser(){},

    async searchUser(){}

};

module.exports = UserService;
