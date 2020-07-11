//const ava = require('ava');
const SequelizeMock = require('sequelize-mock');
const userTestData = require('../../tests/helpers/__data/users');
const { User }  = require('../../src/db/models');
const dbTestConfig = require('../helpers/__data/mysql');
const { BcryptPasswordService, UserService } = require('../../src/services');
const assert = require('assert');
const { JwtTokenService } = require('../../src/services');

const dbMock = new SequelizeMock();
const UserMock = dbMock.define('user', User);
UserMock.create( userTestData );

getUserEmail = userId => {
    return UserMock.findOne({
        where: {
            id: userId,
        },
    }).then( user => {
        return user;
    })
};



describe('getUserName', () => {
    it("should return a user's name", (done) => {
        getUserEmail(1)
            .then( user => {
                assert.strictEqual(user.name, 'Name');
                done();
            }).catch(done);
    });
});

describe('createHashPassword', () => {
    it('should be equals passwords', () => {
        const password = '12345';
        BcryptPasswordService.generate( password )
            .then( hashedPassword => BcryptPasswordService.comparePassword( password, hashedPassword))
            .then( result => {
                assert.strictEqual(true, result );
            })});
});

describe('createToken', () => {
    it('should create token and verify it', function () {
        const payload = { created: Date.now(), name: 'Name', admin: false};
        const token = JwtTokenService.createToken( payload );
        const v = JwtTokenService.verifyToken( token );
    });
});

describe( 'createUser', () => {
    it('should create user', () => {
        const tabeleName = UserMock.getTableName();
        assert.strictEqual( tabeleName, 'users');
        UserMock.findAndCountAll().then( model => {
            assert.strictEqual( model.count, 1);
        });
    });
});

describe( 'find user by id', () => {
    it('should find a user by passing id', () => {
        UserMock.findOne( {
            where: {
                id: 1
            },
            attributes: {
                exclude: 'password'
            }
        }).then( user => {
            console.log(user)
            assert.strictEqual( user.id, 1);
        });
    });
});
