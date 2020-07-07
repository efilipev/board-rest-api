const util = require('util');

function ForbiddenException(message = 'ForbiddenException') {
    this.status = 403;
    this.message = message;
    Error.captureStackTrace(this, ForbiddenException)
}

util.inherits(ForbiddenException, Error);
ForbiddenException.prototype.name = 'ForbiddenException';

module.exports = ForbiddenException;
