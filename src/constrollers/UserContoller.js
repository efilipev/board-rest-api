const { UnsupportedException, UnauthorizedException, NotFoundException } = require('../exceptions');
const { JwtTokenService, BcryptPasswordService } = require('../services');
const { login, register, currentUser, getUserById, updateUser, searchUsers } = require('../utils/paths');
const { UserService } = require('../services');
const express = require('express');
const router = express.Router();

router.post( login, ( req, res ) => {
    if ( req.hasBody()) {
        if ( req.body.email ) {
            const user = UserService.findUserByEmail( req.body.email );
            const token = JwtTokenService.generateToken( user.username );
            res.status( 200 ).json( { token: token } );
        }
    } else {
        throw new UnsupportedException('password', 'Wrong email or password');
    }
});

router.post( register, ( req, res ) => {
    if ( req.hasBody() ) {
        const user = req.body;
        BcryptPasswordService.generate( user.password );
        const token = JwtTokenService.generateToken( user.username );
        UserService.save( req.body.user );
        res.status( 200 ).json( { token: token } );
    } else {
        throw new UnsupportedException( req.body.user.password, 'Wrong current password')
    }
});

router.get( currentUser, ( req, res ) => {
    const userName = JwtTokenService.decode( req.headers( 'Authorization' ));
    if ( userName ) {
        const user = UserService.findUserByName( userName );
        res.status( 200 ).json( user );
    } else {
        throw new UnauthorizedException();
    }
});

//TODO
router.put( updateUser, ( req, res, next ) => {

});

router.get( getUserById, ( req, res ) => {
    if ( req.param(' id' ) ) {
        const user = UserService.findUserById( req.params.id );
        res.status( 200 ).json( user );
    } else {
        throw new NotFoundException();
    }
});

router.get( searchUsers, ( req, res ) => {
    const query = req.query;
    if ( query.name !== null ) {
        const user = UserService.findUserByName( query.name );
        res.status( 200 ).json( user );
    } else if( query.email !== null ) {
        const user = UserService.findUserByEmail( query.email );
        res.status( 200 ).json( user );
    } else {
        res.status( 200 ).json( [] );
    }
});

module.exports = router;
