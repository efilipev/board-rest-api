const ava = require('ava');
const Sequalize = require('sequelize');
const userTest = require('../helpers/__data/users');
const { User }  = require('../../src/db/models');
const dbTestConfig = require('../helpers/__data/mysql');

ava.before(() => {
    setUpConnection();
});

ava('Should create a table and insert the User', t => {
    User.sync( {force: true } ).then(()=> User.create(userTest)).catch( e => console.log('Error', e));
});

function setUpConnection() {
    const db = new Sequalize(dbTestConfig.get('database'), dbTestConfig.get('username'), dbTestConfig.get('password'), dbTestConfig.get('options'));
    db.authenticate()
        .then(()=> console.log('Connected to board-api-test'))
        .catch((e)=> console.log('Error occuared', e))
}
