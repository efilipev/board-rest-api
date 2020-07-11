const express = require('express');
const { ItemService } = require('../services');
const { NotFoundException,
    UnsupportedException,
    ForbiddenException,
    UnauthorizedException } = require('../exceptions');
const { getItem,
    updateItem,
    deleteItem,
    createItem,
    uploadItemImage,
    removeItemImage,
    searchItems } = require('../utils/paths');

const router = express.Router();
const service = new ItemService();

router.get( getItem, (req, res) => {
    const { id } = req.params;
    if ( id ) {
        service.getItemById( id ).then( item => {
            res.status( 200 ).json( item );
        });
    } else {
        throw new NotFoundException();
    }
});

router.put( updateItem, (req, res) => {
    const auth = trimBearer(req.header('Authorization'));
    if ( auth === undefined ) {
        throw new UnauthorizedException();
    }
    const { title, price, id} = req.params;
    service.updateItem( title, price, id ).then( result => {
        if ( result === 1 ) {
            res.status(200).toJSON( {} );
        } else {
            throw new NotFoundException();
        }
    })
});

router.delete( deleteItem, (req, res) => {
    const auth = trimBearer(req.header('Authorization'));
    if ( auth === undefined ) {
        throw new UnauthorizedException();
    }
    const { id } = req.params;
    if ( id ) {
        service.deleteItem( id ).then( result => {
            if (result[0] === 1) {
                res.status(200);
            } else {
                throw new NotFoundException();
            }
        })
    }
});

router.post( createItem, (req, res) => {
    const item = req.body;
    if ( item ) {
        service.create( item ).then( item => {
            res.status( 200 ).json( item );
        });
    } else {
        if ( item === null ) {
            throw new ForbiddenException();
        }
        if ( item.title === null || item.price === null ) {
            throw new UnsupportedException( item.field, 'Title is required');
        }
        if ( item.user === null) {
            throw new UnauthorizedException();
        }
    }
});

router.post( uploadItemImage, (req, res) => {
    const auth = trimBearer(req.header('Authorization'));
    if ( auth === undefined ) {
        throw UnauthorizedException();
    }
    const { id } = req.params;
    if ( typeof id === "undefined" ) {
        throw new ForbiddenException();
    }
    service.uploadItemImage(req.body.file, id).then( result => {
        if (result[0] === 1) {
            service.getItemById( id ).then( item => {
                res.status(200).json(item);
            });
        } else {
            throw new UnsupportedException('message', `The FIle ${ req.body.file } is to big!!!`);
        }
    });
});

router.delete( removeItemImage, (req, res) => {
    const auth = trimBearer(req.header('Authorization'));
    if ( auth === undefined ) {
        throw new UnauthorizedException();
    }
    const { id } = req.params;
    if ( !id ) {
        throw new ForbiddenException();
    }
    service.removeItemImage( id ).then( result => {
        if ( result !== null ) {
            res.status(200);
        } else {
            throw new NotFoundException();
        }
    })
});

router.get( searchItems, ( req, res ) => {
    const auth = trimBearer(req.header('Authorization'));
    if ( auth === undefined ) {
        throw new UnauthorizedException();
    }
    const { title, price } = res.params;
    service.searchItems( title, price).then( result => {
        res.status(200).toJSON( [ result ]);
    })
});

const trimBearer = authorization => {
    if ( authorization === undefined ) return;
    return authorization.slice(6);
};

module.exports = router;
