const jose = require('jose');

const jwtTokenService = {
    generateToken( userName ) {
        return jose.JWT.sign( userName , jose.JWK.asKey( {
            kty: 'oct',
            k: 'hJtXIZ2uSN5kbQfbtTNWbpdmhkV8FJG-Onbc6mxCcYg'
        }), {
            audience: [ userName ],
            issuer: 'https://ravenous150@gmail.com',
            expiresIn: '2 hours',
            header: {
                typ: 'JWT'
            }
        });
    },

    verifyToken() {

    }
};

module.exports = jwtTokenService;
