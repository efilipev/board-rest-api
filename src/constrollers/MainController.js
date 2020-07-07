const express = require('express');
const { main } = require('../utils/paths');

const router = express.Router();

router.get( main, ( req, res ) => {
    res.status( 200 ).json( { message: 'Welcome on the Board!!!'} );
});

module.exports = router;
