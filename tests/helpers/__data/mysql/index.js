const nf = require('nconf');
const path = require('path');

nf.argv()
    .env()
    .file({file: path.join(__dirname, 'mysql.config.tests.json')});

module.exports = nf;
