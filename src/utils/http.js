const trimBearer = req => {
    if (!req.headers.authorization) return;
    return req.headers.authorization.split(' ')[1];
};

const responseWithError = (code, err, res) => {
    return res.status(code).json(err);
};

module.exports = {
    trimBearer,
    responseWithError
};
