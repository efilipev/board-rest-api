const ForbiddenException = require('../exceptions/ForbiddenException');
const NotFoundException = require('../exceptions/NotFoundException');
const UnauthorizedException = require('../exceptions/UnauthorizedException');
const UnsupportedException = require('../exceptions/UnsupportedException');

class ErrorHandler extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = {
    ForbiddenException,
    NotFoundException,
    UnauthorizedException,
    UnsupportedException,
    ErrorHandler
};
