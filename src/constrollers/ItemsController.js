const express = require('express');
const { ItemService } = require('../services');
const { NotFoundException, UnsupportedException, ForbiddenException, UnauthorizedException } = require('../exceptions');
const { getItem, updateItem, deleteItem, createItem, uploadItemImage, removeItemImage} = require('../utils/paths');

const router = express.Router();

router.get( getItem, (req, res) => {
    const itemId = req.params.id;
    if ( itemId ) {
        const item =  ItemService.findItemById( itemId );
        res.status( 200 ).json( item );
    } else {
        throw new NotFoundException();
    }
});

//TODO
router.put( updateItem, (req, res) => {});

//TODO
router.delete( deleteItem, (req, res) => {});

router.post( createItem, (req, res) => {
    const item = req.body;
    if ( item ) {
        const item = ItemService.save( item );
        res.status( 200 ).json( item );
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

//TODO
router.post( uploadItemImage, (req, res) => {});

//TODO
router.delete( removeItemImage, (req, res) => {});

module.exports = router;
