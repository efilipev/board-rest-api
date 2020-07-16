const trimBearer = authorization => {
    if ( !authorization ) return;
    return authorization.slice(6);
};

const responseWithError = (code, err, res) => {
    return res.status(code).json(err);
};

module.exports = {
    trimBearer,
    responseWithError
};
