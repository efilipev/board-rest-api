const BaseService = require("../services/BaseService");
const BcryptPasswordService = require("../services/BcryptPasswordService");
const { User } = require("../db/models");

function UserService() {
    this.create = (user) => {
        BcryptPasswordService.generate(user.password).then((hash) => {
            user.password = hash;
            User.create(Object.assign({}, user)).then((savedUser) =>
                savedUser.toJSON()
            );
        });
    };

    this.findUserById = (id) => {
        return User.findOne({
            where: {
                id: id,
            },
        });
    };

    this.findUserByEmail = (email) => {
        return User.findOne({
            where: {
                email: email,
            },
        });
    };

    this.findUserByName = (name) => {
        return User.findOne({
            where: {
                name: name,
            },
        });
    };

    this.updateUser = (id, user) => {
        return User.update(user, {
            where: {
                id: id,
            },
        }).then( () => User.findOne({
            where: {
                id: id
            }
        }));
    };

    this.searchUser = (options) => {
        return User.findAll({
            where: options,
        });
    };
}

UserService.prototype = BaseService.prototype;

module.exports = UserService;
