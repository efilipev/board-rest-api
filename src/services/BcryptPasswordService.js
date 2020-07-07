const bcrypt = require('bcrypt');

const bcryptPasswordService = {
    generate( password ) {
        return bcrypt.hash( password, 10 ).then( hash => hash);
    },

    comparePassword( password, hash ) {
        return bcrypt.compare( password, hash ).then( result => result);
    }
};


module.exports = bcryptPasswordService;
