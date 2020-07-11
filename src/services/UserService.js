const BaseService = require('../services/BaseService');
const BcryptPasswordService = require('../services/BcryptPasswordService');
const { User } = require('../db/models');

function UserService() {

    this.create = ( user ) => {
        BcryptPasswordService.generate( user.password ).then( hash => {
            user.password = hash;
            User.create( Object.assign( {}, user) ).then( savedUser => savedUser.toJSON() );
        });
    };

    this.findUserById = ( id ) => {
        return User.findOne({
            where: {
                id: id
            }
        }).then(user => user.dataValues);
    };

    this.findUserByEmail = ( email ) =>{
        return User.findOne( {
            where: {
                email: email
            }
        }).then( user => user.dataValues );
    };

    this.findUserByName = ( name ) =>{
        return User.findOne( {
            where: {
                name: name
            }
        }).then( user => user.dataValues);
    };

    this.updateUser = ( user ) => {
        return User.update( user, {
            where: {
                id: user.id
            }
        } ).then( user => user.dataValues);
    };

    this.searchUser = ( name, email ) => {
        return User.findOne( { name: name, email: email}, {
            where: {
                name: name,
                email: email
            }
        }).then( user => user.dataValues );
    }
}

UserService.prototype = BaseService.prototype;

module.exports = UserService;
