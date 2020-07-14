const trimBearer = authorization => {
    if ( !authorization ) return;
    return authorization.slice(6);
};

module.exports = trimBearer;
