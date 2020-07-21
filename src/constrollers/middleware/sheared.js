const {
    UnauthorizedException
} = require('../../exceptions');

const {
    trimBearer,
    responseWithError
} = require('../../utils/http');

const withSuccessResponse = () => {
    return async (body, req, res, next) => {
        await res.status(200).json(body);
    }
};

const withAuthorization = () => {
    return async (req, res, next) => {
        const token = trimBearer(req);
        if (token) {
            next(token);
        } else {
            responseWithError(401, new UnauthorizedException(), res);
        }
    }
};

module.exports = {
    withAuthorization,
    withSuccessResponse,
};
