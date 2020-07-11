const jose = require('jose');

const jwtTokenService = {
    createToken( payload ) {
        return jose.JWT.sign( payload , jose.JWK.asKey( {
            kty: 'oct',
            k: 'hJtXIZ2uSN5kbQfbtTNWbpdmhkV8FJG-Onbc6mxCcYg'
        }), {
            audience: [ 'Name', 'id' ],
            issuer: 'https://ravenous150@gmail.com',
            expiresIn: '2 hours',
            header: {
                typ: 'JWT'
            }
        });
    },

    decodeToken( token ) {
        return jose.JWT.decode( token, jose.JWK.asKey( {
            kty: 'oct',
            k: 'hJtXIZ2uSN5kbQfbtTNWbpdmhkV8FJG-Onbc6mxCcYg'
        }));
    }
};

module.exports = jwtTokenService;
