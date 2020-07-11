const { UnsupportedException, UnauthorizedException, NotFoundException } = require('../exceptions');
const { JwtTokenService, BcryptPasswordService } = require('../services');
const { login, register, currentUser, getUserById, updateUser, searchUsers } = require('../utils/paths');
const { UserService } = require('../services');
const express = require('express');

const router = express.Router();
const service = new UserService();

router.post( login, ( req, res ) => {
    if ( Object.keys( req.body ).length !== 0 ) {
        if ( req.body.email && req.body.password ) {
            service.findUserByEmail( req.body.email ).then( user => {
                const token = JwtTokenService.createToken( {
                    created: new Date(),
                    user: user.username,
                    role: 'user'
                } );
                res.status( 200 ).json( { token: token } );
            });
        } else {
            throw new UnsupportedException('password', 'Wrong email or password');
        }
    } else {
        throw new UnsupportedException('password', 'Wrong email or password');
    }
});

router.post( register, function( req, res ) {
    console.log(req.body.password)
    if ( Object.keys( req.body ).length !== 0 ) {
        BcryptPasswordService.generate( req.body.password );
        const token = JwtTokenService.createToken( {
            created: new Date(),
            user: req.body.name,
            role: 'user'
        } );
        service.create.call(this, req.body );
        res.status( 200 ).json( { token: token } );
    } else {
        throw new UnsupportedException( req.body.user.password, 'Wrong current password')
    }
});

router.get( currentUser, ( req, res ) => {
    const token = req.header( 'Authorization' ).slice(6);
    const userName = JwtTokenService.decodeToken( token );
    if ( userName ) {
        service.findUserByName( userName.aud[0] ).then( user => {
            res.status( 200 ).json( user );
        });
    } else {
        throw new UnauthorizedException();
    }
});

//TODO
router.put( updateUser, ( req, res, next ) => {

});

router.get( getUserById, ( req, res ) => {
    const { id } = req.params;
    if ( id ) {
        service.findUserById( id ).then( user => {
            res.status( 200 ).json( user );
        });
    } else {
        throw new NotFoundException();
    }
});

router.get( searchUsers, ( req, res ) => {
    const { name, email } = req.query;
    if ( name ) {
        service.findUserByName( name ).then( user => {
            res.status( 200 ).json( [ user ] );
        });
    } else if( email ) {
        service.findUserByEmail( query.email ).then( user => {
            res.status( 200 ).json( [ user ] );
        });
    } else {
        res.status( 200 ).json( [] );
    }
});

module.exports = router;
