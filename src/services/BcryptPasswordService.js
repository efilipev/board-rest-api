const bcrypt = require("bcrypt");

const bcryptPasswordService = {
    generate(password) {
        return bcrypt.hash(password, 10);
    },

    comparePassword(password, hash) {
        return bcrypt.compare(password, hash);
    },
};

module.exports = bcryptPasswordService;

