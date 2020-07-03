const nf = require('nconf');
const path = require('path');

nf.argv()
    .env()
    .file({file: path.join(__dirname, 'mysql.config.json')});

module.exports = nf;
