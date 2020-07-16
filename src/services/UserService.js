const BaseService = require("../services/BaseService");
const BcryptPasswordService = require("../services/BcryptPasswordService");
const { User } = require("../db/models");

function UserService() {
    this.create = user => {
        BcryptPasswordService.generate(user.password).then((hash) => {
            user.password = hash;
            User.create(Object.assign({}, user)).then((savedUser) =>
                savedUser.toJSON()
            );
        });
    };

    this.findUserById = id => {
        return User.findOne({
            attributes: {
                exclude: ['password']
            },
            where: {
                id: id,
            },
        });
    };

    this.findUserByEmail = email => {
        return User.findOne({
            attributes: {
                exclude: ['password']
            },
            where: {
                email: email,
            },
        });
    };

    this.findUserByName = name => {
        return User.findOne({
            attributes: {
                exclude: ['password']
            },
            where: {
                name: name,
            },
        });
    };

    this.findUserByEmailAndPassword = async email => {
        return await User.findOne({
            attributes: {
                include: ['id', 'name', 'password']
            },
            where: {
                email: email
            }
        });
    };

    this.updateUser = (id, user) => {
        return User.update(user, {
            where: {
                id: id,
            },
        }).then( () => User.findOne({
            attributes: {
                exclude: ['password']
            },
            where: {
                id: id
            }
        }));
    };

    this.searchUser = options => {
        return User.findAll({
            attributes: {
                exclude: ['password']
            },
            where: options,
        });
    };
}

UserService.prototype = BaseService.prototype;

module.exports = UserService;
